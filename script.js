window.onload = function onload() { 
  getPosts();
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

function createProductItemElement({ id: sku, title: name, thumbnail:image }) {
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

const getPosts = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
  .then((response) => response.json())
  .then((returnResults) => returnResults.results.forEach((item) => {
    const elementItems = createProductItemElement(item);
    document.querySelector('.items').appendChild(elementItems);
  }));
}

//Linha 47 variavel que recebeuma função
//linha 48 endpont da api com o parametro computador para pesquisa
//linha 49 acessando o resolve e retornando arquivo no formato json
//linha 50 acessando o objeto desejado e percorrendo cada item do array
//Linha 51 criando uma variavel que, recebe uma função enviando como parametro
//cada item percorrido do array
//linha 52 acessando o documento e selecionando a classe itens que vai receber
//como elemento filho a variavel que criou a estrutura html