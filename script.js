window.onload = function onload() {
  recuperaObjApi('computador');
};
async function recuperaObjApi(search) {
  const endPoint = `https://api.mercadolibre.com/sites/MLB/search?q=${search}`

  const response = await fetch(endPoint);// trata o endpoint retornando uma response
  const objeto = await response.json();// a response é tratada retornado uma objeto
  const resultados = objeto.results;// retorna um o campo resultes dos objetos
  const itens = document.querySelector('.items');// recupera o element com a class  'items'
  resultados.forEach(resultado => {// forEach para percorrer todos os objetos dos resultado
    const { id: sku, title: name, thumbnail: image } = resultado;
    const creatProduct = createProductItemElement({sku, name, image});
    itens.appendChild(creatProduct);
    const buttonsList = document.querySelectorAll('.item__add');
    buttonsList.forEach(button => button.addEventListener('click', addCartShopp));
  });
}
//  testando se o git commit esta funcionando
async function addCartShopp(idItem) {
  const recuperaId = idItem.target.parentNode.querySelector('.item__sku').innerText;

  const endPoint = `https://api.mercadolibre.com/items/${recuperaId}`;
  const response = await fetch(endPoint);
  const obj = await response.json();
  const { id: sku, title: name, price: salePrice } = obj;
  const ol = document.querySelector('.cart__items')
  const li = createCartItemElement({ sku, name, salePrice });

  ol.appendChild(li)
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
