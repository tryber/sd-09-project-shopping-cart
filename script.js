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

  const sectionItems = document.querySelector('.items');
  sectionItems.appendChild(section);

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

  const cartItem = document.querySelector('.cart__items');
  cartItem.appendChild(li);

  return li;
}

function getProduct(id) {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then((object) => {
      const product = object.results;
      product.forEach((element) => {
        const { id: sku, title: name, thumbnail: image } = element;
        createProductItemElement({ sku, name, image });
      });
    }).catch(error => window.alert(error));

  if (id) {
    fetch(`https://api.mercadolibre.com/items/${id}`)
      .then(response => response.json())
      .then((object) => {
        const { id: sku, title: name, price: salePrice } = object;
        createCartItemElement({ sku, name, salePrice });
      })
      .catch(error => window.alert(error));
  }
}

function getId(button) {
  if (button.target.className === 'item__add') {
    const id = button.target.parentNode.firstChild.innerText;
    getProduct(id);
  }
}

function addList() {
  const sectionItems = document.querySelector('.items');
  sectionItems.addEventListener('click', getId);
}

window.onload = function onload() {
  getProduct();
  addList();
};
