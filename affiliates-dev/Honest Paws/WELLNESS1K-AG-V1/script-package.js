$(document).ready(function(){
  $(".btn-qualify").click(function(event){
    event.preventDefault();
    var idArray = $(this).attr("data-val");
    var productSelected = products[idArray];
    setCookie("product_selected", JSON.stringify(productSelected));
    window.location.href = "confirm.html";
  });
});
function setCookie(cname, cvalue, exdays) {
  exdays = exdays ? exdays : 1;
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + encodeURIComponent(cvalue) + ";" + expires + ";path=/";
}
