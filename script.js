

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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function consumeAPI(computador) {
  const section = document.querySelector('.items');
  await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${computador}`)
    .then(result => result.json())
    .then((objectJSON) => {
      document.querySelector('.loading').remove();
      objectJSON.results.forEach((element) => {
        const sku = element.id;
        const name = element.title;
        const image = element.thumbnail;
        const data = { sku, name, image };
        section.appendChild(createProductItemElement(data));
      });
    });
}

function selectAllItems() {
  const elementList = document.querySelectorAll('.item');
  return elementList;
}

async function selectItem() {
  const elementList = await selectAllItems();
  const cartItems = document.querySelector('.cart__items');
  elementList.forEach((element) => {
    const elementButton = element.querySelector('.item__add');
    elementButton.addEventListener('click', async (event) => {
      const elementID = event.target
        .parentElement
        .querySelector('.item__sku')
        .innerText;
      await fetch(`https://api.mercadolibre.com/items/${elementID}`)
        .then(result => result.json())
        .then((computer) => {
          const info = {
            sku: computer.id,
            name: computer.title,
            salePrice: computer.price,
          };
          cartItems.appendChild(createCartItemElement(info));
          saveItemsLocalStorgae();
          sum(info.salePrice);
        });
    });
  });
}

window.onload = async function onload() {
  await consumeAPI('computador');
  selectItem();
  removeAll();
};
