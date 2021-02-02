
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

const showTotalPrice = async (value) => {
  const totalDisplayed = await document.querySelector('.total-price');
  try {
    if (totalDisplayed !== null) {
      totalDisplayed.remove();
    }
  } catch (error) {
    console.log(error);
  }

  const myCart = document.querySelector('.cart');
  const totalOfItens = document.createElement('span');
  totalOfItens.classList.toggle('total-price');
  totalOfItens.innerText = value;

  myCart.appendChild(totalOfItens);
};

const totalPriceOfItems = (myCartItems) => {
  let sum = 0;

  myCartItems.forEach((curr) => {
    sum += parseFloat(curr.innerText.split('$')[1]);
  }, 0);

  const roundedSum = (Math.ceil(sum * 100).toFixed(2)) / 100;

  return roundedSum;
};

const sumTotalItensOnCart = async () => {
  const myCartItems = document.querySelectorAll('.cart__item');
  const sumOfItemsOnCart = await totalPriceOfItems(myCartItems);

  return showTotalPrice(sumOfItemsOnCart);
};

const addItemsToLocalStorage = () => {
  const myCart = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('1', myCart);
};

function cartItemClickListener(event) {
  try {
    document.querySelector('.total-price').remove();
  } catch (error) {
    console.log(error);
  }

  event.target.remove();

  localStorage.clear();

  addItemsToLocalStorage();

  sumTotalItensOnCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchAddToCartStorage = async (event) => {
  const clickedCard = event.target.parentNode;
  const itemId = getSkuFromProductItem(clickedCard);
  const endpointURL = `https://api.mercadolibre.com/items/${itemId}`;

  try {
    const queryItem = await fetch(endpointURL);
    const itemObject = await queryItem.json();
    const { id: sku, title: name, price: salePrice } = itemObject;
    const cartItem = createCartItemElement({ sku, name, salePrice });
    const myCart = document.querySelector('.cart__items');
    myCart.appendChild(cartItem);

    sumTotalItensOnCart();
  } catch (error) {
    alert(error);
  }
  addItemsToLocalStorage();
};

const addListenersToPageItems = () => {
  const pageItems = document.querySelectorAll('.item__add');
  pageItems.forEach(item => item.addEventListener('click', fetchAddToCartStorage));
};

const fetchApiResultsAddToPage = async () => {
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
};

const retrieveCartFromLocalStorage = () => {
  const myCart = document.querySelector('.cart__items');

  myCart.innerHTML = localStorage.getItem('1');
  myCart.addEventListener('click', cartItemClickListener);

  sumTotalItensOnCart();
};

const emptyShoppingCart = () => {
  document.querySelector('.cart__items').innerHTML = '';
  localStorage.clear();

  sumTotalItensOnCart();
};

window.onload = function onload() {
  fetchApiResultsAddToPage();
  retrieveCartFromLocalStorage();

  const emptyCartButton = document.querySelector('.empty-cart');
  emptyCartButton.addEventListener('click', emptyShoppingCart);
};
