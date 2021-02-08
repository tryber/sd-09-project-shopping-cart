let cont = 1;
let contRecover = 1;

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

function cartItemClickListener() {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addProductShopping(itemId) {
  const endpoint = `https://api.mercadolibre.com/items/${itemId}`;
  return new Promise((resolve, reject) => {
    const loadingMessage = document.createElement('p');
    const container = document.querySelector('.container');
    loadingMessage.innerText = 'Loading...';
    loadingMessage.className = 'loading';
    container.appendChild(loadingMessage);
    fetch(endpoint)
      .then(response => response.json())
      .then((object) => {
        if (object.error) {
          throw new Error(object.error);
        }
        const { id: sku, title: name, price: salePrice } = object;
        const element = createCartItemElement({ sku, name, salePrice });
        const shoppingBasket = document.querySelector('.cart__items');
        localStorage.setItem(`${cont}`, element.innerHTML);
        cont += 1;
        shoppingBasket.appendChild(element);
        loadingMessage.remove();
        resolve();
        
      })
      .catch((error) => {
        window.alert(error);
        reject();
      });
  });
}

function clearShoppingBasket() {
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', () => {
    const shoppingBasket = document.querySelector('.cart__items');
    shoppingBasket.innerText = ' ';
    localStorage.clear();
    cont = 1;
  });
}

function buildListFetch() {
  const product = 'computador';
  return new Promise((resolve) => {
    const loadingMessage = document.createElement('p');
    const container = document.querySelector('.container');
    loadingMessage.innerText = 'Loading...';
    loadingMessage.className = 'loading';
    container.appendChild(loadingMessage);
    fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`)
    .then(response => response.json())
    .then((object) => {
      if (object.error) {
        throw new Error(object.error);
      }
      object.results.forEach((result) => {
        const { id: sku, title: name, thumbnail: image } = result;
        const element = createProductItemElement({ sku, name, image });
        const button = element.querySelector('.item__add');
        const list = document.querySelector('.items');
        list.appendChild(element);
        button.addEventListener('click', () => addProductShopping(sku));
        resolve();
        loadingMessage.remove();
      });
    });
  });
}

function recoverElementFromLocalStorage() {
  const shoppingBasketRecovered = document.querySelector('.cart__items');
  Object.keys(localStorage).forEach(() => {
    const li = document.createElement('li');
    li.innerText = `${localStorage[contRecover]}`;
    contRecover += 1;
    li.addEventListener('click', cartItemClickListener);
    shoppingBasketRecovered.appendChild(li);
  });
}

window.onload = function onload() {
  buildListFetch();
  clearShoppingBasket();
  recoverElementFromLocalStorage();
};
