let check = true;

function startLogin() {
    let phone = document.getElementById("phone").value;
    let regexp = /\+?39\s?\d{3}-?\d{6,7}/gmi
    let found = regexp.test(phone);

    if (!found) {
        alert("Inserisci un numero di telefono valido");
    }

    let input = document.getElementById("data-nascita").value;

    if (!input) {
        alert("Inserisci una data di nascita valida.");
        return;
    }

    let birthdate = new Date(input);
    let today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    let month = today.getMonth() - birthdate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthdate.getDate())) {
        age--;
    }

    if (found && age>=18) {
        location.href = 'menu/index.html';
        alert("Login avvenuto con successo!");
    } else {
        check = true;
        console.log(check);
        location.href = 'menu/index.html';
        alert("Login con restrizioni");
    }
}



async function startMenu() {

    let json_path = 'json/menu.json';
    let response = await fetch(json_path);
    let json = await response.json();

    const row = document.getElementById("row");

    json.categories.forEach(category => {
        row.innerHTML += `
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3" id="${category.name}" >
            <figure class="figure">
                <a href="${category.url}">
                    <img src="${category.img}" alt="${category.name}">
                </a>
                <figcaption class="figure-caption">${category.name}</figcaption>
            </figure>
        </div>
    `;
    });
    if (!check) {
        remove('Vini');
        remove('Superalcolici');
        remove('Cocktail');
        remove('Birre');
    }

}


function ciao(id){
    let element = document.getElementById(id);
    element.classList.add('hidden');
}

function remove(id) {
    let div = document.getElementById(id);
    if (div) {
        div.style.display = 'none';
    } else {
        console.log(`Elemento con id ${id} non trovato.`);
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

