function setShoppingCar() {
  const shoppingCart = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cartSaved', shoppingCart);
}

async function sumPrince() {
  let result = 0;
  const totalPrice = document.querySelector('.total-price');
  const cartItems = document.querySelectorAll('.cart__item');
  cartItems.forEach((element) => {
    result += Number(element.innerText.split('$')[1]);
  });
  totalPrice.innerText = result;
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
  const fatherItem = document.querySelector('.cart__items');
  fatherItem.removeChild(event.target);
  setShoppingCar();
  sumPrince();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function btnShoppingCar() {
  const cartItems = document.querySelector('.cart__items');
  document.querySelectorAll('.item__add')
  .forEach((element) => {
    element.addEventListener('click', (event) => {
      const itemID = event.target.parentNode.firstElementChild.innerText;
      const endpoint = `https://api.mercadolibre.com/items/${itemID}`;
      fetch(endpoint)
      .then((response) => {
        response.json()
        .then((data) => {
          const { id: sku, title: name, price: salePrice } = data;
          const cartItemElement = createCartItemElement({ sku, name, salePrice });
          cartItems.appendChild(cartItemElement);
          setShoppingCar();
          sumPrince();
          // addPrice(salePrice);
        });
      });
    });
  });
}


function fetchMercadoLivre(term) {
  const itemElement = document.querySelector('.items');
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${term}`;
  fetch(endpoint)
  .then((response) => {
    response.json()
    .then((data) => {
      data.results.forEach((element) => {
        const { id: sku, title: name, thumbnail: image } = element;
        itemElement.appendChild(createProductItemElement({ sku, name, image }));
      });
      btnShoppingCar();
    });
  });
}

function getItem() {
  const shoppingCart = document.querySelector('.cart__items');
  shoppingCart.innerHTML = localStorage.getItem('cartSaved');
  const li = document.querySelectorAll('.cart__item');
  li.forEach(element => element.addEventListener('click', cartItemClickListener));
}

function cleanCart() {
  const btnClean = document.querySelector('.empty-cart');
  const ol = document.querySelector('.cart__items');
  btnClean.addEventListener('click', () => {
    ol.innerHTML = '';
    setShoppingCar();
    sumPrince();
  });
}

/* function addPrice(salePrice) {
  console.log(salePrice);
  const itemResult = document.querySelector('.total-price');
  let result = 0;
  result += salePrice;
  itemResult.innerText = `R$: ${result}`
} */


window.onload = function onload() {
  fetchMercadoLivre('computador');
  getItem();
  cleanCart();
  sumPrince();
};
