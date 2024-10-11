async function start() {

  let json_path = 'json/menu.json';
  let response = await fetch(json_path);
  let json = await response.json();

  for (let i = 0; i < json.categories.length; i++) {

    let column = document.createElement("div");
    column.classList.add("col-xs-12", "col-sm-6", "col-md-4", "col-lg-3");

    let fig = document.createElement("figure");
    fig.classList.add("figure");

    let anchor = document.createElement("a");
    anchor.href = json.categories[i].url;

    let caption = document.createElement("figcaption");
    caption.classList.add("figure-caption");
    caption.innerHTML = json.categories[i].name;

    let img = document.createElement("img");
    img.src = json.categories[i].img;

    anchor.appendChild(img);
    fig.appendChild(anchor);
    fig.appendChild(caption);
    column.appendChild(fig);
    document.getElementById("row").appendChild(column);
  }
}






function description(items) {
  for (let item of items) {
    let productCard = `
            <div class="col-md-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="ciao" >
                            ${item.name}
                            <span class="price">€${item.price.toFixed(2)}</span>
                        </h5>
                        <p class="card-text">${item.description}</p>
                    </div>
                </div>
            </div>`;

    document.getElementById('product-list').insertAdjacentHTML('beforeend', productCard);
  }
}


function ingredients(ul, items) {
  let productList = document.getElementById('product-list');

  items.forEach(item => {
    let productCard = document.createElement('div');
    productCard.classList.add('col-md-4');

    let productItem = `
            <div class="product-item">
                <h5>
                    ${item.name}
                    <span class="price">€${item.price.toFixed(2)}</span>
                </h5>
                <ul class="ingredients">
                    ${item.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>
            </div>`;

    productCard.innerHTML = productItem;

    productList.appendChild(productCard);
  });
}

function cafeteria(coffees, teas, herbalTeas) {
  for (let item of coffees) {
    let productCard = `
            <div class="col-md-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="ciao" >
                            ${item.name}
                            <span class="price">€${item.price.toFixed(2)}</span>
                        </h5>
                        <p class="card-text">${item.description}</p>
                    </div>
                </div>
            </div>`;

    document.getElementById('product-list1').insertAdjacentHTML('beforeend', productCard);
  }
  for (let item of teas) {
    let productCard = `
            <div class="col-md-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="ciao" >
                            ${item.name}
                            <span class="price">€${item.price.toFixed(2)}</span>
                        </h5>
                        <p class="card-text">${item.description}</p>
                    </div>
                </div>
            </div>`;

    document.getElementById('product-list2').insertAdjacentHTML('beforeend', productCard);
  }
  for (let item of herbalTeas) {
    let productCard = `
            <div class="col-md-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="ciao" >
                            ${item.name}
                            <span class="price">€${item.price.toFixed(2)}</span>
                        </h5>
                        <p class="card-text">${item.description}</p>
                    </div>
                </div>
            </div>`;

    document.getElementById('product-list3').insertAdjacentHTML('beforeend', productCard);
  }
}






async function loadDescription(category) {
  let response = await fetch(`../json/${category}.json`);
  let json = await response.json();
  let list = json[category];
  description(list);
}

async function loadIngredients(category) {
  let ul = document.getElementById(category);

  let response = await fetch(`../json/${category}.json`);
  let json = await response.json();
  let list = json[category];
  ingredients(ul, list);
}

async function loadCafeteria(category) {

  let response = await fetch(`../json/${category}.json`);
  let data = await response.json();

  let coffees = data.coffees;
  let teas = data.teas;
  let herbalTeas = data.herbal_teas;

  cafeteria(coffees, teas, herbalTeas);
}

