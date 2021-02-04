/*
window.onload = () => onload() {
  retrieveMercadoLivre('computador');
 };*/
 retrieveMercadoLivre = (term) => {
  const param = { headers: {Accept: 'application/json'}};
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${term}`, param)
 .then((response) => {
   response.json()
    .then((data) => {
    console.log(data);
    const resultados = data.results.forEach((result1) => {
      const {id: sku, title: name, thumbnail:image} = result1;
      return createProductItemElement(sku, name , image)});
      
    
    
    //console.log(data.results[0].title);
 });
 
    
   
  })
}
 retrieveMercadoLivre('computador');
/*
retrieveMercadoLivre('computador');
 async function retrieveMercadoLivre() {
   const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${term}`;
 
 const response = await fetch(endpoint);
 const object = await response.json();
 const results = object.results;

 results.forEach((result => 
  const {id:sku, title: name, thumbnail:image} = result;
  const element = createProductItemElement ({skul, name, image});)
  }*/

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
