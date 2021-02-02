
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

const fetchElement = (item = 'computador') => {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${item}`;
  const promise = fetch(endpoint)
  .then(response => response.json())
  .then(object => object);
  return promise;
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

const addToCart = (event) => {
  const targetId = event.target.parentElement.children[0].textContent;
  const endpoint = `https://api.mercadolibre.com/items/${targetId}`;
  const elementTarget = fetch(endpoint)
  .then(response => response.json())
  .then(obj => obj);
  console.log(elementTarget);
  const { id: sku, title: name, base_price: salePrice } = elementTarget;
  console.log({ sku, name, salePrice });
};

const putElementsOnScreen = () => {
  const responsePromise = fetchElement();
  responsePromise
  .then((response) => {
    const elementsArray = response.results;
    const sectionItems = document.querySelector('.items');
    elementsArray.forEach((element) => {
      const { id: sku, title: name, thumbnail: image } = element;
      const itemHtml = createProductItemElement({ sku, name, image });
      itemHtml.lastChild.addEventListener('click', addToCart);
      sectionItems.appendChild(itemHtml);
    });
  });
};

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

window.onload = function onload() {
  putElementsOnScreen();
};
