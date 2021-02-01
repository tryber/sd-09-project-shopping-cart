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

function appendChildItemsList(item) {
  const items = document.querySelector('.items');
  items.appendChild(item);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function appendChildCartItemList(item) {
  const cart = document.querySelector('.cart__items');
  cart.appendChild(item);
}

async function fetchItemMercadoLivre(item) {
  const linkItem = `https://api.mercadolibre.com/items/${item}`;
  console.log(linkItem);

  const responseItem = await fetch(linkItem);
  const responseItemJSON = await responseItem.json();
  const newItem = {
    ...item,
    sku: responseItemJSON.id,
    name: responseItemJSON.title,
    salePrice: responseItemJSON.price
  };
  appendChildCartItemList(createCartItemElement(newItem));  
}

function addItemInCartListener() {
  const addButtons = document.querySelectorAll('.item__add');
  addButtons.forEach((addButton) => addButton.addEventListener('click', function(event) {
    const itemID = event.path[1].childNodes[0].innerText;
    fetchItemMercadoLivre(itemID);
  }))
}

async function fetchMercadoLivreAPI(search) {
  const link = `https://api.mercadolibre.com/sites/MLB/search?q=${search}`;

  try {
    const response = await fetch(link);
    const responseJSON = await response.json();
    responseJSON.results.forEach((result) => {
      const item = {
        ...result,
        sku: result.id,
        name: result.title,
        image: result.thumbnail,
      };
      appendChildItemsList(createProductItemElement(item));
    });
    addItemInCartListener();
  } catch (error) {
  }
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

window.onload = function onload() {
  fetchMercadoLivreAPI('computador');
};
