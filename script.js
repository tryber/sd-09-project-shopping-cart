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

const fetchElement = () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  let element;

  const promise = fetch(endpoint)
    .then((response) => response.json())
    .then((object) => {
      return object;
    })
    .catch((err) => {
      return err;
    });
  
  return promise;
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

const putElementsOnScreen = () => {
  const responsePromise = fetchElement();

  responsePromise
    .then(response => {
      const elementsArray = response.results;

      elementsArray.forEach(element => {
        const sectionItems = document.querySelector('.items');
        const { id, title, thumbnail } = element;
        const obj = {
          sku: id,
          name: title,
          image: thumbnail,
        }
        sectionItems.appendChild(createProductItemElement(obj));
      });
    });
}

putElementsOnScreen();

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
