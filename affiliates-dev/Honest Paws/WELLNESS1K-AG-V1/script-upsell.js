$(document).ready(function(){
  var upsellsString = getCookie('upsells');

  console.log(upsellsString);
  var upsells = JSON.parse(upsellsString);
  console.log(upsells);
  if (upsell.number == 1) {
    var orderInfoString = getCookie('order_info');
    var orderInfo = JSON.parse(orderInfoString);
    var TRANSACTION_ID = orderInfo.order_id;
    var ORDER_VALUE = orderInfo.orderTotal;
    var o = "";
    var e = "";
    if (getCookie('c_o')) {
      o = "o=" + getCookie('c_o') + "&";
    }
    if (getCookie('c_e1')) {
      e = "e=" + getCookie('c_e1') + "&";
    }
    //$("body").append('<iframe src="https://trk.honestpaws.com/p.ashx?'+o+e+'t='+TRANSACTION_ID+'&p='+ORDER_VALUE+'&fb=1" height="1" width="1" frameborder="0"></iframe>');
  } else if (upsell.number == 2){
    var upsellsString = getCookie('upsells');
    var upsells = JSON.parse(upsellsString);
    if (upsells.length > 0) {
      var TRANSACTION_ID = upsells[0].order_id;
      var ORDER_VALUE = upsells[0].orderTotal;
      var o = "";
      var e = "";
      if (getCookie('c_o')) {
        o = "o=" + getCookie('c_o') + "&";
      }
      if (getCookie('c_e2')) {
        e = "e=" + getCookie('c_e2') + "&";
      }
      //$("body").append('<iframe src="https://trk.honestpaws.com/p.ashx?'+o+e+'t='+TRANSACTION_ID+'&p='+ORDER_VALUE+'&fb=1" height="1" width="1" frameborder="0"></iframe>');
    }
  }

  $(".no-thankyou").click(function(){
    window.location.href = upsell.next_page;
  });
  $("#buy-upsell").click(function(event){
    event.preventDefault();
    var upsellData = {};
    var order_info_string = getCookie('order_info');
    if (!order_info_string) {
      window.location.href = "index.html";
    }
    var order_info = JSON.parse(order_info_string);
    var upsellData = {
      previous_order_id: order_info.order_id,
      shipping_id: upsell.shipping_id,
      quantity: upsell.quantity,
      campaign_id: upsell.campaign_id,
      shipping_id: upsell.shipping_id,
      offers: upsell.offers
    };
    if (upsell.number == 1) {
      if(getCookie('c_e2')) {
        upsellData.sid = getCookie('c_e2');
      }
    } else if (upsell.number == 2) {
      if(getCookie('c_e3')) {
        upsellData.sid = getCookie('c_e3');
      }
    }

    createUpsell(upsellData, function(data) {
      data.name = upsell.name;
      data.upsell_image = upsell.upsell_image;
      data.number = upsell.number;
       var upsells_string = getCookie('upsells');
       var upsells = JSON.parse(upsells_string);
       if (!upsells) {
         upsells = [];
       }
       upsells.push(data);
       setCookie("upsells", JSON.stringify(upsells));
       window.location.href = upsell.next_page;
    }, function(data) {
      console.log(data);
    });
  });
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
