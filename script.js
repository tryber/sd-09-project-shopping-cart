function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  
  return section;
};

const returnOfAPI = async (computador) => {
  const endPoint = `https://api.mercadolibre.com/sites/MLB/search?q=${computador}`;

  const retrieveOfAPI = await fetch(endPoint)
    .then(response => response.json())
    .then(object => object.results)
    .catch(error => console.log(error));

  retrieveOfAPI.forEach((element) => {
    const objectItems = {
      sku: element.id,
      name: element.title,
      image: element.thumbnail,
    };
    const newItem = createProductItemElement(objectItems);
    document.querySelector('.items').appendChild(newItem);
  });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
};

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

window.onload = function onload() {
  returnOfAPI('computador');
};
