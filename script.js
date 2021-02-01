const search = (url, query) => url.replace('$QUERY', query);
async function fetchAds(query) {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$QUERY';

  try {
    const ads = await fetch(search(url, query)).then(response => response.json());
    if (ads.error) throw new Error(`${ads.status}: ${ads.message}`);
    return ads.results;
  } catch (error) {
    window.alert(error);
    return undefined;
  }
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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
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
  console.log('xablau');
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addItemToCart(event) {
  const sku = event.path[1].firstChild.innerText;
  const url = 'https://api.mercadolibre.com/items/$QUERY';

  try {
    const info = await fetch(search(url, sku))
      .then(response => response.json());
    const newCartItem = createCartItemElement(info);
    document.querySelector('.cart__items').appendChild(newCartItem);
  } catch (error) {
    window.alert(error);
  }
}

window.onload = async function onload() {
  const ads = await fetchAds('computador');
  ads.forEach((ad) => {
    const newSection = createProductItemElement(ad);
    document.querySelector('.items').appendChild(newSection);
  });
  document.querySelectorAll('.item__add').forEach(item =>
    item.addEventListener('click', addItemToCart));
};
