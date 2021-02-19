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

function cartItemClickListener(event) {
}
*/

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  const local = {
    SKU: sku,
    NAME: name,
    PRICE: salePrice,
  };
  localStorage.setItem('item', JSON.stringify(local));
  const returnInfo = JSON.parse(localStorage.getItem('item'));
  console.log(returnInfo);
  return li;
}

function emptyAllCart() {
  const emptyComplete = document.querySelectorAll('.cart__item');
  for (i = 0; i < emptyComplete.length; i += 1) {
    emptyComplete[i].remove();
  }
}

function deleteCart() {
  const emptyAll = document.querySelector('.empty-cart');
  emptyAll.addEventListener('click', emptyAllCart);
}


function createElement(term) {
  const loading = document.querySelector('.loading');
  loading.innerText = 'loading';
  const param = { headers: { Accept: 'application/json' } };
  fetch(`https://api.mercadolibre.com/items/${term}`, param)
    .then(response =>
      response.json())
      .then((data) => {
        console.log(data);
        const ol = document.querySelector('.cart__items');
        ol.appendChild(createCartItemElement(data));
      });
  loading.innerText = '';
  deleteCart();
}

function chosen(event) {
  buttonText = event.target.parentNode.firstChild.innerText;
  createElement(buttonText);
}

function select() {
  const buttonAdd = document.querySelectorAll('.item__add');
  for (let i = 0; i < buttonAdd.length; i += 1) {
    console.log([i]);
    buttonAdd[i].addEventListener('click', chosen);
  }
}

retrieveMercadoLivre = (term) => {
  const param = { headers: { Accept: 'application/json' } };
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${term}`, param)
  .then(response => response.json())
    .then((data) => {
      const itensMercado = document.querySelector('.items');
      console.log(data);
      data.results.forEach((result) => {
        const { id: sku, title: name, thumbnail: image } = result;
        const element = createProductItemElement({ sku, name, image });
        console.log(sku, name, image);
        itensMercado.appendChild(element);
      });
      select();
    });
};

window.onload = function onload() {
  retrieveMercadoLivre('computador');
};
