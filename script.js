window.onload = function onload() { };

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

const calculateCartTotal = async (price, operator) => {
  const priceField = document.querySelector('span.total-price');
  if (operator === '+') {
    priceField.innerText = Math.round((parseFloat(priceField.innerText) + price) * 100) / 100;
  } else {
    priceField.innerText = Math.round((parseFloat(priceField.innerText) - price) * 100) / 100;
  }
};

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
  const takePrice = itemTitle =>
    paserFloat(item.itemTitle.split('PRICE: $')[1]);
  calculateCartTotal(takePrice(event.target.innerText), '-');
  saveCartInLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
