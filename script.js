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
  event.target.remove();
  localStorage.removeItem(localStorage.key(event));
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const populateStorage = (name, value) => {
  localStorage[name] = value;
};

const addToCart = async (event) => {
  const itemId = event.target.parentNode.firstChild.innerHTML;
  const endpoint = `https://api.mercadolibre.com/items/${itemId}`;
  try {
    const response = await fetch(endpoint);
    const item = await response.json();
    const { id: sku, title: name, price: salePrice } = item;
    const cartItem = createCartItemElement({ sku, name, salePrice });
    document.querySelector('.cart__items').appendChild(cartItem);

    const cartItemText = cartItem.innerHTML;
    populateStorage(itemId, cartItemText);
  } catch (error) {
    console.log(error);
  }
};

const fetchProducts = async (query) => {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
  try {
    const response = await fetch(endpoint);
    const object = await response.json();
    object.results.forEach((item) => {
      const { id: sku, title: name, thumbnail: image } = item;
      const eachResult = createProductItemElement({ sku, name, image });
      document.querySelector('.items').appendChild(eachResult);
    });

    document.querySelectorAll('.item__add')
      .forEach(element => element.addEventListener('click', addToCart));
  } catch (error) {
    console.log(error);
  }
};

const loadCartItemsFromStorage = () => {
  const values = Object.values(localStorage);
  return values.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = `${item}`;
    document.querySelector('.cart__items').appendChild(li);
    li.addEventListener('click', cartItemClickListener);
  });
};

window.onload = function () {
  fetchProducts('computador');
  loadCartItemsFromStorage();
};
