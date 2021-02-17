window.onload = function onload() { };

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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {}

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

async function consumeAPI(computador) {
  const section = document.querySelector('.items');
  await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${computador}`)
    .then(result => result.json())
    .then((objectJSON) => {
      document.querySelector('.loading').remove();
      objectJSON.results.forEach((element) => {
        const sku = element.id;
        const name = element.title;
        const image = element.thumbnail;
        const data = { sku, name, image };
        section.appendChild(createProductItemElement(data));
      });
    });
}

window.onload = async function onload() {
  await consumeAPI('computador');
};
