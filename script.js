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
  // coloque seu código aquii
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchProductToCart = async (id) => {
  const endPoint = `https://api.mercadolibre.com/items/${id}`;

  try {
    const cartOl = document.querySelector('.cart__items');
    const selectedItem = await fetch(endPoint);
    const object = await selectedItem.json();
    const sku = object.id;
    const name = object.title;
    const salePrice = object.price;
    cartOl.appendChild(createCartItemElement({ sku, name, salePrice }));
  } catch (error) {
    window.alert(error);
  }
};

const addProductToCart = () => {
  const addProductButton = document.querySelectorAll('.item__add');
  addProductButton.forEach((button) => {
    button.addEventListener('click', (event) => {
      fetchProductToCart(event.target.parentNode.children[0].innerText);
    });
  });
};


const fetchMLB = async (ProductType) => {
  const endPoint = `https://api.mercadolibre.com/sites/MLB/search?q=${ProductType}`;
  try {
    const response = await fetch(endPoint);
    const object = await response.json();
    object.results.forEach((element) => {
      const sectionElement = document.querySelector('.items');
      const sku = element.id;
      const name = element.title;
      const image = element.thumbnail;
      sectionElement.appendChild(createProductItemElement({ sku, name, image }));
    });
  } catch (error) {
    window.alert(error);
  }
  addProductToCart();
};

window.onload = function onload() {
  fetchMLB('computador');
};
