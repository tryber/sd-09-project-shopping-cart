// Cria o elemento img para receber a imagem do produto
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// Cria um elemento personalizado de acordo com os parâmetros
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// Recupera o id do produto
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Cria elementos para a página
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

// Realiza o cálculo dos ítens do carrinho de compras
async function totalPrice() {
  const calcResult = document.querySelector('.total-price');
  const item = document.querySelectorAll('.cart__item');
  let calc = 0;
  for (let index = 0; index < item.length; index += 1) {
    calc += parseFloat(item[index].innerText.split('$')[1]);
  }
  calcResult.innerHTML = calc;
}

// Retira item do carrinho de compras ao clicar
function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
  const item = `<li class="cart__item">${event.target.innerHTML}</li>`;
  localStorage.Items = localStorage.Items.replace(item, '');
  totalPrice();
}

// Cria elementos li
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Recupera localStorage
function getItemsStorage() {
  const cart = document.querySelector('.cart__items');
  if (localStorage.Items) {
    cart.innerHTML = localStorage.Items;
    cart.addEventListener('click', cartItemClickListener);
  }
  totalPrice();
}

// Recupera dados dos produtos e acrescenta ao carrinho
function dataItems() {
  const btns = document.querySelectorAll('.item__add');
  btns.forEach(btn => btn.addEventListener('click', async (event) => {
    const itemId = getSkuFromProductItem(event.target.parentElement);
    fetch(`https://api.mercadolibre.com/items/${itemId}`)
    .then(response => response.json())
    .then((result) => {
      const newObject = {
        sku: itemId,
        name: result.title,
        salePrice: result.price,
      };
      const object = createCartItemElement(newObject);
      const cart = document.querySelector('.cart__items');
      cart.appendChild(object);
      localStorage.Items = cart.innerHTML;
      totalPrice();
    });
  }));
}

// Recupera dados dos produtos e preenche a página
async function dataMercadoLivre(term) {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${term}`;
  const response = await fetch(endpoint);
  const object = await response.json();
  const results = object.results;
  const itemElement = document.querySelector('.items');
  results.forEach((result) => {
    const { id: sku, title: name, thumbnail: image } = result;
    const element = createProductItemElement({ sku, name, image });
    itemElement.appendChild(element);
  });
  dataItems();
}

function clearCartItems() {
  const cart = document.querySelector('.cart__items');
  const btn = document.querySelector('.empty-cart');
  btn.addEventListener('click', () => {
    cart.innerHTML = '';
    localStorage.clear();
    totalPrice();
  });
}

function msgLoading(onOff) {
  const items = document.querySelector('.items');
  if (onOff === 'on') {
    const loading = createCustomElement('span', 'loading', 'loading...');
    items.appendChild(loading);
  } else {
    items.innerHTML = '';
  }
}

// Inicia as funções após o carregamento da página
window.onload = function onload() {
  msgLoading('on');
  setTimeout(() => {
    msgLoading('off');
    dataMercadoLivre('computador');
    getItemsStorage();
  }, 500);
  totalPrice();
  clearCartItems();
};
