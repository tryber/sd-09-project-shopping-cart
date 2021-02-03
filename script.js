function save() {
  const content = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', content);
}

async function price() {
  let total = 0;
  document.querySelectorAll('.cart__item')
  .forEach((item) => { total += parseFloat(item.innerHTML.split('$')[1]); });
  document.querySelector('.total-price').innerHTML = total;
}

function load() {
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('cart');
  price();
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

const fetchList = () => {
  const loading = document.querySelector('.loading');
  loading.innerText = 'loading...';
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(content => content.json())
  .then((object) => {
    object.results.forEach((item) => {
      const itemContent = {
        sku: item.id,
        name: item.title,
        image: item.thumbnail,
      };
      loading.remove();
      console.log(itemContent);
      document.querySelector('.items').appendChild(createProductItemElement(itemContent));
    });
  });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener() {
  // coloque seu código aqui
  const cartSelected = document.querySelector('.cart__items');
  cartSelected.addEventListener('click', (event) => {
    event.target.remove();
    price();
    save();
  });
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  price();
  return li;
}

function moveToCart() {
  const listOfContents = document.querySelector('.items');
  listOfContents.addEventListener('click', (event) => {
    if (event.target.classList.contains('item__add')) {
      const upperEle = event.target.parentElement;
      const upperEleId = getSkuFromProductItem(upperEle);
      fetch(`https://api.mercadolibre.com/items/${upperEleId}`)
      .then(obj => obj.json())
      .then((obj) => {
        const itemToCart = { sku: obj.id, name: obj.title, salePrice: obj.price };
        const itemMoved = createCartItemElement(itemToCart);
        document.querySelector('.cart__items').appendChild(itemMoved);
        save();
      });
    }
  });
}

window.onload = function onload() {
  fetchList();
  moveToCart();
  cartItemClickListener();
  load();
};
