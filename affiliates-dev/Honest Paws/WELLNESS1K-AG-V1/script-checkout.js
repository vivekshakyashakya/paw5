$(document).ready(function(){
  var constraints = {
    billing_first_name: function(value, attributes, attributeName, options, constraints) {
      if ($("input[name='billing_first_name']").is(":visible")){
        return {presence: true};
      } else {
        return null;
      }
    },
    billing_last_name: function(value, attributes, attributeName, options, constraints) {
      if ($("input[name='billing_last_name']").is(":visible")){
        return {presence: true};
      } else {
        return null;
      }
    },
    billing_address: function(value, attributes, attributeName, options, constraints) {
      if ($("input[name='billing_address']").is(":visible")){
        return {
          presence: true
        };
      } else {
        return null;
      }
    },
    billing_city: function(value, attributes, attributeName, options, constraints) {
      if ($("input[name='billing_city']").is(":visible")){
        return {presence: true};
      } else {
        return null;
      }
    },
    billing_state: function(value, attributes, attributeName, options, constraints) {
      if ($("select[name='billing_state']").is(":visible")){
        return {presence: true};
      } else {
        return null;
      }
    },
    billing_country: function(value, attributes, attributeName, options, constraints) {
      if ($("select[name='billing_country']").is(":visible")){
        return {presence: true};
      } else {
        return null;
      }
    },
    billing_postal: function(value, attributes, attributeName, options, constraints) {
      if ($("input[name='billing_postal']").is(":visible")){
        return {
          presence: true,
          format: {
            pattern: "^[0-9]{5}(?:-[0-9]{4})?$"
          }
        };
      } else {
        return null;
      }
    },
    card_number: {
      presence: true,
      format: {
        pattern: /^((34|37|4|5[1-5]).*)|(1444 4444 4444 4440)|(1444 4444 4444 4441)$/,
        message: function(value, attribute, validatorOptions, attributes, globalOptions) {
          return validate.format("^%{num} is not a valid credit card number", {
            num: value
          });
        }
      },
      length: function(value, attributes, attributeName, options, constraints) {
        if (value) {
          // Amex
          if ((/^(34|37).*$/).test(value)) return {
            is: 17
          };
          // Visa, Mastercard
          if ((/^(4|5[1-5]).*$/).test(value)) return {
            is: 19
          };
        }
        // Unknown card, don't validate length
        return false;
      },
    },
    card_name: {
      presence: true
    },
    card_CCV: {
      presence: true,
      format: {
        pattern: "[0-9]+",
        message: "can only contain numbers"
      },
      length: {
        minimum: 3,
        maximum: 4
      }
    },
    card_expiry: {
      presence: true
    },
  };
  var form = document.getElementById('form-checkout');
  // Hook up the inputs to validate on the fly
  var inputs = document.querySelectorAll("#form-checkout input, #form-checkout select");

  for (var i = 0; i < inputs.length; ++i) {
    inputs.item(i).addEventListener("change", function(ev) {
      var errors = validate(form, constraints) || {};
      showErrorsForInput(this, errors[this.name])
    });
  }

  var shippingFirstName = getCookie("shipping_first_name");
  var shippingLastName = getCookie("shipping_last_name");
  var shippingAddress = getCookie("shipping_address1");
  var shippingAddress2 = getCookie("shipping_address2");
  var shippingCity = getCookie("shipping_city");
  var shippingState = getCookie("shipping_state");
  var shippingCountry = getCookie("shipping_country");
  var shippingZipCode = getCookie("shipping_zip_code");
  var shippingMobilePhone = getCookie("shipping_mobile_phone");
  var email = getCookie("email");
  $("#submit-button").click(function(){
    var errors = validate(form, constraints);
    showErrors(form, errors || {});
    if (!errors) {
      var productSelect = $("input[name='productSelect']:checked").val();
      var orderData = {
        first_name: shippingFirstName,
        last_name: shippingLastName,
        shipping_address1: shippingAddress,
        shipping_city: shippingCity,
        shipping_state: shippingState,
        shipping_zip: shippingZipCode,
        shipping_country: shippingCountry,
        phone: shippingMobilePhone,
        email: email
      };
      if (shippingAddress2) {
        orderData.shipping_address2 = shippingAddress2;
      }
      orderData.credit_card_type = creditCardTypeFromNumber($("#card_number").val().replace(/ /g, ""));
      orderData.credit_card_number = $("#card_number").val().replace(/ /g, "");
      orderData.expiration_date = $("#card_expiry").val().replace('/', '');
      orderData.cvv = $("#card_CCV").val();
      orderData.shipping_id = products[productSelect].shipping_id;
      orderData.campaign_id = products[productSelect].campaign_id;

      orderData.offers = [{
          offer_id: products[productSelect].offer_id,
          product_id: products[productSelect].product_id,
          quantity: products[productSelect].quantity,
          price: products[productSelect].unit_price.toFixed(3)
      }];

      var sameaddress = $("input[name='sameaddress']:checked").val();
      if (sameaddress == "no") {
        orderData.billing_address1 = $("#billing_address").val();
        if ($("#billing_suite").val()) {
          orderData.billing_address2= $("#billing_suite").val();
        }
        orderData.billing_city = $("#billing_city").val();
        orderData.billing_state = $("#billing_state").val();
        orderData.billing_zip = $("#billing_postal").val();
        orderData.billing_country = $("#billing_country").val();
        orderData.billing_first_name = $("#billing_first_name").val();
        orderData.billing_last_name = $("#billing_last_name").val();
      } else {
        orderData.billing_address1 = orderData.shipping_address1;
        if (orderData.shipping_address2) {
          orderData.billing_address2 = orderData.shipping_address2;
        }
        orderData.billing_city = orderData.shipping_city;
        orderData.billing_state = orderData.shipping_state;
        orderData.billing_zip = orderData.shipping_zip;
        orderData.billing_country = orderData.shipping_country;
        orderData.billing_first_name = orderData.first_name;
        orderData.billing_last_name = orderData.last_name;
      }
      if(getCookie('c_o')) {
        orderData.aid = getCookie('c_o');
      }
      if(getCookie('c_affid')) {
        orderData.affid = getCookie('c_affid');
      }
      if(getCookie('c_c1')) {
        orderData.c1 = getCookie('c_c1');
      }
      if(getCookie('c_c2')) {
        orderData.c2 = getCookie('c_c2');
      }
      if(getCookie('c_c3')) {
        orderData.c3 = getCookie('c_c3');
      }
      if(getCookie('c_r')) {
        orderData.click_id = getCookie('c_r');
      }
      if(getCookie('c_e1')) {
        orderData.sid = getCookie('c_e1');
      }
      createOrder(orderData, function(data){
        data.name = products[productSelect].name;
        data.product_image = products[productSelect].product_image;
        setCookie("billing_address1", orderData.billing_address1);
        setCookie("billing_address2", (orderData.billing_address2 ? orderData.billing_address2 : ""));
        setCookie("billing_city", orderData.billing_city);
        setCookie("billing_state", orderData.billing_state);
        setCookie("billing_zip", orderData.billing_zip);
        setCookie("billing_country", orderData.billing_country);
        setCookie("billing_first_name", orderData.billing_first_name);
        setCookie("billing_last_name", orderData.billing_last_name);
        setCookie("order_info", JSON.stringify(data));
        setCookie("upsells", "[]");

        window.location.href = "upsell1.html";
      }, function(data){
        $(".error-request").html(data.responseJSON.message.substring(data.responseJSON.message.indexOf("||")+2).trim());
      })
    }
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
function creditCardTypeFromNumber(num) {
  // first, sanitize the number by removing all non-digit characters.
  num = num.replace(/[^\d]/g,'');
  // now test the number against some regexes to figure out the card type.
  if (num.match(/^5[1-5]\d{14}$/)) {
   return 'master';
  } else if (num.match(/^4\d{15}/) || num.match(/^4\d{12}/)) {
   return 'visa';
  } else if (num.match(/^3[47]\d{13}/)) {
   return 'amex';
  } else if (num.match(/^6011\d{12}/)) {
   return 'discover';
 } else if (num == '1444444444444440' || num == '1444444444444441') {
   return 'visa';
  } else {
   return '';
  }
}
function cc_format(event,ccid,ctid) {
    var ccNumString=document.getElementById(ccid).value;
    ccNumString=ccNumString.replace(/[^0-9]/g, '');
    var typeCheck = ccNumString.substring(0, 2);
    var cType='';
    var block1='';
    var block2='';
    var block3='';
    var block4='';
    var formatted='';
    if  (typeCheck.length==2) {
        typeCheck=parseInt(typeCheck);
        if (typeCheck >= 40 && typeCheck <= 49) {
            cType='Visa';
        } else if (typeCheck >= 51 && typeCheck <= 55) {
            cType='Master Card';
        } else if ((typeCheck >= 60 && typeCheck <= 62) || (typeCheck == 64) || (typeCheck == 65)) {
            cType='Discover';
        } else if (typeCheck==34 || typeCheck==37) {
            cType='American Express';
        } else if (typeCheck == 14) {
            cType='Visa';
        } else {
            cType='Invalid';
        }
    }
    block1 = ccNumString.substring(0, 4);
    if (block1.length==4) {
        block1=block1;
        if (ccNumString.length > 4) {
          block1=block1 + ' ';
        }
    }
    if (cType == 'Visa' || cType == 'Master Card' || cType == 'Discover') {
        block2 = ccNumString.substring(4, 8);
        if (block2.length==4) {
            block2=block2;
            if (ccNumString.length > 8) {
              block2=block2 + ' ';
            }
        }
        block3 = ccNumString.substring(8, 12);
        if (block3.length==4) {
            block3=block3;
            if (ccNumString.length > 12) {
              block3=block3 + ' ';
            }
        }
        block4 = ccNumString.substring(12, 16);
    } else if (cType == 'American Express') {
        block2 =  ccNumString.substring(4, 10);
        if (block2.length==6) {
            block2=block2;
            if (ccNumString.length > 10) {
              block2=block2 + ' ';
            }
        }
        block3 =  ccNumString.substring(10, 15);
        block4='';
    } else if (cType == 'Invalid') {
        block1 =  typeCheck;
        block2='';
        block3='';
        block4='';
    }

    formatted=block1 + block2 + block3 + block4;
    document.getElementById(ccid).value=formatted;
    //document.getElementById(ctid).value=cType;
}
function formatString(e) {
  var inputChar = String.fromCharCode(event.keyCode);
  var code = event.keyCode;
  var allowedKeys = [8];
  if (allowedKeys.indexOf(code) !== -1) {
    return;
  }
  event.target.value = event.target.value.replace(
    /^([1-9]\/|[2-9])$/g, '0$1/' // 3 > 03/
  ).replace(
    /^(0[1-9]|1[0-2])$/g, '$1/' // 11 > 11/
  ).replace(
    /^([0-1])([3-9])$/g, '0$1/$2' // 13 > 01/3
  ).replace(
    /^(0?[1-9]|1[0-2])([0-9]{2})$/g, '$1/$2' // 141 > 01/41
  ).replace(
    /^([0]+)\/|[0]+$/g, '0' // 0/ > 0 and 00 > 0
  ).replace(
    /[^\d\/]|^[\/]*$/g, '' // To allow only digits and `/`
  ).replace(
    /\/\//g, '/' // Prevent entering more than 1 `/`
  );
}
// Updates the inputs with the validation errors
function showErrors(form, errors) {
  // We loop through all the inputs and show the errors for that input
  var formArray = form.querySelectorAll("input[name], select[name]");
  for(var i = 0; i < formArray.length; i++) {
    var input = formArray[i];
    showErrorsForInput(input, errors && errors[input.name]);
  }
}

// Shows the errors for a specific input
function showErrorsForInput(input, errors) {
  // This is the root of the input
  var formGroup = closestParent(input.parentNode, "form-group");
    // Find where the error messages will be insert into
  var messages = formGroup.querySelector(".messages");
  // First we remove any old messages and resets the classes
  resetFormGroup(formGroup);
  // If we have errors
  if (errors) {
    // we first mark the group has having errors
    formGroup.classList.add("has-error");
    // then we append all the errors
    for (var i = 0; i < errors.length; i++) {
      addError(messages, errors[i]);
    }
  } else {
    // otherwise we simply mark it as success
    formGroup.classList.add("has-success");
  }
}
function closestParent(child, className) {
  if (!child || child == document) {
    return null;
  }
  if (child.classList.contains(className)) {
    return child;
  } else {
    return closestParent(child.parentNode, className);
  }
}
function resetFormGroup(formGroup) {
  // Remove the success and error classes
  formGroup.classList.remove("has-error");
  formGroup.classList.remove("has-success");

  var formArray = formGroup.querySelectorAll(".help-block.error");
  // and remove any old messages
  for (var i = 0; i < formArray.length; i++) {
    formArray[i].parentNode.removeChild(formArray[i]);
  }
}

// Adds the specified error with the following markup
// <p class="help-block error">[message]</p>
function addError(messages, error) {
  var block = document.createElement("p");
  block.classList.add("help-block");
  block.classList.add("error");
  block.innerText = error;
  messages.appendChild(block);
}
function setCookie(cname, cvalue, exdays) {
  exdays = exdays ? exdays : 1;
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + encodeURIComponent(cvalue) + ";" + expires + ";path=/";
}
