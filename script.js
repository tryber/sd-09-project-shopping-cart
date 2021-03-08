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
/*
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
*/

function totalValue() {
  const valueTotal = [];
  const resultado = document.querySelector('.total-price');
  const items = document.querySelectorAll('.cart__item');
  if (items.length === 0) {
    resultado.innerText = 'R$ 0';
  }
  items.forEach((product) => {
    valueTotal.push(product.innerText.split('$')[1]);
  });
  const valorTotal = valueTotal.reduce((acc, item) => parseFloat(acc) + parseFloat(item), 0);
  resultado.innerText = `R$ ${valorTotal}`;
}

function cartItemClickListener(event) {
  localStorage.removeItem(event.target);
  event.target.remove();
  totalValue();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function storeInfo() {
  const items = document.querySelector('.cart__items').innerText;
  localStorage.setItem('item', items);
}

function emptyAllCart() {
  const emptyComplete = document.querySelectorAll('.cart__item');
  for (i = 0; i < emptyComplete.length; i += 1) {
    emptyComplete[i].remove();
    localStorage.clear();
    totalValue();
  }
}

function deleteCart() {
  const emptyAll = document.querySelector('.empty-cart');
  emptyAll.addEventListener('click', emptyAllCart);
  totalValue();
}

function loading() {
  const container = document.querySelector('.container');
  const paragraph = document.createElement('p');
  paragraph.innerText = 'loading...';
  paragraph.className = 'loading';
  container.appendChild(paragraph);
}

function loadEnd() {
  const container = document.querySelector('.loading');
  container.remove();
}
async function createElement(term) {
  await fetch(`https://api.mercadolibre.com/items/${term}`)
    .then(response =>
      response.json())
      .then((data) => {
        const ol = document.querySelector('.cart__items');
        ol.appendChild(createCartItemElement(data));
        totalValue();
      });
  storeInfo();
  deleteCart();
}

function chosen(event) {
  buttonText = event.target.parentNode.firstChild.innerText;
  createElement(buttonText);
}

function select() {
  const buttonAdd = document.querySelectorAll('.item__add');
  for (let i = 0; i < buttonAdd.length; i += 1) {
    buttonAdd[i].addEventListener('click', chosen);
  }
}

function retrieveLocalStorage() {
  const cartItems = localStorage.getItem('item');
  if (!cartItems) {
    return;
  }
  const frases = cartItems.split('\n');
  for (let i = 0; i < frases.length; i += 1) {
    console.log(frases[i]);
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = frases[i];
    li.addEventListener('click', cartItemClickListener);
    const ol = document.querySelector('.cart__items');
    ol.appendChild(li);
    deleteCart();
  }
}

retrieveMercadoLivre = (term) => {
  loading();
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${term}`)
  .then(response => response.json())
    .then((data) => {
      const itensMercado = document.querySelector('.items');
      loadEnd();
      data.results.forEach((result) => {
        const { id: sku, title: name, thumbnail: image } = result;
        const element = createProductItemElement({ sku, name, image });
        itensMercado.appendChild(element);
      });
      select();
    });
};

window.onload = function onload() {
  retrieveMercadoLivre('computador');
  retrieveLocalStorage();
  totalValue();
};
