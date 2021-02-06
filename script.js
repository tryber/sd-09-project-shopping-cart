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

const calctotal = () => {
  total = 0;
  document.querySelectorAll('.cart__item')
    .forEach((item) => {
      const value = parseFloat(item.innerText.split('$')[1]);
      total += value;
    });
  return total;
};

function cartItemClickListener(event) {
  const li = event.toElement;
  li.parentNode.removeChild(li);
  localStorage.setItem('cart', document.querySelector('.cart__items').innerHTML);
  localStorage.setItem('total', calctotal());
  if (document.querySelector('.cart__items').children.length === 0) {
    console.log(document.querySelector('.cart').children);
    document.querySelector('.cart').children[3].innerHTML = null;
    console.log(document.querySelector('.cart').children);
  } else {
    document.querySelector('.total-price').innerText = localStorage.getItem('total');
  }
}

function createCartItemElement({ sku2, name2, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku2} | NAME: ${name2} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const interactionItems = (element, cart) => {
  element.children[3].addEventListener('click', async () => {
    const skuOfElement = getSkuFromProductItem(element);
    const list = await fetch(`https://api.mercadolibre.com/items/${skuOfElement}`);
    const product = await list.json();
    const { id: sku2, title: name2, price: salePrice } = product;
    const cartItem = createCartItemElement({ sku2, name2, salePrice });
    cart.appendChild(cartItem);
    localStorage.setItem('cart', cart.innerHTML);
    localStorage.setItem('total', calctotal());
    if (document.querySelector('.cart').children.length === 3) {
      await document.querySelector('.cart')
        .appendChild(createCustomElement('span', 'total-price', localStorage.getItem('total')));
    } else {
      document.querySelector('.total-price').innerText = localStorage.getItem('total');
    }
  });
};

const appendProducts = async () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const load = createCustomElement('div', 'loading', 'loading');
  document.querySelector('.items').appendChild(load);
  const response = await (await fetch(endpoint)).json();
  document.querySelector('.items').removeChild(load);
  const results = response.results;
  const itens = document.querySelector('.items');
  const cart = document.querySelector('.cart__items');
  results.forEach((result) => {
    const { id: sku, title: name, thumbnail: image } = result;
    const element = createProductItemElement({ sku, name, image });
    itens.appendChild(element);
    interactionItems(element, cart);
  });
};

window.onload = function onload() {
  appendProducts();
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('cart');
  totalCart = localStorage.getItem('total');
  if (document.querySelector('.cart__items').children.length > 0) {
    document.querySelectorAll('.cart__item')
    .forEach((item) => {
      item.addEventListener('click', cartItemClickListener);
    });
    document.querySelector('.cart')
      .appendChild(createCustomElement('span', 'total-price', localStorage.getItem('total')));
  }
  document.querySelector('.empty-cart')
    .addEventListener('click', () => {
      localStorage.setItem('total', 0);
      localStorage.removeItem('cart');
      document.querySelector('.cart__items').innerHTML = null;
      document.querySelector('.total-price').innerText = null;
    });
};
