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

function carregaLoading() {
  sectionSpan = document.querySelector('.cart');
  spanLoading = document.createElement('span');
  spanLoading.className = 'loading';
  sectionSpan.appendChild(spanLoading);
  spanLoading.innerText = 'loading';
}

function descarregaLoading() {
  sectionSpan = document.querySelector('.cart');
  spanLoading = document.querySelector('.loading');
  sectionSpan.removeChild(spanLoading);
}

async function retriveMercadoLivreResults(term) {
  carregaLoading();
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${term}`;

  const response = await fetch(endpoint);
  const object = await response.json();

  const results = object.results;
  const itemsElement = document.querySelector('.items');

  results.forEach((result) => {
    const { id: sku, title: name, thumbnail: image } = result;
    const element = createProductItemElement({ sku, name, image });
    itemsElement.appendChild(element);
  });
  descarregaLoading();
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  if (event.target.className) {
    const cartItems = document.querySelector('.cart__items');
    cartItems.removeChild(event.target);
    const itemID = extractItemID(event.target);
    removeItemFromLocalStorage(itemID);
  }
}

function btnsAddItemToCartList(){
  const btnsAddItemToCart = document.querySelector('.items');
  btnsAddItemToCart.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      const id = event.target.parentNode.firstChild.innerText;
      getProductListFromAPIByID(id);
    }
  });
}

async function getProductListFromAPIByID(id) {
  const endPoint = `https://api.mercadolibre.com/items/${id}`;
  const response = await fetch(endPoint);
  const data = await response.json();
  const productFormated = { sku: data.id, name: data.title, salePrice: data.price };
  const cartListItem = createCartItemElement(productFormated);
  const cartSection = document.querySelector('.cart__items');
  cartSection.appendChild(cartListItem);
}

window.onload = function onload() {
  retriveMercadoLivreResults('computador');
  btnsAddItemToCartList();
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
