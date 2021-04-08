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

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}


const api = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
function message() {
  const addMessage = document.querySelector('.items');
  const loadingMessage = document.createElement('p');
  loadingMessage.className = 'loading';
  loadingMessage.innerText = 'loading...';
  addMessage.appendChild(loadingMessage);
}

function removeMessage() {
  const remove = document.querySelector('.loading');
  remove.remove();
}

async function showProducts() {
  message();
  await fetch(api).then(result => result.json())
  .then((product) => {
    product.results.forEach((data) => {
      const { id: sku, thumbnail: image, title: name } = data;
      const items = document.querySelector('.items')
      .appendChild(createProductItemElement({ sku, name, image }))
      return items;
    });
    removeMessage();
  });
}

window.onload = function onload() { 
  showProducts();
};
