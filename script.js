// Primeiro commit
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
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

function addingHtml(htmlElement, addingClass) {
  const parentElement = document.querySelector(addingClass);
  parentElement.appendChild(htmlElement);
}

// function addingListItems(li) {
//   const cartItems = document.querySelector('.cart__items');
//   cartItems.appendChild(li);
// }

function savingList() {
  const savedList = document.querySelector('.cart__items');
  localStorage.setItem('shoppingCart', savedList.innerHTML);
}

function addingPrices() {
  const selectedPrices = document.querySelectorAll('li');
  let sum = 0;
  selectedPrices.forEach((element) => {
    sum += Number(element.innerText.split('$')[1]);
  });
  return Math.round(sum * 100) / 100;
}

function updatingFooter(parentElement) {
  const updatesFooter = document.querySelector('footer');
  if (updatesFooter) {
    parentElement.removeChild(updatesFooter);
  }
}

const executeAddingPrices = async () => {
  const sumOfPrices = await addingPrices();
  const parentElement = document.querySelector('.cart');
  updatingFooter(parentElement);
  const footer = document.createElement('footer');
  footer.className = 'total-price';
  footer.innerText = sumOfPrices;
  parentElement.appendChild(footer);
};

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
  savingList();
  executeAddingPrices();
}

function retrievingList() {
  const savedList = document.querySelector('.cart__items');
  savedList.innerHTML = localStorage.getItem('shoppingCart');
  savedList.childNodes.forEach((element) => {
    element.addEventListener('click', cartItemClickListener);
  });
  // const li = document.createElement('li');
  // li.className = 'cart__item';
  // li = localStorage.getItem('shoppingCart');
  // li.addEventListener('click', cartItemClickListener);
  // addingHtml(li, 'cart__item');
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function newRequest(itemSku) {
  fetch(`https://api.mercadolibre.com/items/${itemSku}`)
    .then((response) => {
      response.json()
        .then((data) => {
          // const { id: sku, title: name, price: salePrice } = data;
          addingHtml(createCartItemElement({ sku: data.id, name: data.title, salePrice: data.price }), '.cart__items');
          savingList();
          executeAddingPrices();
        });
    });
}

function productsRequisition() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => {
    response.json()
    .then((data) => {
      const products = data.results;
      products.forEach((product) => {
        const { id: sku, title: name, thumbnail: image } = product;
        addingHtml(createProductItemElement({ sku, name, image }), '.items');
      });
      const retrievingClassItemAdd = document.querySelectorAll('.item__add');
      retrievingClassItemAdd.forEach((element) => {
        const sku = element.parentNode.firstChild.innerText;
        element.addEventListener('click', () => newRequest(sku));
      });
    });
  });
}

function emptyingCart() {
  const cartItems = document.querySelectorAll('.cart__item');
  cartItems.forEach(element => element.remove());
  executeAddingPrices();
}

window.onload = function onload() {
  productsRequisition();
  retrievingList();
  executeAddingPrices();

  const emptyCartButton = document.querySelector('.empty-cart');
  emptyCartButton.addEventListener('click', emptyingCart)
};

// *******************************************************************************************
// *******************************************************************************************
// *******************************************************************************************

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
