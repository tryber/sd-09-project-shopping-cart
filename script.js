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
// trazer as coisas da api para cá ok
// eu preciso id = sku, name= title, image = thumbnail
// como eu acesso essas informações? através de buscas de objetos
// console.log(createProductItemElement({ sku, name, image }));

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
  // excluíndo os itens do carrinho
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function apiCart(productId) {
  const endpoint = `https://api.mercadolibre.com/items/${productId}`;
  try {
    const response = await fetch(endpoint);
    const product = await response.json();
    // console.log(object);
    const itemsElement = document.querySelector('.cart__items');
    const { id: sku, title: name, price: salePrice } = product;
    const element = createCartItemElement({ sku, name, salePrice });
    itemsElement.appendChild(element);
    // itemsElement é equivalente ao carrinho
  } catch (error) {
    window.alert(error);
  }
}
// capturando o botão
// Selecionar o produto
// Enviá-lo para o carrinho
function addEventCart() {
  const buttonCart = document.querySelector('.items');
  buttonCart.addEventListener('click', function (event) {
    if (event.target.tagName === 'BUTTON') {
      // capturando somente o button, ignorando outros elementos
      const productId = event.target.parentNode.childNodes[0].innerText;
      // console.log(productId);
      apiCart(productId);
    }
  });
}

async function apiAdd() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  try {
    const response = await fetch(endpoint);
    const object = await response.json();
    const result = object.results;
    // console.log(object);
    const itemsElement = document.querySelector('.items');

    result.forEach((results) => {
      const { id: sku, title: name, thumbnail: image } = results;
      const element = createProductItemElement({ sku, name, image });
      itemsElement.appendChild(element);
    });
  } catch (error) {
    window.alert(error);
  }
}

window.onload = function onload() {
  apiAdd();
  addEventCart();
};
