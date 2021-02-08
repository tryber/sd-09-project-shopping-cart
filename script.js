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
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function AddItemToCart() {
  const productItem = document.querySelectorAll('.item__add');
  productItem.forEach((item) => {
    item.addEventListener('click', async function (event) {
      const productSku = document.querySelector('.item__sku').innerText;
      endpoints = `https://api.mercadolibre.com/items/${productSku}`;
      const responseApiSku = await fetch(endpoints);
      const responseApiJson = await responseApiSku.json();
      const addItemCart = {
        sku: responseApiJson.id,
        name: responseApiJson.title,
        salePrice: responseApiJson.price,
      };
      createCartItemElement(addItemCart);
      const addSalesCart = document.querySelector('.cart__items');
      addSalesCart.appendChild(createCartItemElement(addItemCart));
    });
  });
}

async function getPost() {
  try {
    const endpoints = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
    const responseApi = await fetch(endpoints);
    const reponseJson = await responseApi.json();
    const results = reponseJson.results;
    results.forEach(({ id, title, thumbnail }) => {
      const createItems = createProductItemElement({ sku: id, name: title, image: thumbnail });
      const elementItems = document.querySelector('.items');
      elementItems.appendChild(createItems);
    });
    AddItemToCart();
  } catch (error) {
    window.alert(error);
  }
}

window.onload = function onload() {
  getPost();
};
