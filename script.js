

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function cartItemClickListener(event) {
  const cart = document.getElementsByClassName('cart__items')[0];
  var nodes = Array.from( cart.children );
  const indexRemove = nodes.indexOf(event.target)
  let myCart = localStorage.getItem('myCart');
  let myCartJson = JSON.parse(myCart);
  let newArray = await myCartJson.products.filter(product => product !== `${event.target.textContent}`)
  console.log(newArray)
  myCartJson.products = newArray
  let MyCartString = JSON.stringify(myCartJson);
  localStorage.setItem('myCart', MyCartString);
  cart.removeChild(event.target);
  myCart = localStorage.getItem('myCart');
  console.log(myCart)
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addItemsToCart(sku, name, container) {
  const cart = document.getElementsByClassName('cart__items')[0];
  const loading = createCustomElement('div', 'loading', 'loading...');
  let jsonifyProduct = {};
  if (!jsonifyProduct.salePrice) {
    container.appendChild(loading);
  }
  const fetchedProduct = await fetch(`https://api.mercadolibre.com/items/${sku}`);
  if (!jsonifyProduct.salePrice) {
    container.appendChild(loading);
  }
  jsonifyProduct = await fetchedProduct.json();
  const { price: salePrice } = jsonifyProduct;
  const loadingElement = document.getElementsByClassName('loading')[0];
  setTimeout(async (e) => {
    container.removeChild(loadingElement);
  }, 20);
  const item = createCartItemElement({ sku, name, salePrice })
  cart.appendChild(item);
  let myCart = localStorage.getItem('myCart');
  let myCartJson = JSON.parse(myCart);
  console.log(myCartJson.products);
  myCartJson.products.push(item.textContent)
  let MyCartString = JSON.stringify(myCartJson);
  localStorage.setItem('myCart', MyCartString);
}

async function LoadProducts() {
  let jsonify = [];
  const loading = createCustomElement('div', 'loading', 'loading...');
  const container = document.getElementsByClassName('container')[0];
  container.appendChild(loading);
  const itemsUrl = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const response = await fetch(itemsUrl);
  if (!jsonify.results) {
    jsonify = await response.json();
  }
  const loadingElement = document.getElementsByClassName('loading')[0];
  container.removeChild(loadingElement);
  const products = jsonify.results;
  const sectionItems = document.getElementsByClassName('items');
  products.forEach((product) => {
    const { id: sku, title: name, thumbnail: image } = product;
    const createdproduct = createProductItemElement({ sku, name, image });
    sectionItems[0].appendChild(createdproduct);
    createdproduct.childNodes[3].addEventListener('click', async () => {
      await addItemsToCart(sku, name, container);
    });
  });
}

async function LoadCartFromLocalStorage() {
  const cacheCart = localStorage.getItem('myCart')
  const productsCache = JSON.parse(cacheCart)
  if (productsCache.products.length > 0) {
    productsCache.products.forEach( product => {
      const li = document.createElement('li');
      li.className = 'cart__item';
      li.innerText = `$${product}`;
      li.addEventListener('click', cartItemClickListener);
      const cartItems = document.getElementsByClassName('cart__items')[0];
      cartItems.appendChild(li);
    })
  }
}

window.onload = async function onload() {
  let myCart = {
    products: []
  }
  myCartString = JSON.stringify(myCart);
  let verifycCart = localStorage.getItem('myCart');
  if(!verifycCart) {
    localStorage.setItem('myCart', myCartString);
  } else {
    await LoadCartFromLocalStorage();
  }
  await LoadProducts();
};
