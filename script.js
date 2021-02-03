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
    fetch(endpoint)
      .then(response => response.json())
      .then((object) => {
        if (object.error) {
          throw new Error(object.error);
        }
        const { id: sku, title: name, price: salePrice } = object;
        const element = createCartItemElement({ sku, name, salePrice });
        const shoppingBasket = document.querySelector('.cart__items');
        shoppingBasket.addEventListener('click', () => {
          // cartItemClickListener(shoppingBasket)
          // console.log(removeItem);
        });
        shoppingBasket.appendChild(element);
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
  });
}

function buildListFetch() {
  const product = 'computador';
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
  return new Promise((resolve, reject) => {
    fetch(endpoint)
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
      });
    })
    .catch((error) => {
      window.alert(error);
      reject();
    });
  });
}

window.onload = function onload() {
  buildListFetch();
  clearShoppingBasket();
};
