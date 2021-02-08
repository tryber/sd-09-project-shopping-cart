const createTotalPrice = () => {
  const whereTotalPrice = document.querySelector('.cart');

  if (document.querySelectorAll('.total-price').length === 0) {
    const totalPrice = document.createElement('span');
    totalPrice.classList.add('total-price');
    totalPrice.innerText = '0';

    whereTotalPrice.appendChild(totalPrice);
  }
};

const updatePrice = (price) => {
  const whereTotalPrice = document.querySelector('.total-price');

  whereTotalPrice.innerText = Number(whereTotalPrice.innerText) + price;
};

const loadingMessage = () => {
  const localOfMessage = document.querySelector('.items');

  const message = document.createElement('p');
  message.classList.add('loading');
  message.innerText = 'loading...';

  localOfMessage.appendChild(message);
};

function cartItemClickListener(event) {
  const whereTotalPrice = document.querySelector('.total-price');
  const clickedItem = event.target.innerText;

  // Como extrair final texto foi retirado do link abaixo.
  // https://www.devmedia.com.br/javascript-substring-selecionando-parte-de-uma-string/39232
  whereTotalPrice.innerText = `${Number(whereTotalPrice.innerText) - Number(clickedItem.substring(clickedItem.indexOf('$') + 1))}`;

  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const returnOfAPIItem = async (idItem) => {
  const endPointItem = `https://api.mercadolibre.com/items/${idItem}`;

  fetch(endPointItem)
    .then(obj => obj.json())
    .then(({ id: sku, title: name, price: salePrice }) => {
      const shoppingCart = document.querySelector('.cart__items');
      createTotalPrice();
      updatePrice(salePrice);
      return (shoppingCart.appendChild(createCartItemElement({ sku, name, salePrice })));
    });
};

const buttonAddToCartListenner = () => {
  const listOfButtons = document.querySelectorAll('.item__add');

  listOfButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      returnOfAPIItem(event.target.parentNode.firstChild.innerText);
    });
  });
};

const clearShoppingCartButton = () => {
  const buttonEmptCart = document.querySelector('.empty-cart');
  const listOfItemsOfCart = document.querySelector('.cart__items');

  buttonEmptCart.addEventListener('click', () => {
    listOfItemsOfCart.innerHTML = '';
    document.querySelector('.total-price').remove();
  });
};

const returnOfAPIList = async (computador) => {
  const endPoint = `https://api.mercadolibre.com/sites/MLB/search?q=${computador}`;

  const retrieveOfAPI = await fetch(endPoint)
    .then(response => response.json())
    .then(object => object.results)
    .catch(error => console.log(error));

  document.querySelector('.items').innerText = '';
  retrieveOfAPI.forEach((element) => {
    const objectItems = {
      sku: element.id,
      name: element.title,
      image: element.thumbnail,
    };

    const newItem = createProductItemElement(objectItems);
    document.querySelector('.items').appendChild(newItem);
  });
  buttonAddToCartListenner();
  clearShoppingCartButton();
};

window.onload = function onload() {
  returnOfAPIList('computador');
  loadingMessage();
};
