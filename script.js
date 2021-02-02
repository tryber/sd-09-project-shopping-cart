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

const saveLocal = () => {
  localStorage.setItem('saveLocal', document.querySelector('.cart__items').innerHTML);
};

function cartItemClickListener(event) {
  event.target.remove();
  saveLocal();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToCart = async (itemId) => {
  try {
    const response = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
    const itemJson = await response.json();

    const { id: sku, title: name, price: salePrice } = itemJson;
    document.querySelector('.cart__items').appendChild(createCartItemElement({ sku, name, salePrice }));
    saveLocal();
  } catch (error) {
    console.log('Erro ao adicionar item ao carrinho.');
  }
};

const fetchProducts = async (search) => {
  try {
    const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${search}`);
    const resultsJson = await response.json();
    const result = await resultsJson.results;

    result.forEach(({ id: sku, title: name, thumbnail: image }) => {
      document.querySelector('.items').appendChild(createProductItemElement({ sku, name, image }))
        .lastChild.addEventListener('click', (event) => {
          const id = event.target.parentNode.firstChild.innerText;
          addToCart(id);
          saveLocal();
        });
    });
  } catch (error) {
    console.log('Erro ao criar lista de produtos');
  }
};

const restoreLocal = () => {
  const selectItem = document.querySelector('.cart__items');
  if (localStorage.saveLocal) {
    selectItem.innerHTML = localStorage.getItem('saveLocal');
    selectItem.addEventListener('click', (event) => {
      if (event.target.classList.contains('cart__item')) {
        cartItemClickListener(event);
      };
    });
  };
};

window.onload = function onload() {
  fetchProducts('computador');
  restoreLocal();
};
