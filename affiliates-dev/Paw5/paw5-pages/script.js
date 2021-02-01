var order_id;
var shipping_id;
var dataSend = {};
var shipping_price = 0;
var tax_price = 0;
var order_total = 0;
$(document).ready(function(){
  //Function to know if parameter exist on url and get the value (if === 0 not exist)
  $.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results) {
      return results[1] || 0;
    } else {
      return 0;
    }
  }
  $('#shipping_postal, #shipping_country, #shipping_state, [name=shipping_method]').change(calculateTaxes);
  //FILL THE CHECKOUT PAGE
  $('.name').html(product.name);
  $('.type').html(product.type);
  $('.subtotal').html(product.subtotal);
  $('.discounts').html(product.discounts);
  $('.discounts').html(product.discounts);
  $('.taxes').html(product.taxes);
  $('.total').html(product.total);
  $('.product-image').attr('src',product.url_image);
  $('.quantity').val(product.quantity);
  $('.shipping').html(product.shipping.toFixed(2));
  //FILL COOKIE
  fillCookie();

  $('.form-js-label').find('input').on('input', function (e) {
    $(e.currentTarget).attr('data-empty', !e.currentTarget.value);
  });
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  });

  $('#same_address').click(function(){
    this.checked?$('#billing-wrapper').hide(1000):$('#billing-wrapper').show(1000); //time for show
  });

  //URL PARAMS
  /*
  var params=[];
  window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str,key,value) {
    params[key.toString()] = value;
  });
  */
  (function() {
    // These are the constraints used to validate the form
    var constraints = {
      email: {
        presence: true,
        email: {
          message: "^Please enter a valid email address"
        }
      },
      shipping_first_name: {
        presence: true,
        format: {
          pattern: "^[A-Za-z]+$"
        }
      },
      shipping_last_name: {
        presence: true,
        format: {
          pattern: "^[A-Za-z]+$"
        }
      },
      shipping_address: {
        presence: true
      },
      shipping_suite: {
        presence: true
      },
      shipping_city: {
        presence: true
      },
      shipping_state: {
        presence: true
      },
      shipping_country: {
        presence: true
      },
      shipping_postal: {
        presence: true
      },
      shipping_phone: {
        presence: true,
        format: {
          pattern: "[0-9 ()+-]+"
        }
      },
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
            presence: true,
            format : {
              pattern: "^[A-Za-z]+$"
            }
          };
        } else {
          return null;
        }
      },
      billing_suite: function(value, attributes, attributeName, options, constraints) {
        if ($("input[name='billing_suite']").is(":visible")){
          return {
            presence: true,
            format : {
              pattern: "^[A-Za-z]+$"
            }
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
        if ($("input[name='billing_state']").is(":visible")){
          return {presence: true};
        } else {
          return null;
        }
      },
      billing_country: function(value, attributes, attributeName, options, constraints) {
        if ($("input[name='billing_country']").is(":visible")){
          return {presence: true};
        } else {
          return null;
        }
      },
      billing_postal: function(value, attributes, attributeName, options, constraints) {
        if ($("input[name='billing_postal']").is(":visible")){
          return {presence: true};
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
      card_expiry: {
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
      }
    };

    validate.validators.presence.message = "^Field is required";

    // Hook up the form so we can prevent it from being posted
    var form = document.getElementById('shopping-form');
    $("body").on('click', '#submit-button', function(event) {
        handleFormSubmit(form);
    });

    // Hook up the inputs to validate on the fly
    var inputs = document.querySelectorAll("input, select")
    for (var i = 0; i < inputs.length; ++i) {
      inputs.item(i).addEventListener("change", function(ev) {
        var errors = validate(form, constraints) || {};
        showErrorsForInput(this, errors[this.name])
      });
    }

    function handleFormSubmit(form, input) {
      // validate the form against the constraints
      var errors = validate(form, constraints);
      // then we update the form to reflect the results
      showErrors(form, errors || {});

      if (!errors) {
        $('#submit-button').addClass('disabled');
        shipping_id = $('input[name="shipping_method"]:checked').val();
        dataSend = {
          first_name: $("#shipping_first_name").val(),
          last_name: $("#shipping_last_name").val(),
          shipping_address1: $("#shipping_address").val(),
          shipping_address2: $("#shipping_suite").val(),
          shipping_city: $("#shipping_city").val(),
          shipping_state: $("#shipping_state").val(),
          shipping_zip: $("#shipping_postal").val(),
          shipping_country: $("#shipping_country").val(),
          shipping_phone: $("#shipping_phone").val().replace(/[^0-9]/g, ''),
          email: $("#email").val(),
          credit_card_type: creditCardTypeFromNumber($("#card_number").val().replace(/ /g, "")),
          credit_card_number: $("#card_number").val().replace(/ /g, ""),
          expiration_date: $("#card_expiry").val().replace('/', ''),
          cvv: $("#card_CCV").val(),
          shipping_id: $('input[name="shipping_method"]:checked').val(),
          campaign_id: product.campaign_id,
          ip_address: "127.0.0.1",
          //hardcoded offers
          offers:[{
            offer_id: product.offer_id,
            product_id: product.product_id,
            quantity: product.quantity,
            price: product.unit_price
          }]
        };
        if ($('#same_address').is(':checked')) {
          dataSend.billing_address1 = dataSend.shipping_address1;
          dataSend.billing_address2 = dataSend.shipping_address2;
          dataSend.billing_city = dataSend.shipping_city;
          dataSend.billing_state = dataSend.shipping_state;
          dataSend.billing_zip = dataSend.shipping_zip;
          dataSend.billing_country = dataSend.shipping_country;
          dataSend.billing_phone = dataSend.shipping_phone;
        } else {
          dataSend.billing_address1 = $("#billing_address").val();
          dataSend.billing_address2 = $("#billing_suite").val();
          dataSend.billing_city = $("#billing_city").val();
          dataSend.billing_state = $("#billing_state").val();
          dataSend.billing_zip = $("#billing_postal").val();
          dataSend.billing_country = $("#billing_country").val();
          dataSend.billing_phone = $("#billing_phone").val().replace(/[^0-9]/g, '');
        }
        if(getCookie('c_o')) {
          dataSend.aid = getCookie('c_o');
        }
        if(getCookie('c_affid')) {
          dataSend.affid = getCookie('c_affid');
        }
        if(getCookie('c_c1')) {
          dataSend.c1 = getCookie('c_c1');
        }
        if(getCookie('c_c2')) {
          dataSend.c2 = getCookie('c_c2');
        }
        if(getCookie('c_c3')) {
          dataSend.c3 = getCookie('c_c3');
        }
        if(getCookie('c_r')) {
          dataSend.click_id = getCookie('c_r');
        }
        if(getCookie('c_e1')) {
          dataSend.sid = getCookie('c_e1');
        }
        //var keys = Object.keys(params);
        //for(var i = 0; i < keys.length;i++){
          //dataSend[keys[i]] = params[keys[i]];
        //}

        $.ajax({
          method : 'post',
          dataType: 'json',
          crossDomain: true,
          data: dataSend,
          headers : {
            'accept' : 'application/json'
          },
          url : urlBase + 'orders',
          async : true,
          beforeSend : function() {
          },
          success : function(order) {
            if ($('#phone_offers').is(':checked') && order.customerId) {
              var customerViewData = {};
              customerViewData.customer_id = order.customerId;
              $.ajax({
                method : 'post',
                dataType: 'json',
                crossDomain: true,
                data: customerViewData,
                headers : {
                  'accept' : 'application/json'
                },
                url : urlBase + 'customer-view',
                async : true,
                beforeSend : function() {
                },
                success : function(data) {
                  var enableSmsData = {};
                  enableSmsData.contact_id = data.contact_id;
                  $.ajax({
                    method : 'post',
                    dataType: 'json',
                    crossDomain: true,
                    data: enableSmsData,
                    headers : {
                      'accept' : 'application/json'
                    },
                    url : urlBase + 'enable-sms-communication',
                    async : true,
                    beforeSend : function() {
                    },
                    success : function(data) {
                      console.log(data);
                    },
                    error : function(request, status, error) {
                      console.log('Error!', status, error, request);
                      displayErrorModal(request);
                    },
                    complete : function() {
                      console.log('Completed!!');
                    }
                  });
                },
                error : function(request, status, error) {
                  console.log('Error!', status, error, request);
                  displayErrorModal(request);
                },
                complete : function() {
                  console.log('Completed!!');
                }
              });
            }
            var state = {};
            var title = '';
            var url = 'upsell-1';
            history.pushState(state, title, url);
            dataLayer.push({
              event: 'checkout_success',
              stickyData: {
                name: product.name,
                product_id: product.product_id,
                order_id: order.order_id,
                price: order.orderTotal,
                quantity: product.quantity,
                first_name: dataSend.first_name,
                last_name: dataSend.last_name,
                email: dataSend.email,
                shipping_price: shipping_price,
                tax_price: tax_price,
                order_total: order_total,
                sku: product.sku_info
              }
            });
            order_id = order.order_id;
            $('.container-checkout').hide();
            $('.container-thankyou').show();
            $('.name').html(product.name);
            $('.type').html(product.type);
            $('.subtotal').html(product.subtotal);
            $('.subtotal_total').html(order.orderTotal);
            $('.discounts').html(product.discounts);
            $('.discounts').html(product.discounts);
            $('.taxes').html(order.orderSalesTaxAmount);
            $('.total').html(order.orderTotal);
            $('.email').html(dataSend.email);
            $('.order_id').html(order.order_id);
            $('.product-image').attr('src',product.url_image);
            $('.shipping-name').html(dataSend.first_name);
            $('.shipping-lastname').html(dataSend.last_name);
            $('.shipping-address').html(dataSend.shipping_address1);
            $('.shipping-suite').html(dataSend.shipping_address2);
            $('.shipping-city').html(dataSend.shipping_city);
            $('.shipping-state').html(dataSend.shipping_state);
            $('.shipping-zipcode').html(dataSend.shipping_zip);
            $('.shipping-country').html(dataSend.shipping_country);
            $('.shipping-phone').html(formatPhoneNumber(dataSend.shipping_phone));
            $('.mailing-name').html(dataSend.first_name);
            $('.mailing-lastname').html(dataSend.last_name);
            $('.mailing-address').html(dataSend.billing_address1);
            $('.mailing-suite').html(dataSend.billing_address2);
            $('.mailing-city').html(dataSend.billing_city);
            $('.mailing-state').html(dataSend.billing_state);
            $('.mailing-zipcode').html(dataSend.billing_zip);
            $('.mailing-country').html(dataSend.billing_country);
            $('.mailing-phone').html(formatPhoneNumber(dataSend.billing_phone));
            setTimeout(function(){
              $('#upsell_container').show();
              $('#lightSlider').lightSlider({
                gallery: true,
                item: 1,
                loop:true,
                slideMargin: 0,
                thumbItem: 5
              });
              $('.buy-upsell').click(function(){
                var upsell_product_id = $('input[name=upsell_product_id]:checked').val();
                var upsell_sku = $('input[name=upsell_product_id]:checked').attr('data-sku');
                var dataSend2 = {
                  "previous_order_id" : order_id,
                  "shipping_id" : shipping_id,
                  "offers": [{
                    "offer_id" : product.offer_id,
                    "product_id" : upsell_product_id
                  }]
                };
                if(getCookie('c_e2')) {
                  dataSend2.sid = getCookie('c_e2');
                }

                $.ajax({
                  method : 'post',
                  dataType: 'json',
                  crossDomain: true,
                  data: dataSend2,
                  headers : {
                    'accept' : 'application/json'
                  },
                  url : urlBase + 'upsells',
                  async : true,
                  beforeSend : function() {
                  },
                  success : function(upsell_created) {
                    $('.upsell_item').show();
                    $('.upsell_price').html(upsell_created.orderTotal);
                    $('.subtotal_total').html(parseFloat((parseFloat(product.subtotal) + parseFloat(upsell_created.orderTotal))).toFixed(2));
                    $('.total').html((parseFloat(order.orderTotal) + parseFloat(upsell_created.orderTotal)));
                    $('.upsell_image').attr('src', upsell.url_image);
                    $('.upsell_name').html(upsell.name);
                    dataLayer.push({
                      event: 'checkout_upsell',
                      stickyData: {
                        first_name: dataSend.first_name,
                        last_name: dataSend.last_name,
                        email: dataSend.email,
                        shipping_price: shipping_price,
                        tax_price: tax_price,
                        name: upsell.name,
                        product_id: upsell_product_id,
                        order_id: upsell_created.order_id,
                        price: upsell_created.orderTotal,
                        quantity: upsell.quantity,
                        sku: upsell_sku
                      }
                    });
                    $('#upsell_container').hide();
                    if(getCookie('c_e2')) {
                      deleteCookie('c_e2');
                    }
                  },
                  error : function(request, status, error) {
                    console.log('Error!', status, error, request);
                    displayErrorModal(request);
                  },
                  complete : function() {
                    console.log('Completed!!');
                  }
                });
              });
              $('.no-thankyou').click(function(){
                $('#upsell_container').hide();
              });
            },3000);
            if(getCookie('c_o')) {
              deleteCookie('c_o');
            }
            if(getCookie('c_affid')) {
              deleteCookie('c_affid');
            }
            if(getCookie('c_c1')) {
              deleteCookie('c_c1');
            }
            if(getCookie('c_c2')) {
              deleteCookie('c_c2');
            }
            if(getCookie('c_c3')) {
              deleteCookie('c_c3');
            }
            if(getCookie('c_r')) {
              deleteCookie('c_r');
            }
            if(getCookie('c_e1')) {
              deleteCookie('c_e1');
            }
          },
          error : function(request, status, error) {
            console.log('Error!', status, error, request);
            dataLayer.push({
              event: 'checkout_declined',
              stickyData: {
                name: product.name,
                product_id: product.product_id,
                price: product.total,
                quantity: product.quantity,
                first_name: dataSend.first_name,
                last_name: dataSend.last_name,
                email: dataSend.email,
                shipping_price: shipping_price,
                tax_price: tax_price,
                order_total: order_total,
                sku: product.sku_info
              }
            });
            displayErrorModal(request);
          },
          complete : function() {
            console.log('Completed!!');
          }
        });
      }
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

    // Updates the inputs with the validation errors
    function showErrors(form, errors) {
      // We loop through all the inputs and show the errors for that input
      _.each(form.querySelectorAll("input[name], select[name]"), function(input) {
        // Since the errors can be null if no errors were found we need to handle
        // that
        showErrorsForInput(input, errors && errors[input.name]);
      });
    }

    // Shows the errors for a specific input
    function showErrorsForInput(input, errors) {
      // This is the root of the input
      var formGroup = closestParent(input.parentNode, "form-group")
        // Find where the error messages will be insert into
        , messages = formGroup.querySelector(".messages");
      // First we remove any old messages and resets the classes
      resetFormGroup(formGroup);
      // If we have errors
      if (errors) {
        // we first mark the group has having errors
        formGroup.classList.add("has-error");
        // then we append all the errors
        _.each(errors, function(error) {
          addError(messages, error);
        });
      } else {
        // otherwise we simply mark it as success
        formGroup.classList.add("has-success");
      }
    }

    // Recusively finds the closest parent that has the specified class
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
      // and remove any old messages
      _.each(formGroup.querySelectorAll(".help-block.error"), function(el) {
        el.parentNode.removeChild(el);
      });
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
  })();
});
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
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
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
function deleteCookie(cname) {
  document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
function calculateTaxes() {
  var zipcode = $('#shipping_postal').val();
  var country = $('#shipping_country').val();
  var state = $('#shipping_state').val();
  var shipping_id = $('input[name="shipping_method"]:checked').val();
  if (zipcode && country && state && shipping_id) {
    var dataSend = {
      campaign_id: product.campaign_id,
      use_tax_provider: 1,
      shipping_id: shipping_id,
      offers: [{
        id: product.offer_id,
        product_id: product.product_id,
        billing_model_id: product.billing_model_id,
        quantity: product.quantity,
        price: product.unit_price
      }],
      location: {
        postal_code: zipcode,
        country: country,
        state: state
      }
    };
    $.ajax({
      method : 'post',
      dataType: 'json',
      crossDomain: true,
      data: dataSend,
      headers : {
        'accept' : 'application/json'
      },
      url : urlBase + 'orders/calculate/total',
      async : true,
      beforeSend : function() {
      },
      success : function(data) {
        if (data.data) {
          $('.subtotal').html(data.data.subtotal);
          $('.total').html(data.data.total);
          if (data.data.shipping) {
            $('.shipping').html(data.data.shipping.toFixed(2));
            shipping_price = data.data.shipping;
          } else {
            $('.shipping').html(product.shipping.toFixed(2));
            shipping_price = 0;
          }
          if (data.data.tax) {
            $('.taxes').html(data.data.tax.total);
            tax_price = data.data.tax.total;
          } else {
            $('.taxes').html(0);
            tax_price = 0;
          }
          order_total = data.data.total;
        }
      },
      error : function(request, status, error) {
        console.log('Error!', status, error, request);

        displayErrorModal(request);

      },
      complete : function() {
        console.log('Completed!!');
      }
    });
  }
}
function fillCookie() {
  if($.urlParam('c_o') !== 0) {
    setCookie('c_o', $.urlParam('c_o'), 7);
  }
  if($.urlParam('c_affid') !== 0) {
    setCookie('c_affid', $.urlParam('c_affid'), 7);
  }
  if($.urlParam('c_c1') !== 0) {
    setCookie('c_c1', $.urlParam('c_c1'), 7);
  }
  if($.urlParam('c_c2') !== 0) {
    setCookie('c_c2', $.urlParam('c_c2'), 7);
  }
  if($.urlParam('c_c3') !== 0) {
    setCookie('c_c3', $.urlParam('c_c3'), 7);
  }
  if($.urlParam('c_r') !== 0) {
    setCookie('c_r', $.urlParam('c_r'), 7);
  }
  if($.urlParam('c_e1') !== 0) {
    setCookie('c_e1', $.urlParam('c_e1'), 7);
  }
  if($.urlParam('c_e2') !== 0) {
    setCookie('c_e2', $.urlParam('c_e2'), 7);
  }
  if($.urlParam('c_e3') !== 0) {
    setCookie('c_e3', $.urlParam('c_e3'), 7);
  }
  if($.urlParam('c_c') !== 0) {
    setCookie('c_c', $.urlParam('c_c'), 7);
  }
  if($.urlParam('c_cmp') !== 0) {
    setCookie('c_cmp', $.urlParam('c_cmp'), 7);
  }
  if($.urlParam('utm_affid') !== 0) {
    setCookie('utm_affid', $.urlParam('utm_affid'), 7);
  }
  if($.urlParam('utm_subid') !== 0) {
    setCookie('utm_subid', $.urlParam('utm_subid'), 7);
  }
}
function displayErrorModal(request) {
  var message = request.responseJSON.message + "<br>";
  for (const property in request.responseJSON.errors) {
    message += `${request.responseJSON.errors[property]}<br>`;
  }
  $('body').append(`
    <div id="myModal" class="modal" style="display: block">
      <div class="modal-content">
        <span class="close">&times;</span>
        <h3>Oops! We could not process your payment.</h3>
        <p>
        Please try again later. Contact support if the error persists.<br>
        <a href="tel:+18447200040">+1 844-720-0040</a> | <a href="mailto:help@paw5.com">help@paw5.com</a><br/>
        <br/>
        The following error occurred:<br/>
        ${message}
        </p>
      </div>
    </div>
  `);
  var modal = document.getElementById("myModal");
  var span = document.getElementsByClassName("close")[0];
  span.onclick = function() {
    modal.remove();
  }
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.remove();
    }
  }
  $('#submit-button').removeClass('disabled');
}

