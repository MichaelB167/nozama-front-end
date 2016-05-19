'use strict';

// const events = require('./api/events.js');
const app = require('./api/apiurl.js');
const authUi = require('./api/ui.js');
const authApi = require('./api/ajax.js');
// const index = require('./index.js');



const cartTotal = function() {
  $('#cart-total').text(function(){
    let sum = 0;
    $('.item-total').each(function(){
      sum += parseFloat($(this).text());
    });
    app.sum = parseInt(sum*100);
    return sum;
  });
};

const displayCart = function(cart) {
  const display = require('./templates/cart.handlebars');
  $('.cartDisplay').empty().show();
  if(cart.length > 0) {
    $('.no-items').addClass('hidden');
    $('.has-items').removeClass('hidden');
    $('.cartDisplay').append(display({cart}));
    $('.item-total').text(function() {
      let price = $(this).data('price');
      let qty = $(this).data('qty');
      return qty * price;
    });
    cartTotal();
  } else {
    $('.no-items').removeClass('hidden');
    $('.has-items').addClass('hidden');
  }
  $('.delete-item').on('click', function() {
    let id = $(this).data('id');
    authApi.deleteCartItem(authUi.success, authUi.failure, id);
    $(this).parent().parent().parent().parent().fadeOut(500, function(){
      $(this).remove();
      cartTotal();
    });
  });
  $('.change-qty').on('click', function(){
    let newQty = $(this).parent().find('.new-qty').val();
    let id = $(this).data('id');
    authApi.updateCartItem(authUi.cartSuccess, authUi.failure, id, newQty);
    $(this).parent().find('.qty-display').text(newQty);
  });
};

const getCartDisplay = function(){
  $.ajax({
    url: app.api + "/cart",
    method: 'GET',
    dataType: 'json',
    headers:{
      Authorization: 'Token token=' + app.user.token,
    },
  }).done(function(data){
    displayCart(data.cart);
  });
};

const checkCart = function(cart, product) {
  let inCart = 0;
  for (let i = 0; i < cart.length; i++) {
    if(cart[i].productid === product._id) {
      inCart = parseInt(cart[i].quantity);
      break;
    }
  }
  $('#cart-add').on('click', function () {
    let id = product._id;
    let name = product.name;
    let price = product.price;
    let img = product.image;
    let qty = parseInt($('#quantity-select').val()) + inCart;
    if(inCart === 0) {
      authApi.addToCart(authUi.cartSuccess, authUi.failure, id, name, price, qty, img);
      inCart = qty;
    } else {
      authApi.updateCartItem(authUi.cartSuccess, authUi.failure, id, qty);
      inCart = qty;
    }
  });
};

const getCartCheck = function(product){
  $.ajax({
    url: app.api + "/cart",
    method: 'GET',
    dataType: 'json',
    headers:{
      Authorization: 'Token token=' + app.user.token,
    },
  }).done(function(data){
    checkCart(data.cart, product);
  });
};

module.exports = {
  checkCart,
  getCartCheck,
  getCartDisplay,
  cartTotal
};
