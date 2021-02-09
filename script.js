function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

async function sumPrices(price) {
  const paragraph = document.querySelector('.total-price');
  const value = Number(paragraph.innerText);
  paragraph.innerText = value + price;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function generateLoad() {
  const section = document.querySelector('.items');
  section.appendChild(createCustomElement('p', 'loading', 'loading...'));
}

function removeLoad() {
  document.querySelector('.items').removeChild(document.querySelector('.loading'));
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

function cartItemClickListener(event) {
  event.target.remove(localStorage.clear());
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}


function fetchProductById(itemId) {
  const url = `https://api.mercadolibre.com/items/${itemId}`;
  const cartItem = document.querySelector('.cart__items');
  fetch(url)
  .then(response => response.json())
  .then((product) => {
    const item = product;
    const obj = {
      sku: item.id,
      name: item.title,
      salePrice: item.price,
    };
    cartItem.appendChild(createCartItemElement(obj));
  });
}

function saveOnLocalStorage(itemObj) {
  const storage = localStorage.getItem('List');
  const parseItem = JSON.parse(storage);
  if (parseItem == null) {
    const arr = [];
    arr.push(itemObj);
    localStorage.setItem('List', JSON.stringify(arr));
  } else {
    parseItem.push(itemObj);
    localStorage.setItem('List', JSON.stringify(parseItem));
  }
}

async function fetchProducts() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const htmlElement = document.querySelector('.items');
  generateLoad();
  await fetch(url)
  .then(response => response.json())
  .then((pc) => {
    const itens = pc.results;
    itens.forEach((element) => {
      const itemObj = {
        sku: element.id,
        name: element.title,
        image: element.thumbnail,
        salePrice: element.price,
      };
      const section = createProductItemElement(itemObj);
      htmlElement.appendChild(section);

      const btn = section.lastChild;
      btn.addEventListener('click', () => {
        const elementId = btn.parentNode.querySelector('.item__sku');
        fetchProductById(elementId.innerText);
        saveOnLocalStorage(itemObj);
        sumPrices(itemObj.salePrice);
      });
    }); removeLoad();
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function emptyCart() {
  const btn = document.querySelector('.empty-cart');
  btn.addEventListener('click', () => {
    const list = document.querySelectorAll('.cart__item');
    if (list !== undefined) {
      list.forEach((item) => {
        item.remove('li');
      });
    }
    localStorage.clear();
    sumPrices();
  });
}
emptyCart();

function showListOnLoad() {
  // 1° selecionar o local onde está a lista de itens (carrinho);
  const cart = document.querySelector('.cart__items');
  // 2° acessar o local storage e converter a informação salva;
  const list = JSON.parse(localStorage.getItem('List'));
  // 3° verificar se o local storage está vazio;
  if (list !== null) {
    // 4° se não estiver vazio trazer as informações para o html;
    list.forEach((item) => {
      const element = createCartItemElement(item);
      cart.appendChild(element);
    });
  }
}

window.onload = function onload() {
  fetchProducts();
  showListOnLoad();
};
