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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function addToList(data, objectComplement, sectionToAdd, callback) {
  const object = { sku: data.id, name: data.title };
  const finalObject = Object.assign(object, objectComplement);
  sectionToAdd.appendChild(callback(finalObject));
}

function cartItemClickListener(event) {
  const parentNode = (event.target.parentNode);
  parentNode.removeChild(event.target);
  let objectId = event.target.innerText.split('').splice(5,13).join('');
  let key = Object.entries(localStorage).find(object => object[1] === objectId);
  localStorage.removeItem(key[0]);
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

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function searchItemById(id) {
  const URL = `https://api.mercadolibre.com/items/${id}`;
  return fetch(URL)
    .then(response => response.json())
    .then((data) => {
      const obj = { salePrice: data.price };
      addToList(data, obj, document.querySelector('.cart__items'), createCartItemElement)
    });
}

function productItemList() {
  const URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(URL)
    .then(response => response.json())
    .then((data) => {
      data.results.map((item) => {
        const obj = { image: item.thumbnail };
        addToList(item, obj, document.querySelector('.items'), createProductItemElement);
      });
    });
}

function itemListListener() {
  setTimeout(() => {
    const buttonAddToList = document.querySelectorAll('.item__add');
    buttonAddToList.forEach((button) => {
      button.addEventListener('click', function (event) {
        const itemID = getSkuFromProductItem(button.parentNode);
        searchItemById(itemID);
        objectId = Math.random(itemID)
        localStorage.setItem(objectId, itemID);
      });
    });
  }, 500);
}

async function loadCartItems() {
  //await Object.entries(localStorage).map(async obj => {
  for (let index = 0; index < localStorage.length; index += 1) {
    const obj = Object.entries(localStorage);
    try {
      await searchItemById(obj[index][1]);
    } catch (error) {
      alert(error);
    }
  }
}

window.onload = () => {
  productItemList();
  itemListListener();
  loadCartItems()
};
