function select(){
  const buttonAdd = document.querySelectorAll('.item__add');
  for (let i = 0; i < buttonAdd.length; i+= 1){
    buttonAdd[i].addEventListener('click', itemCart => {
      const buttonText = document.querySelector('.item__sku').innerText;
      createCartItemElement(buttonText);
    });
    console.log(buttonAdd)
  }
}
const createCElement = (id)  => {
  
  const param = { headers: { Accept: 'application/json' } };
  fetch(`https://api.mercadolibre.com/items/${id}`,param)
   .then ((response) => {response.json()
     .then((data) =>{
        data.results.find((result) => {
        const { id: sku, title: name, price: salePrice } = result;
        createCartItemElement({ sku, name, salePrice });
        })
     })
   })
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

retrieveMercadoLivre = (term) => {
  const param = { headers: { Accept: 'application/json' } };
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${term}`, param)
  .then(response => response.json())
    .then((data) => {
      const itensMercado = document.querySelector('.items');
      console.log(data);
      data.results.forEach((result) => {
        const { id: sku, title: name, thumbnail: image } = result;
        const element = createProductItemElement({ sku, name, image });
        console.log(sku, name, image);
        itensMercado.appendChild(element);
      });
      select();
    });
};


window.onload = function onload() {
  retrieveMercadoLivre('computador');
};