function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  return li;
}

const cartItemClickListener = async (itemID) => {
  try {
    const productDetails = `https://api.mercadolibre.com/items/${itemID}`;
    await fetch(productDetails)
      .then(response => response.json())
      .then((object) => {
        const newProduct = createCartItemElement(object);
        document.querySelector('.cart__items').appendChild(newProduct);
      });
  } catch (error) {
    console.log(`Ocorreu um erro: ${error}`);
  }
};

function createCustomElement(element, className, innerText, sku) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button' && className === 'item__add') {
    e.id = sku;
    e.addEventListener('click', () => {
      cartItemClickListener(e.id);
    });
  }
  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', sku));
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const fetchItems = async (product) => {
  try {
    const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
    await fetch(endpoint)
      .then(response => response.json())
      .then(object => object.results.forEach((productItem) => {
        const itemElement = createProductItemElement(productItem);
        document.querySelector('.items').appendChild(itemElement);
      }));
  } catch (error) {
    console.log(`Houve um erro: ${error}`);
  }
};

const setupEvents = () => {
  fetchItems('computador');
};

window.onload = function onload() {
  setupEvents();
};
