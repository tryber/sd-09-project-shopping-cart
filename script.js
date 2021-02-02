window.onload = function onload() {
  createListing('computador')
 };

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

  // Criar uma listagem de produtos
  // A listagem deve ser consultada na API do mercado livre
  // Deve ser usado o seguinte endpoint: https://api.mercadolibre.com/sites/MLB/search?q=$QUERY
  // A $QUERY deve ser o que buscar (nesse caso deve ser 'computador')
  // A lista deve ser o array results
  // Na função createProductItemElement() criar os componetes HTML referentes ao produto
  // Adicione o elemento retornado da função como filho do elemento <section class="items">
  // sku = id && thumbnail = image

  // Código Português
  // 1. Encontrar onde estão os produtos -- OK
  // 2. Encontrar o array results -- OK
  // 3. Utilizar a função createProductItemElement() para criar os componetes HTML -- OK
  // 4. Colocar o retorno da função createProductItemElement() como filho da section.items -- OK

  // Código JS

function createListing(search) {
  const sectionItems = document.querySelector('.items');
  const promiseAPI = fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${search}`)
    .then((response) => response.json());
  const arrayResults = promiseAPI.then(response => response.results);
  arrayResults.then(response => response.forEach((value) => {
   resultOgj = {
      sku: value.id,
      name: search,
      image: value.thumbnail,
    };
    sectionItems.appendChild(createProductItemElement(resultOgj));
  }));
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
