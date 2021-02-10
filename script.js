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
  const textListItem = String(event.path[0].innerText).substring(5, 18);

  event.path[0].remove();
  localStorage.removeItem(Object.entries(localStorage).find(item => item[1] === textListItem )[0]);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function retrieveObjects({ id: sku, title: name, thumbnail: image }) {
  const filhoSection = document.querySelector('section.items');

  filhoSection.appendChild(createProductItemElement({ sku, name, image }));
}

function listItemsInCart(results) {
  const childSection = document.querySelector('.cart__items');

  childSection.appendChild(createCartItemElement(
    { name: results.title, salePrice: results.price, sku: results.id }));
}

async function addItemsCart(tagHtml) {
  const response = await
  fetch(`https://api.mercadolibre.com/items/${tagHtml.path[1].children[0].innerText}`);

  const responseJSON = await response.json();
  const results = responseJSON;

  listItemsInCart(results);
  localStorage.setItem((Math.random() * 1000), results.id);
}

function addAttributesScripts() {
  const button = document.querySelectorAll('button.item__add');

  for (let i = 0; i < button.length; i += 1) {
    document.querySelectorAll('button.item__add')[i].addEventListener('click', (event) => {
      addItemsCart(event);
    });
  }
}

function verifyLocalStorage() {
  if (localStorage.length > 0) {
    Object.values(localStorage).forEach((item) => {
      const response = fetch(`https://api.mercadolibre.com/items/${item}`);
      response.then((res) => {
        res.json().then((ok) => {
          const results = ok;
          listItemsInCart(results);
        });
      });
    });
  }
}

function loadAPI(find = 'computador') {
  const response = fetch(`https://api.mercadolibre.com/sites/MLB/search?q=$${find}`);
  const responseJSON = response.then(res => res.json());

  responseJSON.then(res =>
    (Object.values(res.results).map(item => item).forEach(item => retrieveObjects(item))),
  ).then(() => {
    addAttributesScripts();
    verifyLocalStorage();
  });
}

function cleanListCart() {
  const htmlCollectionChild = document.getElementsByClassName('cart__item');
  const nodeChild = document.querySelectorAll('.cart__items');

  document.querySelectorAll(".empty-cart")[0].addEventListener('click', () => {
    while (nodeChild[0].hasChildNodes() ) nodeChild[0].removeChild(htmlCollectionChild[0]);

    localStorage.clear();
  });
}

window.onload = function onload() {
  loadAPI();
  cleanListCart();
};

/**
OK - Listagem de produtos
OK - Adicione o produto ao carrinho de compras
Remova o item do carrinho de compras ao clicar nele
  2) Remova o item do carrinho de compras ao clicar nele
Carregue o carrinho de compras através do **LocalStorage** ao iniciar a página
  3) Carregue o carrinho de compras através do **LocalStorage** ao iniciar a página
Some o valor total dos itens do carrinho de compras de forma assíncrona
  4) Some o valor total dos itens do carrinho de compras de forma assíncrona
Botão para limpar carrinho de compras
  5) Botão para limpar carrinho de compras
Adicionar um texto de "loading" durante uma requisição à API
  6) Adicionar um texto de "loading" durante uma requisição à API
AssertionError: Timed out retrying: Expected to find element: ``,
but never found it. Queried from element: <ol.cart__items>
AssertionError: Timed out retrying: Expected to find element: `.total-price`, but never found it.
AssertionError: Timed out retrying: Expected to find element: `.loading`, but never found it.
 */
