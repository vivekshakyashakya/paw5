function createOrder(dataSend, success, error) {
  $.ajax({
    method : 'post',
    dataType: 'json',
    crossDomain: true,
    data: dataSend,
    headers : {
      'accept' : 'application/json'
    },
    url: urlBase + 'orders',
    async: true,
    success: success,
    error: error
  });
}
function createUpsell(dataSend, success, error) {
  $.ajax({
    method : 'post',
    dataType: 'json',
    crossDomain: true,
    data: dataSend,
    headers : {
      'accept' : 'application/json'
    },
    url: urlBase + 'upsells',
    async: true,
    success: success,
    error: error
  });
}
function calculateTotal(dataSend, success, error) {
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
    success: success,
    error: error
  });
}
function customerView(dataSend, success, error) {
  $.ajax({
    method : 'post',
    dataType: 'json',
    crossDomain: true,
    data: dataSend,
    headers : {
      'accept' : 'application/json'
    },
    url : urlBase + 'customer-view',
    async : true,
    success: success,
    error: error
  });
}
function enableSmsCommunication(dataSend, success, error){
  $.ajax({
    method : 'post',
    dataType: 'json',
    crossDomain: true,
    data: dataSend,
    headers : {
      'accept' : 'application/json'
    },
    url : urlBase + 'enable-sms-communication',
    async : true,
    success: success,
    error: error
  });
}
