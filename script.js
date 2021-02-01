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

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchSelectedItem = async (event) => {
  const id = getSkuFromProductItem(event.target.parentNode)
  const endpoint = `https://api.mercadolibre.com/items/${id}`;

  try {
    const response = await fetch(endpoint);
    const object = await response.json();

    if (object.error) {
      throw new Error(object.error);
    }
    
      const salePrice = object.price;
      const name = object.title;
      const sku = object.id;
      const result = createCartItemElement({ sku, name, salePrice });
      const cartItens = document.querySelector('.cart__items');
      console.log(cartItens);
      cartItens.appendChild(result);
  } catch (error) {
    window.alert(error);
  }
}

const fetchItensComputers = async () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

  try {
    const response = await fetch(endpoint);
    const object = await response.json();

    if (object.error) {
      throw new Error(object.error);
    }
    object.results.forEach((item) => {
      const image = item.thumbnail;
      const name = item.title;
      const sku = item.id;
      const eachResult = createProductItemElement({ sku, name, image });
      const itens = document.querySelector('.items');
      itens.appendChild(eachResult);
    });
  } catch (error) {
    window.alert(error);
  }
  const addToCartButtons = document.querySelectorAll('.item__add');
  addToCartButtons.forEach((button) => {
    button.addEventListener('click', fetchSelectedItem);
  });
};

window.onload = function onload() {
  fetchItensComputers();
};
