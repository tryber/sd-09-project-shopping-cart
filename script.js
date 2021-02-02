const itensInMemory = [];

function cartItemClickListener(event) {
  const ol = document.querySelector('.cart__items');
  ol.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addItemInCart = async (event) => {
  const endPoint = `https://api.mercadolibre.com/items/${event.target.value}`;
  const result = fetch(endPoint);
  await result.then(resp => resp.json().then((res) => {
    const { id: sku, title: name, price: salePrice } = res;
    const li = createCartItemElement({ sku, name, salePrice });
    const ol = document.querySelector('.cart__items');
    ol.appendChild(li);
    itensInMemory.push(res);
  }));
};

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

const queryItensInBd = async (params) => {
  const endPoint = `https://api.mercadolibre.com/sites/MLB/search?q=${params}`;
  const result = fetch(endPoint);
  await result.then(resp => resp.json().then((res) => {
    res.results.map((item, index) => {
      const { id: sku, title: name, thumbnail: image } = item;
      const section = createProductItemElement({ sku, name, image });
      const fatherSection = document.querySelector('.items');
      fatherSection.appendChild(section);
      const buttonAdd = document.querySelectorAll('.item__add')[index];
      buttonAdd.addEventListener('click', addItemInCart);
      buttonAdd.value = item.id;
      return undefined;
    });
  }));
};

window.onload = function onload() {
  queryItensInBd('computador');
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
