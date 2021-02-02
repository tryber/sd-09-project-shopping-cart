function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function calcTotalPriceCart(preprice) {
  const p = document.querySelector('p');
  const elementsLocal = Object.keys(localStorage);
  let price = preprice || 0;


  for (let index = 0; index < elementsLocal.length; index += 1) {
    const item = JSON.parse(localStorage.getItem(elementsLocal[index]));
    price += item.salePrice;
  }
  p.innerText = `${price}`;

  return price;
}

function cartItemClickListener(event) {
  localStorage.removeItem(`${event.target.innerText.substring(5, 18)}`);
  event.target.remove();
  calcTotalPriceCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const ol = document.querySelector('ol');
  const li = document.createElement('li');

  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  ol.appendChild(li);

  calcTotalPriceCart(salePrice);

  return li;
}

function addElementCartEventListener(event) {
  const elementoPai = event.target.parentNode;
  const id = elementoPai.childNodes[0].innerText;
  const link = `https://api.mercadolibre.com/items/${id}`;

  fetch(link)
    .then(response => response.json()
      .then((clickedElement) => {
        createCartItemElement({
          sku: clickedElement.id,
          name: clickedElement.title,
          salePrice: clickedElement.price,
        });
        localStorage.setItem(`${clickedElement.id}`, JSON.stringify({
          sku: clickedElement.id,
          name: clickedElement.title,
          salePrice: clickedElement.price,
        }));
      }));
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;

  if (element === 'button') {
    e.addEventListener('click', addElementCartEventListener);
  }
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const items = document.querySelector('.items');
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  items.appendChild(section);

  return section;
}

function getProducts() {
  const api = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

  fetch(api)
    .then(response => response.json()
      .then((elements) => {
        elements.results.forEach((e) => {
          createProductItemElement({ sku: e.id, name: e.title, image: e.thumbnail });
        });
      }));
}

function getCartProducts() {
  const elementsLocal = Object.keys(localStorage);

  for (let index = 0; index < elementsLocal.length; index += 1) {
    const item = JSON.parse(localStorage.getItem(elementsLocal[index]));
    createCartItemElement({
      sku: item.sku,
      name: item.name,
      salePrice: item.salePrice,
    });
  }
}

function empryCartaddEvent() {
  const empryButton = document.querySelector('.empty-cart');
  const ol = document.querySelector('ol');

  empryButton.addEventListener('click', function () {
    ol.innerText = '';
    localStorage.clear();
    calcTotalPriceCart();
  });
}

window.onload = async function onload() {
  empryCartaddEvent();
  getCartProducts();
  getProducts();
};