// SAMPLE FIELD:   <input type="text" name="cstCCNumber" id="cstCCNumber" value=""onkeyup="cc_format('cstCCNumber','cstCCardType');">
function cc_format(ccid,ctid) {
    // supports Amex, Master Card, Visa, and Discover
    // parameter 1 ccid= id of credit card number field
    // parameter 2 ctid= id of credit card type field

    var ccNumString=document.getElementById(ccid).value;
    ccNumString=ccNumString.replace(/[^0-9]/g, '');
    // mc, starts with - 51 to 55
    // v, starts with - 4
    // dsc, starts with 6011, 622126-622925, 644-649, 65
    // amex, starts with 34 or 37
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

    // all support card types have a 4 digit firt block
    block1 = ccNumString.substring(0, 4);
    if (block1.length==4) {
        block1=block1 + ' ';
    }

    if (cType == 'Visa' || cType == 'Master Card' || cType == 'Discover') {
        // for 4X4 cards
        block2 = ccNumString.substring(4, 8);
        if (block2.length==4) {
            block2=block2 + ' ';
        }
        block3 = ccNumString.substring(8, 12);
        if (block3.length==4) {
            block3=block3 + ' ';
        }
        block4 = ccNumString.substring(12, 16);
    } else if (cType == 'American Express') {
        // for Amex cards
        block2 =  ccNumString.substring(4, 10);
        if (block2.length==6) {
            block2=block2 + ' ';
        }
        block3 =  ccNumString.substring(10, 15);
        block4='';
    } else if (cType == 'Invalid') {
        // for Amex cards
        block1 =  typeCheck;
        block2='';
        block3='';
        block4='';
    }

    formatted=block1 + block2 + block3 + block4;
    document.getElementById(ccid).value=formatted;
    //document.getElementById(ctid).value=cType;
}
function formatPhoneNumber(phoneNumberString) {
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
  var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    var intlCode = (match[1] ? '+1 ' : '')
    return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
  }
  return null
}
function formatPhoneNumberKeyUp(phoneNumberString) {
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
  var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    var intlCode = (match[1] ? '+1 ' : '')
    return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
  }
  return null
}
function formatPhone(obj) {
    var numbers = obj.value.replace(/\D/g, ''),
        char = {0:'(',3:') ',6:'-'};
    obj.value = '';
    for (var i = 0; i < numbers.length; i++) {
        obj.value += (char[i]||'') + numbers[i];
    }
}
