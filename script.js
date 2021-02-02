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

const cartItemClickListener = () => {
  // const itemEmpty = document.querySelector('.empty-cart');
  // itemEmpty.addEventListener('click', () => {
  //   document.querySelector('.cart-items');
  // });
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const retrieveItems = async (target) => {
  const cartItem = document.querySelector('.cart__items');
  try {
    const promise = await fetch(`https://api.mercadolibre.com/items/${target}`);
    const response = await promise.json();
    const { id: sku, title: name, base_price: salePrice } = response;
    cartItem.appendChild(createCartItemElement({ sku, name, salePrice }));
  } catch (error) { alert(error); }
};

const captureTargetItem = () => {
  let target = '';

  const itemAdd = document.querySelectorAll('.item__add');
  itemAdd.forEach((element) => {
    element.addEventListener('click', (event) => {
      target = event.target.parentNode.querySelector('.item__sku').innerText;
      retrieveItems(target);
    });
  });
};

const retriveMercadoLivreApi = async () => {
  try {
    const items = document.querySelector('.items');
    const promise = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
    const response = await promise.json();
    response.results.forEach((result) => {
      const { id: sku, title: name, thumbnail: image } = result;
      items.appendChild(createProductItemElement({ sku, name, image }));
    });
    captureTargetItem();
  } catch (error) { alert(error); }
};

window.onload = function onload() {
  retriveMercadoLivreApi();
  cartItemClickListener();
};
