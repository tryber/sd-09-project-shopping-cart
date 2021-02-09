function totalPrice() {
  let value = 0;
  const ol = document.querySelector('.cart__items').childNodes;
  const regex = /[$]/g;
  ol.forEach((element) => {
    const location = element.innerText.search(regex);
    value += parseFloat(element.innerText.substr(location + 1));
  });
  document.querySelector('.total-price').innerText = value;
}

function cartStorage() {
  const cartValue = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', cartValue);
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener(event) {
  event.target.remove();
  cartStorage();
  totalPrice();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function loadStorage() {
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('cart');
  const arrOl = Object.values(document.querySelector('.cart__items').children);
  arrOl.forEach((element) => {
    element.addEventListener('click', cartItemClickListener);
  });
  totalPrice();
}

async function initialPrice(price) {
  let value = parseFloat(document.querySelector('.total-price').innerText);
  value += price;
  document.querySelector('.total-price').innerText = value;
}

const btnAddItem = async (event) => {
  const product = event.target.parentNode.firstChild.innerText;
  try {
    await fetch(`https://api.mercadolibre.com/items/${product}`)
    .then((response) => {
      response.json()
      .then((object) => {
        const objectLi = createCartItemElement(object);
        document.querySelector('.cart__items').appendChild(objectLi);
        cartStorage();
        initialPrice(object.price);
      });
    });
  } catch (erro) {
    alert('Erro ao iniciar o carrinho. Tente novamente mais tarde');
  }
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') e.addEventListener('click', btnAddItem);
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

function createItems(object) {
  const section = document.querySelector('.items');
  object.results.forEach((element) => {
    const { id: sku, title: name, thumbnail: image } = element;
    section.appendChild(createProductItemElement({ sku, name, image }));
  });
}

function requestMercadoLivre() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
  .then((response) => {
    response.json()
    .then((object) => {
      createItems(object);
    });
  });
}

function emptyCart() {
  const btnEmpty = document.querySelector('.empty-cart');
  btnEmpty.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    cartStorage();
    totalPrice();
  });
}

window.onload = function onload() {
  requestMercadoLivre();
  loadStorage();
  totalPrice();
  emptyCart();
};
