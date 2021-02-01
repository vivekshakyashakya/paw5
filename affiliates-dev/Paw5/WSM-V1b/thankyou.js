$(document).ready(function(){
  var orderInfoString = getCookie('order_info');
  if (!orderInfoString) {
    window.location.href = "index.html";
  }
  var orderInfo = JSON.parse(orderInfoString);
  var upsells = JSON.parse(getCookie('upsells'));
  var userInfo = JSON.parse(getCookie('user_info'));
  if (upsells.length > 0) {
    var lastUpsell = upsells[0];
    var o = "";
    var e = "";
    if (getCookie('c_o')) {
      o = "o=" + getCookie('c_o') + "&";
    }
    if (getCookie('c_e2')) {
      e = "e=" + getCookie('c_e2') + "&";
    }
    //$("body").append('<iframe src="https://trk.honestpaws.com/p.ashx?'+o+e+'t='+lastUpsell.order_id+'&p='+lastUpsell.orderTotal+'&fb=1" height="1" width="1" frameborder="0"></iframe>');
  }
  $(".email").html(userInfo.email);
  $(".shipping-name").html(userInfo.first_name);
  $(".shipping-lastname").html(userInfo.last_name);
  $(".shipping-address").html(userInfo.shipping_address1);
  if (userInfo.shipping_address2) {
    $(".shipping-suite").html(userInfo.shipping_address2);
  }
  $(".shipping-city").html(userInfo.shipping_city);
  $(".shipping-state").html(userInfo.shipping_state);
  $(".shipping-zipcode").html(userInfo.shipping_zip);
  $(".shipping-country").html(userInfo.shipping_country);
  $(".shipping-phone").html(userInfo.phone);
  $(".mailing-name").html(userInfo.billing_first_name);
  $(".mailing-lastname").html(userInfo.billing_last_name);
  $(".mailing-address").html(userInfo.billing_address1);
  $(".mailing-suite").html(userInfo.billing_address2);
  $(".mailing-city").html(userInfo.billing_city);
  $(".mailing-state").html(userInfo.billing_state);
  $(".mailing-zipcode").html(userInfo.billing_zip);
  $(".mailing-country").html(userInfo.billing_country);

  $(".product-image").attr('src', orderInfo.product.url_image);
  $(".order_id").html(orderInfo.order_id);
  $(".name").html(orderInfo.product.name);

  $(".subtotal").html(parseFloat((orderInfo.orderTotal)-parseFloat(orderInfo.orderSalesTaxAmount)).toFixed(2));
  var totalSubtotal = parseFloat((orderInfo.orderTotal)-parseFloat(orderInfo.orderSalesTaxAmount));
  var totalPrice = parseFloat(orderInfo.orderTotal);
  var totalTaxes = parseFloat(orderInfo.orderSalesTaxAmount);
  for(var i = 0; i < upsells.length; i++) {
    var upsell = upsells[i];
    var upsellSubtotal = parseFloat(parseFloat(upsell.orderTotal)-parseFloat(upsell.orderSalesTaxAmount)).toFixed(2);
    var htmlUpsell = `<div class="pb-3 mb-3 border-bottom upsell_item">
      <div class="row no-gutters">
        <div class="col-auto mr-3">
          <img src="${upsell.product.url_image}" class="border upsell_image">
        </div>
        <div class="col">
          <h4><span class="upsell_name">${upsell.product.name}</span> x${upsell.quantity} <span class="upsell_id">#${upsell.order_id}</span></h4>
          <p><span class="float-right">$<span class="upsell_price">${upsellSubtotal}</span> USD</span></p>
        </div>
      </div>
    </div>`;
    $(".upsells-container").append(htmlUpsell);
    $(".upsell_ids").append(`#${upsell.order_id} `);
    totalSubtotal += parseFloat(parseFloat(upsell.orderTotal) - parseFloat(upsell.orderSalesTaxAmount));
    totalPrice += parseFloat(upsell.orderTotal);
    totalTaxes += parseFloat(upsell.orderSalesTaxAmount);
  }
  $(".subtotal_total").html(totalSubtotal.toFixed(2));
  $(".taxes").html(totalTaxes.toFixed(2));
  $(".total").html(totalPrice.toFixed(2));
  $(".shipping").html("0.00");
  removeCookies();
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
function removeCookies() {
  eraseCookie("order_info");
  eraseCookie("user_info");
  eraseCookie("upsells");
}
function eraseCookie(name) {
    document.cookie = name+'=; Max-Age=-99999999;';
}
