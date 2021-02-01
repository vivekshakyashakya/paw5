$(document).ready(function(){
  var shippingFirstName = getCookie("shipping_first_name");
  var shippingLastName = getCookie("shipping_last_name");
  var shippingAddress1 = getCookie("shipping_address1");
  var shippingAddress2 = getCookie("shipping_address2");
  var shippingCity = getCookie("shipping_city");
  var shippingState = getCookie("shipping_state");
  var shippingCountry = getCookie("shipping_country");
  var shippingZipCode = getCookie("shipping_zip_code");
  var shippingMobilePhone = getCookie("shipping_mobile_phone");
  var email = getCookie("email");
  var billingAddress1 = getCookie("billing_address1");
  var billingAddress2 = getCookie("billing_address2");
  var billingCity = getCookie("billing_city");
  var billingState = getCookie("billing_state");
  var billingZip = getCookie("billing_zip");
  var billingCountry = getCookie("billing_country");
  var billingFirstName = getCookie("billing_first_name");
  var billingLastName = getCookie("billing_last_name");
  $(".shipping-name").html(shippingFirstName);
  $(".shipping-lastname").html(shippingLastName);
  $(".shipping-address").html(shippingAddress1);
  $(".shipping-suite").html(shippingAddress2);
  $(".shipping-city").html(shippingCity);
  $(".shipping-state").html(shippingState);
  $(".shipping-country").html(shippingCountry);
  $(".shipping-phone").html(shippingMobilePhone);
  $(".shipping-zipcode").html(shippingZipCode);
  $(".email").html(email);
  $(".billing-name").html(billingFirstName);
  $(".billing-lastname").html(billingLastName);
  $(".billing-address").html(billingAddress1);
  $(".billing-suite").html(billingAddress2);
  $(".billing-city").html(billingCity);
  $(".billing-state").html(billingState);
  $(".billing-zipcode").html(billingZip);
  $(".billing-country").html(billingCountry);

  var orderInfoString = getCookie('order_info');
  if (!orderInfoString) {
    window.location.href = "index.html";
  }
  var orderInfo = JSON.parse(orderInfoString);
  var upsellsString = getCookie('upsells');
  console.log(upsellsString);
  var upsells = JSON.parse(upsellsString);
  console.log(orderInfo);
  $(".product-image").attr('src', orderInfo.product_image);
  $(".order_id").html(orderInfo.order_id);
  $(".name").html(orderInfo.name);
  var totalSubtotal = parseFloat((parseFloat(orderInfo.orderTotal) - (parseFloat(orderInfo.orderSalesTaxAmount))).toFixed(2));
  $(".subtotal").html(totalSubtotal);
  var totalPrice = parseFloat(orderInfo.orderTotal);
  var totalTaxes = parseFloat(orderInfo.orderSalesTaxAmount);
  for(var i = 0; i < upsells.length; i++) {
    var upsell = upsells[i];
    var subtotalUpsell = (parseFloat(upsell.orderTotal) - (parseFloat(upsell.orderSalesTaxAmount))).toFixed(2);
    console.log(subtotalUpsell);
    var htmlUpsell = `<div class="pb-3 mb-3 border-bottom upsell_item">
      <div class="row no-gutters">
        <div class="col-auto mr-3">
          <img src="${upsell.upsell_image}" class="border upsell_image">
        </div>
        <div class="col">
          <h4><span class="upsell_name">${upsell.name}</span> <span class="upsell_id">#${upsell.order_id}</span></h4>
          <p><span class="float-right">$<span class="upsell_price">${subtotalUpsell}</span> USD</span></p>
        </div>
      </div>
    </div>`;
    $(".upsells-container").append(htmlUpsell);
    $(".upsell_ids").append(`#${upsell.order_id} `);
    totalSubtotal += parseFloat(subtotalUpsell);
    console.log(totalSubtotal);
    totalPrice += parseFloat(upsell.orderTotal);
    totalTaxes += parseFloat(upsell.orderSalesTaxAmount);
    if (upsell.number == 2) {
      var TRANSACTION_ID = upsell.order_id;
      var ORDER_VALUE = upsell.orderTotal;
      var o = "";
      var e = "";
      if (getCookie('c_o')) {
        o = "o=" + getCookie('c_o') + "&";
      }
      if (getCookie('c_e3')) {
        e = "e=" + getCookie('c_e3') + "&";
      }
      //$("body").append('<iframe src="https://trk.honestpaws.com/p.ashx?'+o+e+'t='+TRANSACTION_ID+'&p='+ORDER_VALUE+'&fb=1" height="1" width="1" frameborder="0"></iframe>');
    }
  }
  $(".subtotal_total").html(parseFloat(totalSubtotal).toFixed(2));
  $(".taxes").html(totalTaxes.toFixed(2));
  $(".total").html(totalPrice.toFixed(2));
  $(".shipping").html("0.00");
  clearCookies();
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
function clearCookies() {
  eraseCookie("shipping_first_name");
  eraseCookie("shipping_last_name");
  eraseCookie("shipping_address1");
  eraseCookie("shipping_address2");
  eraseCookie("shipping_city");
  eraseCookie("shipping_state");
  eraseCookie("shipping_country");
  eraseCookie("shipping_zip_code");
  eraseCookie("shipping_mobile_phone");
  eraseCookie("email");
  eraseCookie("billing_address1");
  eraseCookie("billing_address2");
  eraseCookie("billing_city");
  eraseCookie("billing_state");
  eraseCookie("billing_zip");
  eraseCookie("billing_country");
  eraseCookie("billing_first_name");
  eraseCookie("billing_last_name");
  eraseCookie("order_info");
  eraseCookie("upsells");
}
function eraseCookie(name) {
    document.cookie = name+'=; Max-Age=-99999999;';
}
