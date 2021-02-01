window.onload = function onload() { };

function createProductItemElement({ sku, name, image }) {
  const items = document.querySelector('.items');
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  items.appendChild(section);
}

const objectFilter = (productsDatas) => {
  const entries = Object.entries(productsDatas.results);
  entries.forEach((info) => {
    const infos = {
      sku: info[1].thumbnail,
      name: info[1].title,
      image: info[1].thumbnail,
    };
    createProductItemElement(infos);
  });
};
const selectProduct = async () => {
  const productChoise = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  try {
    const response = await fetch(productChoise);
    const object = await response.json();
    if (object.results.length === 0) {
      throw new Error('Busca inválida');
    }
    objectFilter(object);
  } catch (error) {
    alert(error);
  }
};
selectProduct();

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
