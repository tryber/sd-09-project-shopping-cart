function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function setLocalStorage() {
  const cartList = document.querySelector('.cart__items');
  localStorage.setItem('items', cartList.innerHTML);
}

const cartItemClickListener = (event) => {
  if (event.target.parentNode) {
    event.target.parentNode.removeChild(event.target);
    sumValueOfProducts();
    setLocalStorage();
  }
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getLocalStorage() {
  if (localStorage.getItem('items')) {
    const carttOl = document.querySelector('.cart__items');
    carttOl.addEventListener('click', cartItemClickListener);
    carttOl.innerHTML = localStorage.getItem('items');
  }
}

function emptyCart() {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    const cartList = document.querySelectorAll('.cart__item');
    cartList.forEach(item => (item.parentNode.removeChild(item)));
    setLocalStorage();
    sumValueOfProducts();
  });
}

const addProductToCart = () => {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach(button => button.addEventListener('click', (event) => {
    const getId = getSkuFromProductItem(event.target.parentNode);
    const ol = document.querySelector('.cart__items');

    const endPoint = `https://api.mercadolibre.com/items/${getId}`;
    fetch(endPoint)
      .then(response => response.json())
      .then((obj) => {
        if (obj.error) throw new Error(obj.error);
        const sku = getId;
        const name = obj.title;
        const salePrice = obj.price;
        const item = createCartItemElement({ sku, name, salePrice });
        ol.appendChild(item);
        setLocalStorage();
        sumValueOfProducts();
      })
      .catch(error => window.alert(error));
  }));
};

async function sumValueOfProducts() {
  const cartList = document.querySelectorAll('.cart__item');
  const newArr = [];
  cartList.forEach(item => newArr.push(item.innerText.split('$')[1]));
  const sum = await newArr.reduce((a, v) => (Number(a) + Number(v)).toFixed(2), 0);
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerHTML = `Total = R$ ${sum}`;
};

const fetchProducts = (product) => {
  const endPoint = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
  const section = document.querySelector('section.items');

  fetch(endPoint)
    .then(response => response.json())
    .then((object) => {
      if (object.error) {
        throw new Error(object.error);
      }
      object.results.map((result) => {
        const sku = result.id;
        const name = result.title;
        const image = result.thumbnail;
        return section.appendChild(createProductItemElement({ sku, name, image }));
      });
      addProductToCart();
      emptyCart();
    })
    .catch(error => window.alert(error));
};
window.onload = function onload() {
  fetchProducts('computador');
  getLocalStorage();
  sumValueOfProducts();
};
