window.onload = function onload() { };

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
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=$${item}`;
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

putElementsOnScreen();

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

const addToCart = () => {
  console.log('deu certo');
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
