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

function addItems(objectApi) {
  const section = document.querySelector('.items');
  objectApi.forEach((obj) => {
    const objeto = {
      name: obj.title,
      sku: obj.id,
      image: obj.thumbnail,
    };
    section.appendChild(createProductItemElement(objeto));
  });
}

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addCart(objectApiCart) {
  const ol = document.querySelector('ol');
  const objeto = {
    name: objectApiCart.title,
    sku: objectApiCart.id,
    salePrice: objectApiCart.price,
  };
  ol.appendChild(createCartItemElement(objeto));
}

async function callApiCart(idProduct) {
  const endpoint = `https://api.mercadolibre.com/items/${idProduct}`;
  fetch(endpoint)
  .then(response => response.json())
  .then(object => addCart(object))
  .catch(() => alert('erro cart'));
}

function selectIdElement() {
  const buttons = document.querySelectorAll('button.item__add');
  buttons.forEach(button => button.addEventListener('click', () => callApiCart(button.parentNode.firstChild.innerText)));
}

function callApi(item) {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${item}`;
  fetch(endpoint)
  .then(response => response.json())
  .then((objects) => {
    addItems(objects.results);
    selectIdElement();
  })
  .catch(() => alert('erro'));
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

window.onload = function onload() {
  callApi('computador');
};
