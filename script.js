function buttonClear() {
  const buttonEmpty = document.querySelector('.empty-cart');
  buttonEmpty.addEventListener('click', () => {
    const itensCart = document.querySelector('.cart__items');
    itensCart.innerHTML = '';
    localStorage.removeItem('cartShop');
  });
}


function localStorag() {
  const cartShop = document.querySelector('.cart__items');
  localStorage.setItem('cartShop', cartShop.innerHTML);
}

function cartItemClickListener(event) {
  event.target.remove();
  localStorag();
}

function retrieveStorage() {
  const cartShop = document.querySelector('.cart__items');
  const retrieveSave = localStorage.getItem('cartShop');
  cartShop.innerHTML = retrieveSave;
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

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

//  add carrinho
async function addCartShopp(idItem) {
  const recuperaId = idItem.target.parentNode.querySelector('.item__sku').innerText;
  const endPoint = `https://api.mercadolibre.com/items/${recuperaId}`;
  const response = await fetch(endPoint);
  const obj = await response.json();
  const { id: sku, title: name, price: salePrice } = obj;
  const ol = document.querySelector('.cart__items');
  const li = createCartItemElement({ sku, name, salePrice });
  ol.appendChild(li);
  localStorag();
}

function addElementCart() {
  const buttonsList = document.querySelectorAll('.item__add');
  buttonsList.forEach(button => button.addEventListener('click', addCartShopp));
}

function loading() {
  const spam = document.createElement('span');
  spam.className = 'loading';
  spam.innerText = 'loading...';
  document.body.appendChild(spam);
}

function stopLoad() {
  const load = document.querySelector('.loading');
  load.remove();
}

//  recupera elementos API
async function recuperaObjApi(search) {
  const endPoint = `https://api.mercadolibre.com/sites/MLB/search?q=${search}`;
  loading();
  const response = await fetch(endPoint);// trata o endpoint retornando uma response
  const objeto = await response.json();// a response é tratada retornado uma objeto
  const resultados = objeto.results;// retorna um o campo resultes dos objetos
  const itens = document.querySelector('.items');// recupera o element com a class  'items'
  resultados.forEach((resultado) => { // forEach para percorrer todos os objetos dos resultado
    const { id: sku, title: name, thumbnail: image } = resultado;
    const creatProduct = createProductItemElement({ sku, name, image });
    itens.appendChild(creatProduct);
    addElementCart();
  });
  stopLoad();
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

window.onload = function onload() {
  recuperaObjApi('skate');
  buttonClear();
  retrieveStorage();
};
