window.onload = function onload() {

  fetchAPI();


};

const fetchAPI = async () => {
  const endpoint = "https://api.mercadolibre.com/sites/MLB/search?q=$computador"

  try {
    const response = await fetch(endpoint);
    const object = await response.json();
    createListOfItems(object);
  } catch {
    window.alert("Error");
  }
}

function createListOfItems(object) {
  object.results.forEach((item) => {
    const itemsContainer = document.querySelector(".items");
    const newItem = {};
    newItem['sku'] = item.id;
    newItem['name'] = item.title;
    newItem['image'] = item.thumbnail;
    const newItemElement = createProductItemElement(newItem);
    itemsContainer.appendChild(newItemElement);
  });
}

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

function createProductItemElement({
  sku,
  name,
  image
}) {
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
  console.log(event.target);
  // const cartItems = document.querySelector('cart__items');
  // const endpoint = `https://api.mercadolibre.com/items/$${event.target.}`
}

function createCartItemElement({
  sku,
  name,
  salePrice
}) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
