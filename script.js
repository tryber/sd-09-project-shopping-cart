
// Função que recebe um parametro monta a estrutura html
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}
// Função que insere a tag no html
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}
// Recebe um parametro e retorna texto no formato html
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}
//Função que adiciona produto ao carrinho mediante a parametros no formato
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}



async function getPost() {
  try {
  const endpoints = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  const responseApi = await fetch(endpoints);
  const reponseJson = await responseApi.json();
  const results = reponseJson.results
 // console.log(results)
  results.forEach(({ id, title, thumbnail }) => { 
  const createItems = createProductItemElement({sku: id, name: title, image: thumbnail})
  const elementItems = document.querySelector('.items')
  console.log(elementItems)
  elementItems.appendChild(createItems)
  });
  } catch (error){
    window.alert(error);
  };
};

window.onload = function onload() { 
  getPost();
};