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

const fetchElement = (item = 'computador') => {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${item}`;
  const promise = fetch(endpoint)
  .then(response => response.json())
  .then(object => object);
  return promise;
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

function cartItemClickListener(event) {
  const target = event.target;
  console.log(target.id);
  localStorage.removeItem(target.id);
  target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
const addToCart = async (event) => {
  const ol = document.querySelector('.cart__items');
  const targetId = event.target.parentElement.children[0].textContent;
  const endpoint = `https://api.mercadolibre.com/items/${targetId}`;
  const elementTarget = await fetch(endpoint)
  .then(response => response.json())
  .then(obj => obj);
  const { id: sku, title: name, price: salePrice } = elementTarget;
  const element = createCartItemElement({ sku, name, salePrice });
  localStorage.setItem(sku, name);
  element.id = sku;
  ol.appendChild(element);
  console.log(document.querySelectorAll('.cart__item').length);
};

const putLoading = () => {
  const itens = document.getElementsByClassName('items');
  const element = document.createElement('section');
  console.log(itens);
  console.log(element);
  element.classList.add('loading');
  element.innerText = 'loading';
  itens[0].appendChild(element);
};

const putElementsOnScreen = () => {
  putLoading();
  const responsePromise = fetchElement();
  responsePromise
  .then((response) => {
    const elementsArray = response.results;
    const sectionItems = document.querySelector('.items');
    elementsArray.forEach((element) => {
      const { id: sku, title: name, thumbnail: image } = element;
      const itemHtml = createProductItemElement({ sku, name, image });
      itemHtml.lastChild.addEventListener('click', addToCart);
      sectionItems.appendChild(itemHtml);
    });
    document.querySelector('.loading').remove();
  });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const clearCart = () => {
  const bntClearCart = document.querySelector('.empty-cart');
  bntClearCart.addEventListener('click', () => {
    const elementsToDelete = document.querySelectorAll('.cart__item');
    if (elementsToDelete.length > 0) {
      elementsToDelete.forEach((element) => {
        localStorage.clear();
        element.remove();
      });
    }
  });
  return 'Tudo Deletado';
};

const getPromise = (position) => {
  const ol = document.querySelector('.cart__items');
  const endpoint = `https://api.mercadolibre.com/items/${position}`;
  const elementTarget = fetch(endpoint)
    .then(response => response.json())
    .then(obj => Promise.resolve(obj));
  elementTarget.then((response) => {
    const { id: sku, title: name, price: salePrice } = response;
    const element = createCartItemElement({ sku, name, salePrice });
    element.id = sku;
    ol.appendChild(element);
  });
  return ol;
};

const loadingLocalStorage = () => {
  const entries = Object.entries(localStorage);
  for (let index = 0; index < entries.length; index += 1) {
    const position = entries[index][0];
    getPromise(position);
  }
  return 'Passed';
};

window.onload = function onload() {
  putElementsOnScreen();
  clearCart();
  loadingLocalStorage();
  const li = document.createElement('li');
  li.addEventListener('click', cartItemClickListener);
};
