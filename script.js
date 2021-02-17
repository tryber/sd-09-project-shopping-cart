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

let soma = 0;

function atualizaSoma(soma) {
  document.querySelector('.somador').innerHTML = `Total: R$${soma}`;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const item = event.target;
  soma -= (Math.floor(item.innerText.split('PRICE: $')[1] * 100)) / 100;
  soma = (Math.floor(soma * 100)) / 100;
  soma = (Math.floor(soma * 100)) / 100;

  if (soma < 0) {
    soma = 0;
  }

  atualizaSoma(soma);

  item.parentElement.removeChild(item);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  const cartItems = document.querySelector('.cart__items');


  section.lastChild.addEventListener('click', async () => {
    const itemId = section.firstChild.innerText;
    const endpoint = `https://api.mercadolibre.com/items/${itemId}`;

    const response = await fetch(endpoint);
    const object = await response.json();

    const { price: salePrice } = object;

    soma += (Math.floor(salePrice * 100)) / 100;
    soma = (Math.floor(soma * 100)) / 100;
    soma = (Math.floor(soma * 100)) / 100;

    atualizaSoma(soma);

    cartItems.appendChild(createCartItemElement({ sku, name, salePrice }));
  });

  return section;
}

async function createItems() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

  const response = await fetch(endpoint);
  const object = await response.json();
  const results = object.results;

  const itemsParent = document.querySelector('.items');

  results.forEach((item) => {
    const { id: sku, title: name, thumbnail: image } = item;
    const element = createProductItemElement({ sku, name, image });
    itemsParent.appendChild(element);
  });
}

window.onload = function onload() {
  createItems();
  const cart = document.querySelector('.cart');
  const somador = document.createElement('div');
  somador.className = 'somador'
  cart.appendChild(somador);
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
