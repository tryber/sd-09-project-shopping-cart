
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
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addItemOnCart = async (param) => {
  try {
    const endPointId = await fetch(`https://api.mercadolibre.com/items/${param}`);
    const jsonEndPoint = await endPointId.json();
    const ol = document.querySelector('.cart__items');
    const { id: sku, title: name, price: salePrice } = jsonEndPoint;
    ol.appendChild(createCartItemElement({ sku, name, salePrice }));
  } catch (error) {
    console.log(error);
  }
};

const addToShoppingCart = async (event) => {
  const btnItems = document.querySelectorAll('.item__add');
  btnItems.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      const itemId = (getSkuFromProductItem(event.target.parentNode));
      addItemOnCart(itemId);
    });
  });
};

const itemsList = async (search) => {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${search}`;
  try {
    const fetchResponse = await fetch(endpoint);
    const jsonResponse = await fetchResponse.json();
    const sectionItem = document.querySelector('.items');
    jsonResponse.results.forEach((element) => {
      const { id: sku, title: name, thumbnail: image } = element;
      sectionItem.appendChild(createProductItemElement({ sku, name, image }));
    });
    addToShoppingCart();
  } catch (error) {
    console.log(error);
  }
};

window.onload = function onload() {
  itemsList('computador');
};
