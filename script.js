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
const includeLocalStorage = ({ sku, name, salePrice }) => {
  localStorage.setItem(`product-${localStorage.length + 1}`, JSON.stringify({ sku, name, salePrice }));
};

let totalItemsCart = 0;

const sumPricesCart = price => (totalItemsCart += price);

// Removendo item e reordenando lista da LocalStorage
const rewritingList = () => {
  const liProductsCart = document.querySelectorAll('.cart__item');

  localStorage.clear();
  totalItemsCart = 0;
  liProductsCart.forEach(async (item) => {
    const arrayItem = item.innerText.split(' | ');
    const id = arrayItem[0].split(': ')[1];
    const title = arrayItem[1].split(': ')[1];
    const price = arrayItem[2].split(': ')[1].replace('$', '');
    includeLocalStorage({ sku: id, name: title, salePrice: price });

    const total = await sumPricesCart(parseFloat(price));
    document.querySelector('.total-price').innerText = total;
  });
};

function cartItemClickListener(event) {
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
const addListItem = async ({ sku, name, salePrice }) => {
  const productCart = createCartItemElement({ sku, name, salePrice });
  document.querySelector('.cart__items').appendChild(productCart);

  const total = await sumPricesCart(parseFloat(salePrice));
  document.querySelector('.total-price').innerText = total;
};

// Adicionando ao Carrinho de Compras
const addProductCart = async (event) => {
  const ItemID = getSkuFromProductItem(event.target.parentNode);

  const response = await fetch(`https://api.mercadolibre.com/items/${ItemID}`);
  const json = await response.json();

  const { id, title, price } = json;
  addListItem({ sku: id, name: title, salePrice: price });
  includeLocalStorage({ sku: id, name: title, salePrice: price });
};

// Listando produtos
const productListing = async (QUERY) => {
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`);
  const json = await response.json();

  json.results.forEach((objProduct) => {
    const { id, title, thumbnail } = objProduct;

    const productItem = createProductItemElement({ sku: id, name: title, image: thumbnail });
    document.querySelector('.items').appendChild(productItem);
  });

  const allButtonsAdd = document.querySelectorAll('.item');
  allButtonsAdd.forEach(button => button.addEventListener('click', addProductCart));
};

window.onload = function onload() {
  productListing('computador');

  // Adicionando itens no carrinho, ao carregar a página
  if (localStorage.length > 0) {
    for (let index = 1; index <= localStorage.length; index += 1) {
      const objectProductStorage = (JSON.parse(localStorage.getItem(`product-${index}`)));
      addListItem(objectProductStorage);
    }
  }

  const p = createCustomElement('p', 'total-text', 'Preço total: $');
  const span = createCustomElement('span', 'total-price', '0');
  document.querySelector('.cart').appendChild(p).appendChild(span);
};
