function saveCurrentCartState() {
  const cartItemsSpecs = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', cartItemsSpecs);
}

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

async function calcCartTotalValue() {
  const cartList = document.querySelectorAll('.cart__item');
  let accumulator = 0;
  cartList.forEach(currentItem => (accumulator += parseFloat(currentItem.innerText.split('$')[1])));
  return accumulator;
}

async function displayTotalValue() {
  try {
    const totalValue = await calcCartTotalValue();
    const displayedTotal = document.createElement('span');
    displayedTotal.className = 'total-price';
    displayedTotal.innerHTML = Math.round(totalValue * 100) / 100;
    document.querySelector('.cart').appendChild(displayedTotal);
  } catch (error) {
    window.alert(error);
  }
}

function cartItemClickListener(event) {
  event.target.remove();
  saveCurrentCartState();
  displayTotalValue();
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

/**
 * Consultei o repositório da Bruna Campos para resolver essa parte.
 * Link: https://github.com/tryber/sd-09-project-shopping-cart/tree/bruna-campos-shopping-cart
*/
async function fullfillQueryResults(query) {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
  const fetchValue = await fetch(endpoint);
  const objectFetched = await fetchValue.json();
  const retrivedItems = objectFetched.results;
  const itemList = document.querySelector('.items');
  retrivedItems.forEach((currentItem) => {
    const { id: sku, title: name, thumbnail: image } = currentItem;
    const item = createProductItemElement({ sku, name, image });
    itemList.appendChild(item);
  });
}

function fetchId(sku) {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(response => response.json())
    .then((data) => {
      const productSpecs = {
        sku,
        name: data.title,
        salePrice: data.price,
      };
      const cartList = document.querySelector('.cart__items');
      cartList.appendChild(createCartItemElement(productSpecs));
      saveCurrentCartState();
    });
}

function getId() {
  const itemsTarget = document.querySelector('.items');
  itemsTarget.addEventListener('click', (event) => {
    const item = event.target.parentNode;
    const sku = item.querySelector('span.item__sku').innerText;
    fetchId(sku);
  });
}

function localStorageRetrieve() {
  const cartList = document.querySelector('.cart__items');
  cartList.innerHTML = localStorage.getItem('cart');
  cartList.addEventListener('click', ((event) => {
    if (event.target.classList.contains('cart__item')) {
      cartItemClickListener(event);
    }
  }));
}

window.onload = function onload() {
  fullfillQueryResults('computador');
  getId();
  localStorageRetrieve();
  displayTotalValue();
};
