let sum = 0;
async function sumProductsItems(prices) {
  sum += await prices;
  console.log(prices);
  document.querySelector('.total-price').innerHTML = sum;
}

function cartItemClickListener(event) {
  const li = document.querySelector('.cart__items');
  li.removeChild(event.target);
  sumProductsItems();
}

function getInfoLocalStorage() {
  const itemsLocalStorage = localStorage.getItem('itemsCart');
  const listItems = document.querySelector('.cart__items');
  listItems.innerHTML = itemsLocalStorage;
  const price = document.querySelector('.total-price');
  const pricesLocalStorage = localStorage.getItem('totalPrices');
  price.innerHTML = pricesLocalStorage;
}

function setLocalStorage() {
  const cartItems = document.querySelector('.cart__items').innerHTML;
  const totalItems = document.querySelector('.total-price').innerHTML;
  localStorage.setItem('itemsCart', cartItems);
  localStorage.setItem('totalPrices', totalItems);
}


function emptyCart() {
  const buttonEmptyCart = document.querySelector('.empty-cart');
  buttonEmptyCart.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
  });
}


function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
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

// Requisito 2 resolvido com a ajuda de Hamaji e Murilo durante os plantões.
function searchingForId(id) {
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => {
      response.json()
      .then((data) => {
        const productInfo = {
          sku: data.id,
          name: data.title,
          salePrice: data.price,
        };
        const addToCart = createCartItemElement(productInfo);
        const ol = document.querySelector('.cart__items');
        ol.appendChild(addToCart);
        sumProductsItems(productInfo.salePrice);
        setLocalStorage();
      });
    });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', (event) => {
    searchingForId(event.target.parentNode.firstChild.innerText);
  });
  section.appendChild(button);

  return section;
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */


function retrieve() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => {
      response.json()
      .then((data) => {
        data.results.map((itemsList) => {
          const product = {
            sku: itemsList.id,
            name: itemsList.title,
            image: itemsList.thumbnail,
          };
          const items = createProductItemElement(product);
          const section = document.querySelector('.items');
          return section.appendChild(items);
        });
      });
    });
}

window.onload = function onload() {
  getInfoLocalStorage();
  retrieve();
  emptyCart();
  sumProductsItems();
};
