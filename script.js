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
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function cartItemClickListener() {
  const itemAddButtonNodeList = document.querySelector('.items');
  const cartSection = document.querySelector('.cart');

  itemAddButtonNodeList.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      const endpoint = `https://api.mercadolibre.com/items/${event.target.parentElement.firstChild.innerText}`;

      fetch(endpoint)
        .then(response => response.json())
        .then(data => {
          const productInfo = {
            sku: data.id,
            name: data.title,
            salePrice: data.price,
          };

          const cartItemElement = createCartItemElement(productInfo);

          cartSection.appendChild(cartItemElement);
        })
        .catch(error => window.alert(error));
    }
  });
}

function fetchAPI() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const itemsSection = document.querySelector('.items');

  fetch(endpoint)
    .then(response => response.json())
    .then(data => {
      data.results.forEach((result) => {
        const obj = {
          sku: result.id,
          name: result.title,
          image: result.thumbnail,
        };

        itemsSection.appendChild(createProductItemElement(obj));
      });
    })
    .catch((error) => {
      window.alert(error);
    });
}

window.onload = function onload() {
  fetchAPI();
  cartItemClickListener();
};
