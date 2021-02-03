function saveListOnStorage() {
  const list = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', list);
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

async function retunPriceToDOM(itemPrice) {
  const totalPriceDOM = document.querySelector('.total-price');
  let totalPriceValue = parseFloat(totalPriceDOM.innerText);
  totalPriceValue += itemPrice;
  totalPriceDOM.innerText = totalPriceValue;
}

const getItemPrice = async (itemId) => {
  try {
    const productDetails = `https://api.mercadolibre.com/items/${itemId}`;
    await fetch(productDetails)
      .then(response => response.json())
      .then((object) => {
        const itemPrice = object.price;
        retunPriceToDOM(itemPrice);
      });
  } catch (error) {
    console.log(`Ocorreu um erro: ${error}`);
  }
};

async function refreshTotalPrice() {
  document.querySelector('.total-price').innerText = 0;
  const listItems = document.querySelectorAll('.cart__item');
  let totalPrice = 0;
  document.querySelector('.total-price').innerText = totalPrice;
  listItems.forEach((item) => {
    totalPrice += getItemPrice(item.id);
  });
}

function emptyCart() {
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    saveListOnStorage();
    refreshTotalPrice();
  });
}

function removeItem() {
  this.parentNode.removeChild(this);
  saveListOnStorage();
  refreshTotalPrice();
}

function restoreCart() {
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('cart');
  const list = document.querySelectorAll('.cart__item');
  [...list].forEach((item) => {
    item.addEventListener('click', removeItem);
  });
  refreshTotalPrice();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.setAttribute('id', sku);
  li.addEventListener('click', removeItem);
  return li;
}

const cartItemClickListener = async (itemID) => {
  try {
    const productDetails = `https://api.mercadolibre.com/items/${itemID}`;
    await fetch(productDetails)
      .then(response => response.json())
      .then((object) => {
        const newProduct = createCartItemElement(object);
        document.querySelector('.cart__items').appendChild(newProduct);
        refreshTotalPrice();
        saveListOnStorage();
      });
  } catch (error) {
    console.log(`Ocorreu um erro: ${error}`);
  }
};

function createCustomElement(element, className, innerText, sku) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button' && className === 'item__add') {
    e.id = sku;
    e.addEventListener('click', () => {
      cartItemClickListener(e.id);
    });
  }
  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', sku));
  return section;
}

const fetchItems = async (product) => {
  try {
    const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
    await fetch(endpoint)
      .then(response => response.json())
      .then(object => object.results.forEach((productItem) => {
        const itemElement = createProductItemElement(productItem);
        document.querySelector('.items').appendChild(itemElement);
      }));
  } catch (error) {
    console.log(`Houve um erro: ${error}`);
  }
  const loading = document.querySelector('.loading');
  loading.remove();
};

const setupEvents = () => {
  fetchItems('computador');
};

window.onload = function onload() {
  setupEvents();
  refreshTotalPrice();
  restoreCart();
  emptyCart();
};
