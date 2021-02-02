const CalculateTotalPrice = (myCartItems) => {
  let sum = 0;

  myCartItems.forEach((curr) => {
    sum += parseFloat(curr.innerText.split('$')[1]);
  }, 0);

  const roundedSum = (Math.ceil(sum * 100).toFixed(2)) / 100;

  return roundedSum;
};

const sumTotalItensOnCart = () => {
  const myCartItems = document.querySelectorAll('.cart__item');
  const sumOfItemsOnCart = CalculateTotalPrice(myCartItems);
  const myCartTotal = document.querySelector('.total-price');
  myCartTotal.innerText = sumOfItemsOnCart;
};

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

const addItemsToLocalStorage = () => {
  const myCartItems = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('1', myCartItems);
  const myCartTotal = document.querySelector('.total-price').innerHTML;
  localStorage.setItem('2', myCartTotal);
};

function cartItemClickListener(event) {
  event.target.remove();
  localStorage.clear();
  sumTotalItensOnCart();
  addItemsToLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addLoadingText = () => {
  const myCart = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'loading';
  li.innerText = 'loading...';
  myCart.appendChild(li);
};

const fetchAddToCartStorage = async (event) => {
  addLoadingText();
  const myCart = document.querySelector('.cart__items');
  const clickedCard = event.target.parentNode;
  const itemId = getSkuFromProductItem(clickedCard);
  const endpointURL = `https://api.mercadolibre.com/items/${itemId}`;

  try {
    const queryItem = await fetch(endpointURL);
    const itemObject = await queryItem.json();
    const { id: sku, title: name, price: salePrice } = itemObject;
    const cartItem = createCartItemElement({ sku, name, salePrice });

    myCart.appendChild(cartItem);
    sumTotalItensOnCart();
  } catch (error) {
    alert(error);
  }
  addItemsToLocalStorage();
  document.querySelector('.loading').remove();
};

const addListenersToPageItems = () => {
  const pageItems = document.querySelectorAll('.item__add');
  pageItems.forEach(item => item.addEventListener('click', fetchAddToCartStorage));
};

const fetchApiResultsAddToPage = async () => {
  addLoadingText();
  const query = 'computador';
  const endpointURL = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;

  try {
    const queryResult = await fetch(endpointURL);
    const objectResult = await queryResult.json();

    objectResult.results.forEach((element) => {
      const { id: sku, title: name, thumbnail: image } = element;
      const itemsDePesquisa = document.querySelector('.items');
      itemsDePesquisa.appendChild(createProductItemElement({ sku, name, image }));
    });
    addListenersToPageItems();
  } catch (error) {
    alert(error);
  }
  document.querySelector('.loading').remove();
};

const retrieveCartFromLocalStorage = () => {
  const myCart = document.querySelector('.cart__items');
  const myCartTotal = document.querySelector('.total-price');

  myCart.innerHTML = localStorage.getItem('1');
  myCartTotal.innerHTML = parseFloat(localStorage.getItem('2'));

  const myCartItems = document.querySelectorAll('.cart__item');
  myCartItems.forEach(element => element.addEventListener('click', cartItemClickListener));
};

const emptyShoppingCart = () => {
  document.querySelector('.cart__items').innerHTML = '';
  document.querySelector('.total-price').innerHTML = 0;
  localStorage.clear();
};

window.onload = function onload() {
  fetchApiResultsAddToPage();
  retrieveCartFromLocalStorage();

  const emptyCartButton = document.querySelector('.empty-cart');
  emptyCartButton.addEventListener('click', emptyShoppingCart);
};
