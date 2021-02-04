
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
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
async function addProductsInfo() {
  const promise = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    const object = await promise.json();
    const result = object.results;
    result.forEach(({ id: sku, title: name, thumbnail: image }) => {
      const item = createProductItemElement({ sku, name, image });
      const parentItem = document.querySelector('.items');
      parentItem.appendChild(item);
    });
}

function addInfoToLocalStorage(cardList) {
  localStorage.products = cardList.innerHTML;
}

function loadLists() {
  const cartItemsList = document.querySelector('.cart__items');
  cartItemsList.innerHTML = localStorage.products;
}

async function addCardsAndClickButtons() {
  await addProductsInfo();
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach(button => button.addEventListener('click', (e) => {
    const clickedId = e.target.parentNode.firstChild.innerText;
    fetch(`https://api.mercadolibre.com/items/${clickedId}`).then(promise => promise.json())
      .then((response) => {
        const { id, title, price } = response;
        const parentProductCart = document.querySelector('.cart__items');
        const newProduct = createCartItemElement({ sku: id, name: title, salePrice: price });
        parentProductCart.appendChild(newProduct);
        addInfoToLocalStorage(parentProductCart);
      });
}));
  const cartItem = document.querySelectorAll('.cart__item');
  cartItem.forEach(item => item.addEventListener('click', cartItemClickListener));
};

addCardsAndClickButtons();

window.onload = function onload() {
  const cleanButton = document.querySelector('.empty-cart');
  cleanButton.addEventListener('click', () => {
    const itemsList = document.querySelector('.cart__items');
    itemsList.innerHTML = '';
  });
  loadLists();
};
