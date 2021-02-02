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

function startLoading() {
  const loading = document.querySelector('.loading');
  loading.innerText = 'loading...';
}

function stopLoading() {
  const loading = document.querySelector('.loading');
  loading.innerText = '';
}

function sumItems() {
  return new Promise((resolve, reject) => {
    const myCart = document.querySelectorAll('.cart__item');
    let price = '';
    let sum = 0;
    myCart.forEach((value) => {
      const position = value.innerText.indexOf('$');
      for (let index = position + 1; index < value.innerText.length; index += 1) {
        price += value.innerText[index];
      }
      sum += Number(price);
      price = '';
    });
    if (sum >= 0) {
      resolve(sum);
    } else {
      reject('Erro! Soma inválida');
    }
  });
}

async function putPrice() {
  let price;
  try {
    price = await sumItems();
    const elementPrice = document.querySelector('.total-price');
    if (price === 0) elementPrice.innerText = '';
    else elementPrice.innerText = `${price}`;

  } catch (error) {
    window.alert(error);
  }
}

function saveMyCart() {
  const listItems = document.querySelector('.cart__items');
  localStorage.setItem('myCart', listItems.innerHTML);
}

function cartItemClickListener(event) {
  const list = document.querySelector('.cart__items');
  list.removeChild(event.target);
  putPrice();
  saveMyCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function emptyCart() {
  const list = document.querySelector('.cart__items');
  list.innerHTML = '';
  putPrice();
  saveMyCart();
}

function restoreMyCart() {
  const listItems = document.querySelector('.cart__items');
  listItems.innerHTML = localStorage.getItem('myCart');
  const items = document.querySelectorAll('.cart__item');
  if (items !== null) {
    items.forEach(value => value.addEventListener('click', cartItemClickListener));
  }
  putPrice();
}

async function addEventItemInMyCart(element, id) {
  element.lastChild.addEventListener('click', () => {
    fetch(`https://api.mercadolibre.com/items/${id}`)
      .then(resp => resp.json()
      .then((item) => {
        const obj = { sku: item.id, name: item.title, salePrice: item.price };
        const li = createCartItemElement(obj);
        const listItems = document.querySelector('.cart__items');
        listItems.appendChild(li);
        putPrice();
        saveMyCart();
      }));
  });
}

async function loadingItems() {
  startLoading();
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then((response) => {
      response.json()
        .then(item => item.results.forEach((value) => {
          const obj = { sku: value.id, name: value.title, image: value.thumbnail };
          const section = createProductItemElement(obj);
          addEventItemInMyCart(section, value.id);
          const containerItems = document.querySelector('.items');
          containerItems.appendChild(section);
        }));
      stopLoading();
    });
}

window.onload = function onload() {
  restoreMyCart();
  loadingItems();
  const btnClear = document.querySelector('.empty-cart');
  btnClear.addEventListener('click', emptyCart);
};
