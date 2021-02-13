

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

// Incluindo na LocalStorage
function includeLocalStorage({ sku, name, salePrice }) {
  localStorage.setItem(`product-${localStorage.length + 1}`, JSON.stringify({ sku, name, salePrice }));
}

// Somatório dos Produtos no Carrinho
function sumPricesCart(price) {
  const total = parseFloat(document.querySelector('.total-price').innerText);
  return Math.round((total + price) * 100) / 100;
}

// Removendo item e reordenando lista da LocalStorage
async function rewritingList() {
  localStorage.clear();
  document.querySelector('.total-price').innerText = '0';

  document.querySelectorAll('.cart__item').forEach((item) => {
    const arrayItem = item.innerText.split(' | ');
    const sku = arrayItem[0].split(': ')[1];
    const name = arrayItem[1].split(': ')[1];
    const salePrice = arrayItem[2].split(': ')[1].replace('$', '');

    includeLocalStorage({ sku, name, salePrice });

    document.querySelector('.total-price').innerText = sumPricesCart(parseFloat(salePrice));
  });
}

// Remove item clicado
async function cartItemClickListener(event) {
  event.target.remove();
  rewritingList();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Adicionando itens no Carrinho de Compras
async function addListItem({ sku, name, salePrice }) {
  const productCart = createCartItemElement({ sku, name, salePrice });
  document.querySelector('.cart__items').appendChild(productCart);

  document.querySelector('.total-price').innerText = sumPricesCart(parseFloat(salePrice));
}

// Adicionando produto ao Carrinho de Compras
const addProductCart = async (event) => {
  const ItemID = getSkuFromProductItem(event.target.parentNode);

  const response = await fetch(`https://api.mercadolibre.com/items/${ItemID}`);
  const json = await response.json();

  const { id, title, price } = json;
  addListItem({ sku: id, name: title, salePrice: price });
  includeLocalStorage({ sku: id, name: title, salePrice: price });
};

// Limpando Carrinho de Compras e LocalStorage
const emptyCartStorage = () => {
  document.querySelector('.total-price').innerText = '0';
  localStorage.clear();

  document.querySelectorAll('.cart__item').forEach((item) => {
    item.remove();
  });
};

// Limpando itens
const emptyProductsItems = () => {
  (document.querySelectorAll('.item')).forEach(item => {
    item.remove();
  });
};

// Loading
function loading() {
  document.querySelector('.items')
    .appendChild(createCustomElement('p', 'loading', 'loading...'));
}

// Listando produtos
const listingProducts = async (QUERY) => {
  emptyProductsItems();

  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`);
  const json = await response.json();

  setTimeout(() => {

    json.results.forEach((objProduct) => {
      const { id, title, thumbnail } = objProduct;

      const productItem = createProductItemElement({ sku: id, name: title, image: thumbnail });
      document.querySelector('.items').appendChild(productItem);
    });

    const allButtonsAdd = document.querySelectorAll('.item');
    allButtonsAdd.forEach(button => button.addEventListener('click', addProductCart));

    document.querySelector('.empty-cart').addEventListener('click', emptyCartStorage);

    document.querySelector('.loading').remove();
  }, 3000);
};

// Adicionando itens no carrinho, ao carregar a página
function recoverItemsLocalstorage() {
  if (localStorage.length > 0) {
    for (let index = 1; index <= localStorage.length; index += 1) {
      const objectProductStorage = (JSON.parse(localStorage.getItem(`product-${index}`)));
      addListItem(objectProductStorage);
    }
  }
}

window.onload = function onload() {
  loading();

  document.querySelector('.cart')
    .appendChild(createCustomElement('p', 'total-text', 'Preço total: $'))
    .appendChild(createCustomElement('span', 'total-price', '0'));

  listingProducts('computador');
  recoverItemsLocalstorage();

  document.querySelector('.button__search').addEventListener('click', () => {
    loading();
    listingProducts(document.querySelector('.input__search').value);
  });
};
