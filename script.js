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

function cartItemClickListener(event) {
  event.target.remove();
  localStorage.removeItem(event.target.item);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  // const valores = [];
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function storeInfo() {
  const a = document.querySelector('.cart__item').innerText;
  console.log(a);
  // for (i = 0; i < a.length; i += 1) {
  //  const b = event.target.innerText
    // console.log(a[i])
  localStorage.setItem('item', a);
    // const returnInfo = localStorage.getItem('item');
  // console.log(returnInfo);
  // }
}

function emptyAllCart() {
  const emptyComplete = document.querySelectorAll('.cart__item');
  for (i = 0; i < emptyComplete.length; i += 1) {
    emptyComplete[i].remove();
    localStorage.clear();
  }
}

function deleteCart() {
  const emptyAll = document.querySelector('.empty-cart');
  emptyAll.addEventListener('click', emptyAllCart);
}
/*
function sumAll() {
  const soma = document.querySelectorAll('.cart__items li')
  console.log(soma);
  const valores = [];
  const {price} = data
  valores.push(price);
  console.log(valores);
  const total = valores.reduce((result, number) => result + number,0);
  console.log(total);
}
sumAll();
*/
async function createElement(term) {
  await fetch(`https://api.mercadolibre.com/items/${term}`)
    .then(response =>
      response.json())
      .then((data) => {
        // console.log(data);
        const ol = document.querySelector('.cart__items');
        ol.appendChild(createCartItemElement(data));
      });
  deleteCart();
  storeInfo();
}

function chosen(event) {
  buttonText = event.target.parentNode.firstChild.innerText;
  createElement(buttonText);
}

function select() {
  const buttonAdd = document.querySelectorAll('.item__add');
  for (let i = 0; i < buttonAdd.length; i += 1) {
    // console.log([i]);
    buttonAdd[i].addEventListener('click', chosen);
  }
}

function loading() {
  const container = document.querySelector('.container');
  const paragraph = document.createElement('p');
  paragraph.innerText = 'loading...';
  paragraph.className = 'loading';
  container.appendChild(paragraph);
}

function loadEnd() {
  const container = document.querySelector('.container p');
  container.innerText = '';
}

retrieveMercadoLivre = (term) => {
  loading();
  // const param = { headers: { Accept: 'application/json' } };
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${term}`)
  .then(response => response.json())
    .then((data) => {
      const itensMercado = document.querySelector('.items');
      loadEnd();
      // console.log(data);
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
};
