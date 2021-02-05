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

const saveLocalStorage = () => {
  const arrayLocal = [];
  const listCart = document.querySelectorAll('.cart__item');
  listCart.forEach((item) => {
    arrayLocal.push(item.innerText);
  });
  localStorage.setItem('cartShopping', JSON.stringify(arrayLocal));
};

const sumPrice = () => {
  let total = 0;
  const totalPrice = document.querySelector('.total-price');
  arrayLocal = JSON.parse(localStorage.getItem('cartShopping'));
  arrayLocal.forEach((item) => {
    (total += Number(item.split('$')[1]));
  });
  totalPrice.innerText = total;
};

const cartItemClickListener = (event) => {
  event.target.remove();
  saveLocalStorage();
  sumPrice();
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const retrieveItems = async (target) => {
  const cartItem = document.querySelector('.cart__items');
  try {
    const promise = await fetch(`https://api.mercadolibre.com/items/${target}`);
    const response = await promise.json();
    const { id: sku, title: name, price: salePrice } = response;
    cartItem.appendChild(createCartItemElement({ sku, name, salePrice }));
    saveLocalStorage();
    sumPrice();
  } catch (error) { window.alert(error); }
};

const captureTargetItem = () => {
  let target = '';

  const itemAdd = document.querySelectorAll('.item__add');
  itemAdd.forEach((element) => {
    element.addEventListener('click', (event) => {
      target = event.target.parentNode.querySelector('.item__sku').innerText;
      retrieveItems(target);
    });
  });
};

const retriveMercadoLivreApi = async () => {
  try {
    const items = document.querySelector('.items');
    const promise = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
    document.querySelector('.loading').remove();
    const response = await promise.json();
    response.results.forEach((result) => {
      const { id: sku, title: name, thumbnail: image } = result;
      items.appendChild(createProductItemElement({ sku, name, image }));
    });
    captureTargetItem();
  } catch (error) { window.alert(error); }
};

const removeItemsFromTheShoppingCart = () => {
  const emptyCart = document.querySelector('.empty-cart');
  emptyCart.addEventListener('click', () => {
    const cartItems = document.querySelector('.cart__items');
    while (cartItems.firstChild) {
      cartItems.removeChild(cartItems.firstChild);
    }
    saveLocalStorage();
    sumPrice();
  });
};

const loadLocalStorage = () => {
  if (localStorage.length > 0) {
    const arrayLocal = JSON.parse(localStorage.getItem('cartShopping'));
    arrayLocal.forEach((item) => {
      const li = document.createElement('li');
      li.innerText = item;
      li.className = 'cart__item';
      document.querySelector('.cart__items').appendChild(li);
    });
    sumPrice();
  }
};

window.onload = function onload() {
  retriveMercadoLivreApi();
  loadLocalStorage();
  removeItemsFromTheShoppingCart();
};
