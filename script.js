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

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}*/

function cartItemClickListener(event) {
  event.target.parentNode.firstChild.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createElement(term) {
  const param = { headers: { Accept: 'application/json' } };
  const loading = document.querySelector('.loading');
  loading.innerText = 'loading';
  fetch(`https://api.mercadolibre.com/items/${term}`, param)
    .then(response =>
      response.json())
      .then((data) => {
        console.log(data);
        const ol = document.querySelector('.cart__items');
        ol.appendChild(createCartItemElement(data));
      });
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
