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

const appendChildElement = (father, elementChild) => {
  const elementFather = document.querySelector(`${father}`);
  elementFather.appendChild(elementChild);
};

const updateLocalStorage = () => {
  const list = document.querySelector('.cart__items');
  localStorage.setItem('products', list.innerHTML);
};

const totalPrice = async () => {
  const products = document.querySelector('.cart__items').childNodes;
  let sumTotal = 0;
  await products.forEach((product) => {
    positionPrice = product.textContent.indexOf('$') + 1;
    sumTotal = sumTotal +
      (Number(product.textContent.slice(positionPrice, product.textContent.length)));
  });
  appendChildElement('.cart', createCustomElement('section', 'total-price', ''));
  const priceElement = document.querySelector('.total-price');
  priceElement.innerText = `R$ ${(sumTotal).toFixed(2)}`;
};

const cartItemClickListener = (event) => {
  event.target.remove();
  updateLocalStorage();
  totalPrice();
};

const getLocalStorage = () => {
  const list = document.querySelector('.cart__items');
  const storage = localStorage.getItem('products');
  if (!storage) {
    localStorage.setItem('products', '');
  } else {
    list.innerHTML = localStorage.getItem('products');
    list.childNodes.forEach((product => product.addEventListener('click', cartItemClickListener)));
  }
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getProductFromAPIIds = (event) => {
  const idProduct = event.path[1].firstChild.innerText;
  return fetch(`https://api.mercadolibre.com/items/${idProduct}`)
    .then(response => response.json())
    .then((object) => {
      const { id: sku, title: name, price: salePrice } = object;
      appendChildElement('.cart__items', createCartItemElement({ sku, name, salePrice }));
      updateLocalStorage();
      totalPrice();
    })
    .catch(error => window.alert(error));
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const buttonAdd = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  buttonAdd.addEventListener('click', getProductFromAPIIds);
  section.appendChild(buttonAdd);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const getProductsFromAPI = () =>
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then((object) => {
      object.results.forEach((product) => {
        const { id: sku, title: name, thumbnail: image } = product;
        appendChildElement('.items', createProductItemElement({ sku, name, image }));
      });
    })
    .catch(error => window.alert(error));

const emptyCart = () => {
  const list = document.querySelector('.cart__items');
  list.innerHTML = '';
  updateLocalStorage();
  totalPrice();
};

window.onload = function onload() {
  getProductsFromAPI();
  getLocalStorage();
  const buttonEmptyCart = document.querySelector('.empty-cart');
  buttonEmptyCart.addEventListener('click', emptyCart);
  totalPrice();
};
