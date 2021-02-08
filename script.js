function sumItems() {
  const itemsCart = document.querySelectorAll('.cart__item');
  const price = [];
  itemsCart.forEach((item) => {
    // parseFloat pega a string e transforma em float
    // (numeros com casas decimais);
    price.push(parseFloat(item.innerText.split('$')[1]));
  });

  let totalPrice = 0;

  if (price.length > 0) {
    totalPrice = price.reduce((prev, cur) => prev + cur);
  }
  document.querySelector('.total-price').innerText = totalPrice;
}

function createTotalPrice() {
  const price = document.createElement('spam');
  price.className = 'total-price';
  price.innerText = 0;
  document.querySelector('.cart').appendChild(price);
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}
// trazer as coisas da api para cá ok
// eu preciso id = sku, name= title, image = thumbnail
// como eu acesso essas informações? através de buscas de objetos
// console.log(createProductItemElement({ sku, name, image }));

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function salveLocalStorage() {
  const cartItems = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('.cart__items', cartItems);
}


function cartItemClickListener(event) {
  event.target.remove();
  // excluíndo os itens do carrinho
  salveLocalStorage();
  sumItems();
}

function loadLocalStorage() {
  const itemLocalStorage = localStorage.getItem('.cart__items');
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerHTML = itemLocalStorage;
  // Trazer os itens do localStorage para a tela

  const cartItem = document.querySelectorAll('.cart__item');
  // console.log(cartItem)
  cartItem.forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
    // Conseguir excluir as coisas após carregar a página;
  });
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function apiCart(productId) {
  const endpoint = `https://api.mercadolibre.com/items/${productId}`;
  try {
    const response = await fetch(endpoint);
    const product = await response.json();

    // console.log(object);
    const itemsElement = document.querySelector('.cart__items');
    const { id: sku, title: name, price: salePrice } = product;
    const element = createCartItemElement({ sku, name, salePrice });
    itemsElement.appendChild(element);
    localStorage.setItem('.cart__items',
      document.querySelector('.cart__items').innerHTML);
    // itemsElement é equivalente ao carrinho
    sumItems();
  } catch (error) {
    window.alert(error);
  }
}

// capturando o botão
// Selecionar o produto
// Enviá-lo para o carrinho
function addEventCart() {
  const buttonCart = document.querySelector('.items');
  buttonCart.addEventListener('click', function (event) {
    if (event.target.tagName === 'BUTTON') {
      // capturando somente o button, ignorando outros elementos
      const productId = event.target.parentNode.childNodes[0].innerText;
      // console.log(productId);
      apiCart(productId);
    }
  });
}

function removeAllProduct() {
  const buttonCart = document.querySelector('.empty-cart');
  buttonCart.addEventListener('click', function (event) {
    const removeItems = document.querySelector('.cart__items');
    removeItems.innerHTML = '';
    localStorage.clear('.cart__items', removeItems);
    sumItems();
  });
}

function createLoading() {
  const loading = document.createElement('spam');
  loading.innerText = 'loading...';
  loading.className = 'loading';
  loading.style.fontSize = '36px';
  loading.style.color = 'red';
  document.querySelector('.items').appendChild(loading);
}

function deleteLoading() {
  const loading = document.querySelector('.loading');
  loading.remove();
}

async function apiAdd() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  createLoading();
  try {
    const response = await fetch(endpoint);
    const object = await response.json();
    const result = object.results;
    // console.log(object);
    const itemsElement = document.querySelector('.items');

    result.forEach((results) => {
      const { id: sku, title: name, thumbnail: image } = results;
      const element = createProductItemElement({ sku, name, image });
      itemsElement.appendChild(element);
    });
    deleteLoading();
  } catch (error) {
    window.alert(error);
  }
}

window.onload = function onload() {
  apiAdd();
  addEventCart();
  removeAllProduct();
  createTotalPrice();
  loadLocalStorage();
};
