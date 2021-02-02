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

  const sectionItems = document.querySelector('.items');
  sectionItems.appendChild(section);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function savedStorage() {
  const list = document.querySelector('.cart__items');
  localStorage.setItem('list', list.innerHTML);
}

function decreasePrices(event) {
  const getPrice = document.querySelector('.total-price').innerText;

  const searchNumber = event.target.innerText.indexOf('$');
  const number = event.target.innerText.slice(searchNumber + 1);

  const valueConvert = Number(number);
  const degree = Math.round(Number(getPrice) - valueConvert);

  document.querySelector('.total-price').innerHTML = Number(degree);
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
  decreasePrices(event);
  savedStorage();
}

async function sumPrices(price) {
  console.log(price)
  const getPrice = document.querySelector('.total-price').innerText;
  const valueConvert = Number(getPrice);
  const result = await Number(price) + valueConvert;
  console.log(result)
  document.querySelector('.total-price').innerHTML = Number(result);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  sumPrices(salePrice);

  return li;
}

function getProduct() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then((object) => {
      const product = object.results;
      product.forEach((element) => {
        const { id: sku, title: name, thumbnail: image } = element;
        createProductItemElement({ sku, name, image });
      });
    }).catch(error => window.alert(error));
}

function createCartListItem(itemList) {
  const cartItem = document.querySelector('.cart__items');
  cartItem.appendChild(itemList);
}

function searchID(id) {
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then(response => response.json())
  .then((object) => {
    const { id: sku, title: name, price: salePrice } = object;
    const itemList = createCartItemElement({ sku, name, salePrice });
    createCartListItem(itemList);
    savedStorage();
  })
  .catch(error => window.alert(error));
}

function getId(button) {
  if (button.target.className === 'item__add') {
    const id = button.target.parentNode.firstChild.innerText;
    searchID(id);
  }
}

function addList() {
  const sectionItems = document.querySelector('.items');
  sectionItems.addEventListener('click', getId);
}

function clearList() {
  const buttonClear = document.querySelector('.empty-cart');
  buttonClear.addEventListener('click', function () {
    const listCarts = document.querySelector('.cart__items');
    listCarts.innerHTML = '';
    savedStorage();
  });
}

function recovery() {
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('list');
  const list = document.querySelectorAll('.cart__item');
  list.forEach((element) => {
    element.addEventListener('click', cartItemClickListener);
  });
}

window.onload = function onload() {
  getProduct();
  addList();
  clearList();
  recovery();
};
