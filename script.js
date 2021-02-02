// window.onload = function onload() { };

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

// Remove o Loading...

const removeLoading = () => {
  const getLoading = document.querySelector('.loading');
  getLoading.remove();
}

// Crie um botão para limpar carrinho de compras

const clearShoppingCart = () => {
  const getShoppingCart = document.querySelector('.cart__items');
  const getTotalPrice = document.querySelector('.total-price');
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', () => {
    getShoppingCart.innerHTML = '';
    localStorage.clear();
    getTotalPrice.innerText = '0';
  });
};

// subtrai os precos dos itens removidos
const priceOfItemRemoved = (event) => {
  const string = event.target.innerText;
  const search = string.indexOf('$');
  const sliceString = string.slice(search + 1);
  const price = parseFloat(sliceString);
  return price;
};

const removePrice = (event) => {
  const getPrice = document.querySelector('.total-price').innerText;
  const priceToDecrease = priceOfItemRemoved(event);
  const convertToNumber = parseFloat(getPrice);
  const decreasedTotal = Math.round((convertToNumber - priceToDecrease) * 100) / 100;
  document.querySelector('.total-price').innerText = decreasedTotal;
};

function cartItemClickListener(event) {
  // const priceToDecrease = priceOfItemRemoved(event);
  // totalPrice -= priceToDecrease;
  removePrice(event);
  event.target.remove();
  const cartList = document.querySelector('.cart__items');
  localStorage.clear();
  localStorage.setItem('shopping-cart', cartList.innerHTML);
}

// Some o valor total dos itens do carrinho de compras de forma assíncrona

const sumPrices = async (price) => {
  const getPrice = document.querySelector('.total-price').innerText;
  const convertedPrice = parseFloat(getPrice);
  const totalPrice = await Math.round((convertedPrice + price) * 100) / 100;
  document.querySelector('.total-price').innerText = totalPrice;
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  sumPrices(salePrice);
  return li;
}

// Carregue o carrinho de compras atraves do LocalStorage ao iniciar a pagina

const getLocalStorage = () => {
  const listCart = document.querySelector('.cart__items');
  listCart.innerHTML = localStorage.getItem('shopping-cart');
};

// Adicione o produto ao carrinho de compras

const fetchProduct = (sku) => {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(response => response.json())
    .then((data) => {
      const itemCart = {
        sku,
        name: data.title,
        salePrice: data.price,
      };
      const cartList = document.querySelector('.cart__items');
      cartList.appendChild(createCartItemElement(itemCart));
      localStorage.clear();
      localStorage.setItem('shopping-cart', cartList.innerHTML);
    });
};

const getSkuFromProduct = () => {
  const getSectionItem = document.querySelector('.items');
  getSectionItem.addEventListener('click', (event) => {
    const item = event.target.parentNode;
    const sku = item.querySelector('span.item__sku').innerText;
    fetchProduct(sku);
  });
};

// fazer a requisicao e implementacao dos produtos
// as variáveis sku, se referem aos campos id retornados pela API.

const implementResults = (data) => {
  const getSectionItem = document.querySelector('.items');
  const object = {};
  data.forEach((item) => {
    object.sku = item.id;
    object.name = item.title;
    object.image = item.thumbnail;
    getSectionItem.appendChild(createProductItemElement(object));
  });
};

const fetchMLB = () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const promise = fetch(endpoint)
    .then(response => response.json());
  removeLoading();
  promise.then(data => implementResults(data.results));
};

window.onload = () => {
  fetchMLB();
  getSkuFromProduct();
  getLocalStorage();
  clearShoppingCart();
};
