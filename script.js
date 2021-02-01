window.onload = function onload() { };
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCartItemElement({ sku, name, salePrice }) {
  const ol = document.querySelector('ol');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  ol.appendChild(li);
  return li;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;

  if (element === 'button') {
    e.addEventListener('click', function () {
      const elementoPai = e.parentNode;
      const id = elementoPai.childNodes[0].innerText;
      const link = `https://api.mercadolibre.com/items/${id}`;

      fetch(link)
        .then(response => response.json()
          .then((clickedElement) => {
            createCartItemElement({
              sku: clickedElement.id,
              name: clickedElement.title,
              salePrice: clickedElement.price
            });
          }));
    });
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

function cartItemClickListener(event) {
  const api = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

  fetch(api)
    .then(response => response.json()
      .then((elements) => {
        elements.results.forEach((e) => {
          createProductItemElement({ sku: e.id, name: e.title, image: e.thumbnail });
        });
      }));
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

cartItemClickListener(window.onload);
