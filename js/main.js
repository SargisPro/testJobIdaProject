const productsDB = [

  {
    id: Date.now()+2,
    title: 'Монитор Xiaomi Mi Monitor',
    url: 'https://cdn1.ozone.ru/s3/multimedia-b/c1200/6036183107.jpg',
    subtitle: '23.8 дюймовый IPS FHD дисплей обеспечивает четкие и реалистичные детали изображения и угол обзора 178. 3 - боковой экран без полей для обеспечения ',
    price: 30000
  },

  {
    id: Date.now()+1,
    title: 'Lada Vesta',
    url: 'https://cdnn21.img.ria.ru/images/07e6/02/16/1774389170_0:62:1179:725_1920x0_80_0_0_8dce0684b7a85377942cd3f007d11617.jpg',
    subtitle: 'Первым серийным автомобилем нового поколения стал Lada Vesta SW Cross в максимальной комплектации, окрашенный новой золотистой эмалью "Гарфилд".',
    price: 10000000
  },

  {
    id: Date.now()+4,
    title: 'Стол обеденный раскладной',
    url: 'https://mebel-online-rostov.ru/products/cat_830550/21303142/fullsize/2a239_21303142_802x802_fullsize.jpg',
    subtitle: 'Спортивные автомобили Mercedes-AMG C 43 4MATIC дополняют новое поколение С-Класса. Отточенный дизайн и более сильное отличие от серии AMG Line характеризуют этот рестайлинг.',
    price: 20000
  },

  {
    id: Date.now()+3,
    title: 'Новый MacBoockPro 14 M1',
    url: 'https://www.iphones.ru/wp-content/uploads/2018/06/macbook_on_arm_is_fake_10.jpg',
    subtitle: 'Компьютер Mac оснащен рядом средств, помогающих определить его модель. Самое простое средство — окно «Об этом Mac», которое можно открыть в меню Apple  в левом верхнем углу экрана.',
    price: 260000
  },

  {
    id: Date.now()+6,
    title: 'Окна',
    url: 'http://www.oknatrade.ru/upload/iblock/966/serye_okna_v_interere_kvartiry.jpg',
    subtitle: 'В последнее время отмечается спрос на серые пластиковые окна, которые все чаще заказывают вместо белых моделей. Стремительный рост их популярности некоторые архитекторы уже назвали «серой революцией»',
    price: 70000
  },

  {
    id: Date.now()+5,
    title: 'Наименование товара',
    url: '/images/product1.png',
    subtitle: 'Довольно-таки интересное описание товара в несколько строк. Довольно-таки интересное описание товара в несколько строк',
    price: 10000
  },
];

const allProductsObject = productsDB.reduce((acc, curr) =>  {
  acc[curr.id] = curr;
  return acc;
}, {});

// Elemets UI
const optionMaxMinDefault = document.getElementById('option-sort');
const cardsContainer = document.querySelector('.wrapper-crads');
const onSubmitBtn = document.querySelector('.submit-btn');
const form = document.forms['add-product'];
const formAllElements = [...form.elements];

// Events
form.addEventListener('submit', onFormSubmit);
cardsContainer.addEventListener('click', onDeleteHandler);
optionMaxMinDefault.addEventListener('change', sortInput);

validate(formAllElements);
renderAllProducts(allProductsObject);

function renderAllProducts(products) {
  cardsContainer.innerHTML = '';
  if(!products) {
    console.error('Product list does not exist!');
    return;
  };
  const cardsHTML = Object.values(products).reduceRight((acc, curr) => acc + listItemTemplate(curr),'');

  cardsContainer.insertAdjacentHTML('afterbegin', cardsHTML, {
    TransformStreamDefaultController: true,
  });
};

function onFormSubmit(e) {
  e.preventDefault();

  const newObj = formAllElements.filter(input =>  input.nodeName === "INPUT" || input.nodeName === "TEXTAREA")
  .reduce((acc, curr) => {
    acc[curr.name] = curr.value;
    return acc;
  }, {id: Date.now()});
  allProductsObject[newObj.id] = newObj;

  const listItem = listItemTemplate(newObj);
  cardsContainer.insertAdjacentHTML('afterbegin', listItem);

  onSubmitBtn.classList.remove('validate-btn');

  form.reset();
  return newObj;
};

function onDeleteHandler(e) {
  if(e.target.classList.contains('trash')) {
    if(!confirm('Удалить товар ?')) return;
    const parent = e.target.closest('[ product-id ]');
    const id = parent.getAttribute('product-id');
    delete allProductsObject[id];
    parent.remove();
  };
};

function sortInput() {
  const sortValue = optionMaxMinDefault.value;
  let resultContent;

  switch(sortValue) {
    case 'max-price':
      resultContent = Object.values(allProductsObject).sort((prev, next) =>   prev.price - next.price);
      break;

    case 'min-price':
      resultContent = Object.values(allProductsObject).sort((prev, next) =>  next.price - prev.price);
      break;

    case 'default':
      resultContent = Object.values(allProductsObject).sort((prev, next) => prev.id + next.id);
      break;
  };
  renderAllProducts(resultContent);
};

function validate(input) {
  input.forEach(el => {
    el.addEventListener('input', () => {
      if(!el.value.length) {
        el.parentElement.classList.add('validation-error');
      } else  {
        el.parentElement.classList.remove('validation-error');
      };

      [ ... form.querySelectorAll('input, textarea')].every(el => el.value)
        ? onSubmitBtn.classList.add('validate-btn') : onSubmitBtn.classList.remove('validate-btn');
    });
  });
};

function listItemTemplate({id, title, url, subtitle, price}) {
  const prices = new Intl.NumberFormat('ru-RU').format(price);
  const card = `
      <div product-id="${id}" class="card">
        <img class="trash" src="/images/icons/deleteCard.svg" alt="trash">
        <img src="${url}" alt="photo">
        <div>
          <h2>${title}</h2>
          <p>${subtitle}</p>
          <h3>${prices} руб.</h3>
        </div>
      </div>
  `;
  return card;
};