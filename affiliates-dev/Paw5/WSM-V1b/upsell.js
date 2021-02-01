$(document).ready(function(){
  var orderInfoString = getCookie('order_info');
  if (!orderInfoString) {
    window.location.href = "index.html";
  }
  var upsell_product_id = $('input[name=upsell_product_id]:checked').val();
  $('.upsell-original-price').html("$"+upsells[upsell_product_id].original_price);
  $('.upsell-price').html("$"+upsells[upsell_product_id].price);
  var userInfoString = getCookie('user_info');
  var userInfo = JSON.parse(userInfoString);
  var orderInfo = JSON.parse(orderInfoString);
  if (orderInfo) {
    var shipping_id = getCookie('shipping_id');
    var o = "";
    var e = "";
    if (getCookie('c_o')) {
      o = "o=" + getCookie('c_o') + "&";
    }
    if (getCookie('c_e1')) {
      e = "e=" + getCookie('c_e1') + "&";
    }
    //$("body").append('<iframe src="https://trk.honestpaws.com/p.ashx?'+o+e+'t='+orderInfo.order_id+'&p='+orderInfo.orderTotal+'&fb=1" height="1" width="1" frameborder="0"></iframe>');
    $('.no-thankyou').click(function(e){
      e.preventDefault();
      window.location.href = upsells[upsell_product_id].next_page;
    });
    $('input[name=upsell_product_id]').change(function(){
      var upsell_product_id_change = $('input[name=upsell_product_id]:checked').val();
      $('.upsell-original-price').html("$"+upsells[upsell_product_id_change].original_price);
      $('.upsell-price').html("$"+upsells[upsell_product_id_change].price);
    });
    $('.buy-upsell').click(function(e){
      e.preventDefault();
      upsell_product_id = $('input[name=upsell_product_id]:checked').val();
      var upsell_sku = upsells[upsell_product_id].sku_info;
      var dataSend = {
        "previous_order_id" : orderInfo.order_id,
        "shipping_id" : shipping_id,
        "offers": [{
          "offer_id" : upsells[upsell_product_id].offer_id,
          "product_id" : upsell_product_id,
          "price" : upsells[upsell_product_id].price,
          "quantity" : $("#quantity").val()
        }]
      };
      if(getCookie('c_e2')) {
        dataSend.sid = getCookie('c_e2');
      }
      $.ajax({
        method : 'post',
        dataType: 'json',
        crossDomain: true,
        data: dataSend,
        headers : {
          'accept' : 'application/json'
        },
        url : urlBase + 'upsells',
        async : true,
        success : function(upsell_created) {
          dataLayer.push({
            event: 'checkout_upsell',
            stickyData: {
              first_name: userInfo.first_name,
              last_name: userInfo.last_name,
              email: userInfo.email,
              name: upsells[upsell_product_id].name,
              product_id: upsell_product_id,
              order_id: upsell_created.order_id,
              price: upsell_created.orderTotal,
              quantity: $("#quantity").val(),
              sku: upsells[upsell_product_id].upsell_sku
            }
          });
          upsell_created.product = upsells[upsell_product_id];
          upsell_created.quantity = $("#quantity").val();
          var upsells_string = getCookie('upsells');
          var upsellsC = JSON.parse(upsells_string);
          if (!upsellsC) {
            upsellsC = [];
          }
          upsellsC.push(upsell_created);
          setCookie("upsells", JSON.stringify(upsellsC));
          window.location.href = upsells[upsell_product_id].next_page;
        },
        error : function(request, status, error) {
          displayErrorModal(request);
        }
      });
    });
  }
});
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function setCookie(cname, cvalue, exdays) {
  exdays = exdays ? exdays : 1;
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + encodeURIComponent(cvalue) + ";" + expires + ";path=/";
}
