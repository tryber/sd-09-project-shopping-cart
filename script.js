function saveStorage() {
  const list = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', list);
  const price = document.querySelector('#value').innerText;
  localStorage.setItem('price', price);
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
  let value = +(document.querySelector('#value').innerText);
  const price = +(event.target.innerText.split('$')[1]);
  console.log(price);
  value -= price;
  value = value.toFixed(2);
  document.querySelector('#value').innerText = value;
  saveStorage();
}

function recoveryCart() {
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('cart');
  const list = document.querySelectorAll('.cart__item');
  [...list].forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
  document.querySelector('#value').innerText = localStorage.getItem('price');
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function cleanCart() {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    document.querySelector('#value').innerText = '';
    saveStorage();
  });
}

async function sumProducts(price) {
  let value = +(document.querySelector('#value').innerText);
  value += price
  value = value.toFixed(2);
  document.querySelector('#value').innerText = value
}

const setCartItems = async (event) => {
  const id = getSkuFromProductItem(event.target.parentNode);
  try {
    await fetch(`https://api.mercadolibre.com/items/${id}`)
    .then(res => res.json())
    .then((result) => {
      const element = createCartItemElement(result);
      document.querySelector('.cart__items').appendChild(element);
      sumProducts(result.price);
      saveStorage();
    });
  } catch (error) {
    alert('Não foi possível adicionar o item ao seu carrinho. Por favor tente novamente ou verifique a sua conexão com a internet');
  }
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') e.addEventListener('click', setCartItems);
  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const getProducts = async () => {
  try {
    await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(res => res.json())
    .then(result => result.results.forEach((item) => {
      const element = createProductItemElement(item);
      document.querySelector('.items').appendChild(element);
    }));
    document.querySelector('#loading').remove();
  } catch (error) {
    alert('Error: Não foi possível manter contato com o banco de dados');
  }
};

window.onload = function onload() {
  getProducts();
  recoveryCart();
  cleanCart();
};
