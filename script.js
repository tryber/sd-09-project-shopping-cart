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
  // coloque seu código aqui
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

async function loadAPI(find = 'computador') {
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=$${find}`);
  const responseJSON = await response.json();
  const results = responseJSON.results;

  return (Object.values(results).map(item => item).forEach(item => retrieveObjects(item)));
}

function addAttributesScripts() {
  const promise = () => new Promise((resolve) => {
    setTimeout(() => {
      const button = document.querySelectorAll('section.item');
      for (let i = 0; i < button.length; i += 1) {
        document.querySelectorAll('section.item')[i].setAttribute('onclick', 'addItemsCart(this)');
      }
    }, 5000);
    return resolve('carregado');
  });

  promise();
}

async function addItemsCart(tagHtml) {
  const response = await fetch(`https://api.mercadolibre.com/items/${tagHtml.children[0].innerText}`);
  const responseJSON = await response.json();
  const results = responseJSON;
  const filhoSection = document.querySelector('.cart__items');

  filhoSection.appendChild(createCartItemElement(
    { sku: results.id,name: results.title,salePrice: results.price, }
  ));
}

window.onload = function onload() {
  loadAPI();
  addAttributesScripts();
};

/**
Listagem de produtos
  ✓ Listagem de produtos (428ms)
Adicione o produto ao carrinho de compras
  1) Adicione o produto ao carrinho de compras
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
