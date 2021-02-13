let countItems = 0;

// Converter numero para moeda
function formatterNumberCurrency(number) {
  const formatter = new Intl.NumberFormat('pt-br', {
    style: 'currency',
    currency: 'BRL',
  });

  return formatter.format(number);
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

function createProductItemElement({ sku, name, image, salePrice }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement(
      'span',
      'item__price',
      formatterNumberCurrency(salePrice),
    ),
  );
  section
    .appendChild(createCustomElement('button', 'item__add', ''))
    .appendChild(createCustomElement('span', '', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Carregando
function loading() {
  const word = 'loading...';

  const parent = document.querySelector('main header');
  const element = createCustomElement('p', 'loading', '');
  parent.before(element);

  for (let index = 0; index < word.length; index += 1) {
    document
      .querySelector('.loading')
      .appendChild(createCustomElement('span', `loading-letter-${index + 1}`, word[index]));
  }
}

// Limpa os itens ao clicar no botão da paginaçao
function emptyAllItems() {
  if (!document.querySelector('.pagination')) {
    document
      .querySelector('.items')
      .after(createCustomElement('div', 'pagination', ''));
  } else {
    document.querySelector('.pagination').innerHTML = '';
  }
}

// Botões da paginação
function addButtonPagination(total, actual) {
  for (let i = 1; i <= total; i += 1) {
    const element = createCustomElement('button', 'btn-pagination', i);

    if (i === parseInt(actual, 10)) {
      element.classList.add('btn-pagination-active');
    }

    document.querySelector('.pagination').appendChild(element);
  }
}

// Adiciona itens da paginação
function addItemsPagination(object) {
  if (object != null) {
    const { id, title, thumbnail, price } = object;

    const productItem = createProductItemElement({
      sku: id,
      name: title,
      image: thumbnail,
      salePrice: price,
    });

    document.querySelector('.items').appendChild(productItem);
  }
}

// Paginação dos itens
function pagination(items, pageActual = 1, limitItems) {
  const totalPage = Math.ceil(items.length / limitItems);
  let count = (pageActual * limitItems) - limitItems;
  const delimiter = count + limitItems;

  document.querySelector('.items').innerHTML = '';

  emptyAllItems();

  if (totalPage > 1) {
    addButtonPagination(totalPage, pageActual);
  }

  if (pageActual <= totalPage) {
    for (let i = count; i < delimiter; i += 1) {
      addItemsPagination(items[i]);

      count += 1;
    }
  }
}

// Efeito blur
function blurEffect() {
  if (document.querySelector('.blur')) {
    document.querySelector('.blur').classList.add('blur-remove');
    setTimeout(() => {
      document.querySelector('.blur').remove();
      document.querySelector('.button-cart').classList.remove('button-cart-active');
    }, 500);
  } else {
    document.querySelector('.button-cart').classList.add('button-cart-active');

    const parent = document.querySelector('main header');
    const element = createCustomElement('div', 'blur', '');
    parent.before(element);
  }
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

  countItems -= 1;
  document.querySelector('.cart-items').innerText = countItems;
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

  countItems += 1;
  document.querySelector('.cart-items').innerText = countItems;
}

// Adicionando itens no carrinho, ao carregar a página
function recoverItemsLocalstorage() {
  if (localStorage.length > 0) {
    document.querySelector('.cart__items').innerHTML = '';
    document.querySelector('.total-price').innerText = 0;

    for (let index = 1; index <= localStorage.length; index += 1) {
      const objectProductStorage = JSON.parse(localStorage.getItem(`product-${index}`));

      addListItem(objectProductStorage, 0);
    }
  }
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

// Limpar produtos listados
const emptyProducts = () => {
  document.querySelector('.product-title').innerText = '';
  document.querySelector('.total-products').innerText = '';

  if (document.querySelector('.pagination')) {
    document.querySelector('.pagination').innerText = '';
  }

  const li = document.querySelectorAll('.item');

  li.forEach((item) => {
    document.querySelector('.items').removeChild(item);
  });

  countItems = 0;
  document.querySelector('.cart-items').innerText = countItems;
};

// Listando produtos
const listingProducts = async (QUERY = 'computador') => {
  emptyProducts();

  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`);
  const json = await response.json();

  setTimeout(() => {
    recoverItemsLocalstorage();
    pagination(json.results, 1, 10);

    document.querySelector('.pagination').addEventListener('click', (event) => {
      pagination(json.results, event.target.innerText, 10);
    });

    const allButtonsAdd = document.querySelectorAll('.item');
    allButtonsAdd.forEach(button =>
      button.addEventListener('click', addProductCart),
    );

    document.querySelector('.product-title').innerText = QUERY;
    document.querySelector('.total-products').innerText = `${json.results.length} resultados encontrados`;

    document
      .querySelector('.empty-cart')
      .addEventListener('click', emptyCartStorage);

    document.querySelector('.loading').remove();
  }, 3000);
};

function loadingData(value) {
  loading();
  listingProducts(value);
}

function openCloseCart(type) {
  if (type === 'add') {
    document.querySelector('.cart').classList.add('cart-show');
  } else {
    document.querySelector('.cart').classList.remove('cart-show');
  }

  blurEffect();
}

window.onload = function onload() {
  loading();

  document
    .querySelector('.cart')
    .appendChild(createCustomElement('p', 'total-text', 'Preço total: $'))
    .appendChild(createCustomElement('span', 'total-price', '0'));

  listingProducts();

  document
    .querySelector('#product-search')
    .addEventListener('keydown', (event) => {
      if (event.keyCode === 13 && event.target.value.length > 2) {
        loadingData(event.target.value);
      }
    });

  document
  .querySelector('#button-search')
    .addEventListener('click', () => {
      loadingData(document.querySelector('#product-search').value);
    });

  document.querySelector('.button-cart').addEventListener('click', () => {
    openCloseCart('add');
  });

  document.querySelector('.fa-times-circle').addEventListener('click', () => {
    openCloseCart('remove');
  });
};
