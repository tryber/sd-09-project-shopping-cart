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
  // coloque seu código aqui
  const list = document.querySelector('.cart__items');
  list.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then(response => response.json()
    .then(item => item.results.forEach((value) => {
      const obj = { sku: value.id, name: value.title, image: value.thumbnail };
      const section = createProductItemElement(obj);
      section.lastChild.addEventListener('click', () => {
        fetch(`https://api.mercadolibre.com/items/${value.id}`)
          .then(resp => resp.json()
          .then((item2) => {
            const obj2 = { sku: item2.id, name: item2.title, salePrice: item2.price };
            const li = createCartItemElement(obj2);
            li.addEventListener('click', cartItemClickListener);
            const listItems = document.querySelector('.cart__items');
            listItems.appendChild(li);
          }));
      });
      const containerItems = document.querySelector('.items');
      containerItems.appendChild(section);
  })));

};
