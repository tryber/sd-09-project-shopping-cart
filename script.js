

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

async function LoadProducts() {
  const itemsUrl = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const response = await (await fetch(itemsUrl)).json();
  const products = response.results;
  const sectionItems = document.getElementsByClassName('items');
  products.forEach((product) => {
    const { id: sku, title: name, thumbnail: image } = product;
    const createdproduct = createProductItemElement({ sku, name, image });
    sectionItems[0].appendChild(createdproduct);
    createdproduct.childNodes[3].addEventListener('click', async () =>{
      const cart = document.getElementsByClassName('cart__items')[0];
      const fetchedProduct =  await (await fetch(`https://api.mercadolibre.com/items/${sku}`)).json();
      const { base_price: salePrice } = fetchedProduct;
      cart.appendChild(createCartItemElement({ sku, name, salePrice }));
    })
  });
}

function cartItemClickListener(event) {
  console.log(event)
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
window.onload = async function onload() {
  await LoadProducts();
};
