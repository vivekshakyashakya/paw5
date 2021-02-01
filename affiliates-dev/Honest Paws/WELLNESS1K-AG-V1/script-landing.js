$(document).ready(function(){
  $.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results) {
      return results[1] || 0;
    } else {
      return 0;
    }
  }
  fillCookie();
  var constraints = {
    first_name: {
      presence: true
    },
    last_name: {
      presence: true
    },
    email: {
      presence: true,
      email: {
        message: "^Please enter a valid email address"
      }
    },
    address: {
      presence: true
    },
    city: {
      presence: true
    },
    shipping_state: {
      presence: true
    },
    shipping_country: {
      presence: true
    },
    zip_code: {
      presence: true,
      format: {
        pattern: "^[0-9]{5}(?:-[0-9]{4})?$"
      }
    },
    mobile_phone: {
      presence: true,
      format: {
        pattern: "[0-9 ()+-]+"
      }
    }
  };
  var form = document.getElementById('shopping-form');
  // Hook up the inputs to validate on the fly
  var inputs = document.querySelectorAll("#shopping-form input, #shopping-form select");
  for (var i = 0; i < inputs.length; ++i) {
    inputs.item(i).addEventListener("change", function(ev) {
      var errors = validate(form, constraints) || {};
      showErrorsForInput(this, errors[this.name])
    });
  }
  $("#shopping-form").submit(function(event){
    event.preventDefault();

    var errors = validate(form, constraints);

    showErrors(form, errors || {});
    if (!errors) {
      var firstName = $("#first_name").val();
      var lastName = $("#last_name").val();
      var address = $("#address").val();
      var city = $("#city").val();
      var shippingState = $("#shipping_state").val();
      var shippingCountry = $("#shipping_country").val();
      var zipCode = $("#zip_code").val();
      var suite = $("#suite").val();
      var mobilePhone = $("#mobile_phone").val();
      var email = $("#email").val();
      setCookie("shipping_first_name", firstName);
      setCookie("shipping_last_name", lastName);
      setCookie("shipping_address1", address);
      setCookie("shipping_address2", suite);
      setCookie("shipping_city", city);
      setCookie("shipping_state", shippingState);
      setCookie("shipping_country", shippingCountry);
      setCookie("shipping_zip_code", zipCode);
      setCookie("shipping_mobile_phone", mobilePhone);
      setCookie("email", email);
      var isMobile = false;
      if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
          || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
        isMobile = true;
      }
      if (isMobile) {
        window.location.href = "qualify.html";
      } else {
        window.location.href = "checkout.html";
      }
    }
  });
  $(".next-page").click(function(event){
    event.preventDefault();
    var isMobile = false;
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
      isMobile = true;
    }
    if (isMobile) {
      window.location.href = "checkout.html";
    } else {
      $([document.documentElement, document.body]).animate({
          scrollTop: $("#shopping-form").offset().top
      }, 100);
    }
  });
});
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
function setCookie(cname, cvalue, exdays) {
  exdays = exdays ? exdays : 1;
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + encodeURIComponent(cvalue) + ";" + expires + ";path=/";
}
