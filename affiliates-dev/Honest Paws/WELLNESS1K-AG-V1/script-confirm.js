$(document).ready(function(){
  var constraints = {
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
  };
  var form = document.getElementById('form-qualify');
  // Hook up the inputs to validate on the fly
  var inputs = document.querySelectorAll("#form-qualify input, #form-qualify select");

  for (var i = 0; i < inputs.length; ++i) {
    inputs.item(i).addEventListener("change", function(ev) {
      var errors = validate(form, constraints) || {};
      showErrorsForInput(this, errors[this.name])
    });
  }

  $(".btn-qualify").click(function(event){
    event.preventDefault();
    var errors = validate(form, constraints);
    showErrors(form, errors || {});
    if (!errors) {
      var address = $("#address").val();
      var suite = $("#suite").val();
      var city = $("#city").val();
      var shippingState = $("#shipping_state").val();
      var zipCode = $("#zip_code").val();
      var shippingCountry = $("#shipping_country").val();
      setCookie("shipping_address1", address);
      setCookie("shipping_address2", suite);
      setCookie("shipping_city", city);
      setCookie("shipping_state", shippingState);
      setCookie("shipping_country", shippingCountry);
      setCookie("shipping_zip_code", zipCode);
      window.location.href = "order.html";
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
function setCookie(cname, cvalue, exdays) {
  exdays = exdays ? exdays : 1;
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + encodeURIComponent(cvalue) + ";" + expires + ";path=/";
}
