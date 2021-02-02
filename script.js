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
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function updatePriceMinus(event) {
  const totalPriceSpan = document.querySelector('#total-price');
  const priceToBeSubtracted = parseFloat(event.target.id);
  let parseTotalPrice = parseFloat(totalPriceSpan.innerText);

  parseTotalPrice -= priceToBeSubtracted;
  totalPriceSpan.innerText = Math.round(parseTotalPrice * 100) / 100;
}

function cartItemClickListener() {
  const cartItemsOrderedList = document.querySelector('.cart__items');

  cartItemsOrderedList.addEventListener('click', (event) => {
    cartItemsOrderedList.removeChild(event.target);
    updatePriceMinus(event);
  });
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function updatePriceSum(price) {
  const totalPriceSpan = document.querySelector('#total-price');
  let parseTotalPrice = parseFloat(totalPriceSpan.innerText);

  parseTotalPrice += price;
  totalPriceSpan.innerText = Math.round(parseTotalPrice * 100) / 100;
}

async function asyncSum(price) {
  try {
    await updatePriceSum(price);
  } catch (error) {
    window.alert(error);
  }
} 

function addItems(event) {
  if (event.target.className === 'item__add') {
    const cartSection = document.querySelector('.cart__items');
    const endpoint = `https://api.mercadolibre.com/items/${event.target.parentElement.firstChild.innerText}`;

    fetch(endpoint)
      .then(response => response.json())
      .then((data) => {
        const productInfo = {
          sku: data.id,
          name: data.title,
          salePrice: data.price,
        };

        const cartItemElement = createCartItemElement(productInfo);

        cartItemElement.id = productInfo.salePrice;
        cartSection.appendChild(cartItemElement);
        asyncSum(productInfo.salePrice);
      })
      .catch(error => window.alert(error));
  }
}

function addItemsClickListener() {
  const itemAddButtonNodeList = document.querySelector('.items');

  itemAddButtonNodeList.addEventListener('click', addItems);
}
function fetchAPI(term) {
  const loadingSpan = document.querySelector('.loading');
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${term}`;
  const itemsSection = document.querySelector('.items');

  loadingSpan.style.display = 'block';

  fetch(endpoint)
    .then(response => response.json())
    .then((data) => {
      data.results.forEach((result) => {
        const { id: sku, title: name, thumbnail: image } = result;
        // const obj = {
        //   sku: result.id,
        //   name: result.title,
        //   image: result.thumbnail,
        // };

        itemsSection.appendChild(
          createProductItemElement({ sku, name, image }),
        );
      });

      loadingSpan.style.display = 'none';
    })
    .catch((error) => {
      window.alert(error);
    });
}

function clearList() {
  const cartItemsList = document.querySelector('.cart__items');
  const totalPrice = document.querySelector('#total-price');

  cartItemsList.innerHTML = '';
  totalPrice.innerText = 0;
}

function listenToEmptyCartButton() {
  const emptyCartButton = document.querySelector('.empty-cart');

  emptyCartButton.addEventListener('click', clearList);
}

function searchProduct() {
  const itemsSection = document.querySelector('.items');
  const searchIptInput = document.querySelector('#search-ipt');

  if (searchIptInput.value) {
    itemsSection.innerHTML = '';

    fetchAPI(searchIptInput.value);
  }
}

function listenToSearchBtn() {
  const searchBtnButton = document.querySelector('#search-btn');

  searchBtnButton.addEventListener('click', searchProduct);
}

function listenToSearchIpt() {
  const searchIptInput = document.querySelector('#search-ipt');
  const itemsSection = document.querySelector('.items');

  searchIptInput.addEventListener('keypress', (event) => {
    if (event.keyCode === 13 && searchIptInput.value) {
      itemsSection.innerHTML = '';

      fetchAPI(searchIptInput.value);
    }
  });
}

window.onload = function onload() {
  fetchAPI('computador');
  addItemsClickListener();
  cartItemClickListener();
  listenToEmptyCartButton();
  listenToSearchBtn();
  listenToSearchIpt();
};
