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

function atualizaSoma(valor, sinal) {
  const somador = document.querySelector('.somador');
  if (sinal === '+') {
    somador.innerHTML = Number(Math.floor(somador.innerHTML * 100) / 100) + valor;
  } else {
    somador.innerHTML = Number(Math.floor(somador.innerHTML * 100) / 100) - valor;
  }
  const partesSoma = somador.innerHTML.split('.');
  const decimal = partesSoma[1];
  if (decimal !== undefined) {
    somador.innerHTML = `${partesSoma[0]}.${decimal.slice(0, 2)}`;
  }
  if (Number(somador.innerHTML) < 0) {
    somador.innerHTML = '0';
  }
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const item = event.target;

  let preco = (Math.floor(item.innerText.split('PRICE: $')[1] * 100)) / 100;
  preco = Math.floor(preco * 100) / 100;

  atualizaSoma(preco, '-');

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

    let preco = (Math.floor(salePrice * 100)) / 100;
    preco = Math.floor(preco * 100) / 100;

    atualizaSoma(preco, '+');

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
  somador.className = 'somador';
  somador.innerHTML = '0';
  cart.appendChild(somador);
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
