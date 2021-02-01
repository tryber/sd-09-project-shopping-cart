// window.onload = function onload() { };

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

const newObject = (element) => {
  const { id, title, thumbnail, price } = element;
  const object = {
    sku: id,
    name: title,
    image: thumbnail,
    salePrice: price,
  };
  return object;
};

const fetchListCart = (id) => {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;

  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      if (object.error) {
        throw new Error(object.error);
      }
      codeClimate(object);
    })
    .catch(erro => console.log(erro));
};

function cartItemClickListener(event) {
  // coloque seu código aqui.
  fetchListCart(getSkuFromProductItem(event.path[1]));
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  return li;
}

const codeClimate = (object) => {
  const listCartMain = document.querySelector('.cart__items');
  listCartMain.appendChild(createCartItemElement(newObject(object)));
};

const loopButton = () => {
  const buttonAddItem = document.querySelectorAll('.item__add');
  buttonAddItem.forEach(button => button.addEventListener('click', cartItemClickListener));
};

const fetchMercadorLivre = (id) => {
  const sectionMain = document.querySelector('.items');
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=$${id}`;

  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      if (object.error) {
        throw new Error(object.error);
      }
      object.results.forEach((element) => {
        sectionMain.appendChild(createProductItemElement(newObject(element)));
        loopButton();
      });
    })
    .catch(() => console.log('ERRO'));
};

window.onload = () => {
  fetchMercadorLivre('computador');
};
