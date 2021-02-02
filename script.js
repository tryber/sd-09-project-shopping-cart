
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

function cartItemClickListener(event) {
  const target = event.target;
  target.remove(target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
const addToCart = async (event) => {
  const ol = document.querySelector('.cart__items');
  const targetId = event.target.parentElement.children[0].textContent;
  const endpoint = `https://api.mercadolibre.com/items/${targetId}`;
  const elementTarget = await fetch(endpoint)
  .then(response => response.json())
  .then(obj => obj);
  const { id: sku, title: name, price: salePrice } = elementTarget;
  const element = createCartItemElement({ sku, name, salePrice });
  ol.appendChild(element);
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

window.onload = function onload() {
  putElementsOnScreen();

  const bntClearCart = document.querySelector('.empty-cart');
  bntClearCart.addEventListener('click', () => {
    const elementsToDelete = document.querySelectorAll('.cart__item');

    if (elementsToDelete.length > 0) {
      elementsToDelete.forEach(element => {
        console.log(element);
        element.remove();
      });
    }
  });
  return 'Tudo Deletado';
};
