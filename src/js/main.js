'use strict';

let mainBlock = document.querySelector('.cards');
let logo = document.querySelector('.header--logo');

logo.addEventListener('click', function() {
    window.location.pathname = "/";
});

// Функция ограничения текста для карточек(не более 100 символов)

function cutText() {
    let texts = Array.prototype.slice.call(document.querySelectorAll('.cards--text'));
    for (let i = 0; i < texts.length; i++) {
        let elem = texts[i].textContent.slice(0,100).trim();
        elem +='...';
        texts[i].textContent = elem;
    };
};

// Запрос на загрузку данных и показ карточек

function loadJson() {
    fetch('service.json')
    .then(response => response.json())
    .then(answer => {
        const result = answer.services;
        showCards(result);
    });
};

// Функция отображения карточек на страницу

function showCards(data) {
    for (let i = 0; i < data.length; i++) {
        let block = document.createElement('div');
        block.classList.add('cards--item');
        block.setAttribute('data-alias', data[i].alias);

        console.log(data);
        block.innerHTML = `
        <img class="cards--img" src=${data[i].image} alt="">
            <div class="cards--description">
                <h2 class="cards--tittle">${data[i].title}</h2>
                <p class="cards--text">${data[i].description}</p>
                <div class="cards-tags">
            </div>
        </div>`;

        mainBlock.insertAdjacentElement('beforeend', block);

        let divForSpan = block.querySelector('.cards-tags'); 

        for (let j = 0; j < data[i].properties.length; j++) {
            if (data[i].properties[j].value === 'вода') {
                block.setAttribute('data-query3', data[i].properties[j].value.replace(' ',''));
            }
            if (data[i].properties[j].value === 'профи') {
                block.setAttribute('data-query4', data[i].properties[j].value.replace(' ',''));
            }
            if (data[i].properties[j].value === 'мастер') {
                block.setAttribute('data-query4', data[i].properties[j].value.replace(' ',''));
            }
            
            block.setAttribute(`data-query${[j]}`, data[i].properties[j].value.replace(' ',''));
            let span = document.createElement('span');
            span.innerHTML = `#${data[i].properties[j].value}`;
            divForSpan.insertAdjacentElement('beforeend', span);
        };
    };
    
    cutText();
};

// Нативный шаблонизатор

// Шаблон главной страницы

const mainPageTemplate = function() {
    return `<section class="inputs">
    <div class="input input--quantity">
        <select data-query="query0" class="select filter__quantity" name="filter__quantity">
            <option value="">Количество занятий</option>
            <option value='100занятий'>100 занятий</option>
            <option value='36занятий'>36 занятий</option>
            <option value='18занятий'>18 занятий</option>
            <option value='разовоепосещение'>разовое посещение</option>
        </select>
    </div>
    <div class="input input--validity">
        <select data-query="query1" class="select filter__validity" name="filter__validity">
            <option value="">Срок действия</option>
            <option value='1год'>1 год</option>
            <option value='6месяцев'>6 месяцев</option>
            <option value='1месяц'>1 месяц</option>
        </select>
    </div>
    <div class="input input--time">
        <select data-query="query2" class="select filter__time" name="filter__time">
            <option value="">Время помещения</option>
            <option value='утро'>утро</option>
            <option value='вечер'>вечер</option>
        </select>
    </div>
    <div class="input input--type">
        <select data-query="query3" class="select filter__type" name="filter__type">
            <option value="">Тип секции</option>
            <option value='вода'>вода</option>
        </select>
    </div>
    <div class="input input--category">
        <select data-query="query4" class="select filter__category" name="filter__category">
            <option value="">Категория тренера</option>
            <option value='мастер'>мастер</option>
            <option value='профи'>профи</option>
        </select>
    </div>
    </section>`
};

// Шаблон одной карточки

const cardPageTemplate = function() {
    return `<section class="card">
    <div class="container container--card">
        <div class="card--img">
        <img src="", width="400" alt="">
        </div>
        <div class="card-description">
            <h2 class="card--tittle">Мультикарта Fitness House</h2>
            <p class="card--text">Абонемент на посещение любого спортивного клуба сети Fitness House в течении 1 года но не более 100 занятий в свбодное время.</p>
            <p class="card--count">Колличество занятий - 100 занятий</p>
            <p class="card--term">Срок действия - 1 год</p>
            <div class="card--summary">
            <div class="price">5 000</div>
            <button class="card-button">Купить</button>
            </div>
            </div>
    </div>
</section>`
};

// Функция отрисовки шаблона

const PageType = {
    MainPageType: "main",
    CardPageType: "card",
    DefaultPageType: "main"
};

const templates = {
    [ PageType.MainPageType ]: mainPageTemplate,
    [ PageType.CardPageType ]: cardPageTemplate,
    [ PageType.DefaultPageType ]: mainPageTemplate,
};

let container = document.body.querySelector('.main--container');

const router = {
    set(routeType) {
        let renderHtml = templates[routeType]();
        container.insertAdjacentHTML('afterbegin', renderHtml);
    }
};

function loadDefaultPages() {
    router.set(PageType.DefaultPageType);
    loadJson();
};

loadDefaultPages();

// Навигация шаблонизатора по карточкам

container.addEventListener('click', openCard, true);

function openCard(event) {
    if(event.target.classList.contains('cards--img')) {
        let card = event.target.parentNode;
        let attr = card.getAttribute('data-alias');

        clearContainer();

        fetch('service.json')
        .then(response => response.json())
        .then(answer => {
            const result = answer.services;
            changeRouting(attr, result);
        });
        
    };
};

// Очистка предыдущего состояния DOM дерева

function clearContainer() {
    container.innerHTML = '';
}

// Функция отрисовки одной из карточек

function showSingleCard(data, i) {
    let block = document.createElement('section');
        block.classList.add('card');
        block.innerHTML = `
            <div class="container container--card">
                <div class="card--img">
                <img src=${data[i].image} width="400" alt="">
                </div>
                <div class="cards--description">
                    <h2 class="card--tittle">Мультикарта Fitness House</h2>
                    <p class="card--text">${data[i].description}</p>
                    <p class="card--count">Колличество занятий - ${data[i].properties[0].value}</p>
                    <p class="card--term">Срок действия - ${data[i].properties[1].value}</p>
                    <div class="card--summary">
                        <div class="price">${data[i].price}</div>
                        <button class="card-button">Купить</button>
                    </div>
                </div>
            </div>`;
    container.insertAdjacentElement('beforeend', block);
};

// Счетчик корзины

let buttons = Array.from(document.querySelectorAll('.card-button'));
let headerCount = document.querySelector('.header--count > span');
let count = sessionStorage.getItem('count');

document.body.addEventListener('click', function(event) {
    if (event.target.classList.contains('card-button')) {
        count = sessionStorage.getItem('count');
        count++;
        sessionStorage.setItem('count', count);
        headerCount.innerHTML = sessionStorage.getItem('count');
    }       
}, true);

headerCount.innerHTML = (sessionStorage.getItem('count')) ? sessionStorage.getItem('count'): '0';

// Роутинг

function navigationToGo(pathName) {
    window.history.pushState(
    {}, 
    pathName,
    window.location.origin + pathName
    );
};


// Отрисовка страницы при смене url

window.onpopstate = function(result) {
    filter();
    if (window.location.pathname === "/") {
        clearContainer();
        let sectionCards = document.createElement('section');
        sectionCards.classList.add('cards');
        container.append(sectionCards);
        mainBlock = document.querySelector('.cards');
        loadDefaultPages();
        filter();
    };

    if (window.location.pathname === "/multikarta-fitness-house") {
        clearContainer();
        fetch('service.json')
        .then(response => response.json())
        .then(answer => {
            const result = answer.services;
            let i = 0;
            showSingleCard(result, i);
        });
    };

    if (window.location.pathname === "/abonement-fitness-house") {
        clearContainer();
        fetch('service.json')
        .then(response => response.json())
        .then(answer => {
            const result = answer.services;
            let i = 1;
            showSingleCard(result, i);
        });
    };

    if (window.location.pathname === "/detskaya-sekcia-voda") {
        clearContainer();
        fetch('service.json')
        .then(response => response.json())
        .then(answer => {
            const result = answer.services;
            let i = 2;
            showSingleCard(result, i);
        });
    };

    if (window.location.pathname === "/paket-prsonalnih-trenirovok") {
        clearContainer();
        fetch('service.json')
        .then(response => response.json())
        .then(answer => {
            const result = answer.services;
            let i = 3;
            showSingleCard(result, i);
        });
    }

    if (window.location.pathname === "/gruppovie-zanatiya") {
        clearContainer();
        fetch('service.json')
        .then(response => response.json())
        .then(answer => {
            const result = answer.services;
            let i = 4;
            showSingleCard(result, i);
        });
    }

    if (window.location.pathname === "/master-class") {
        clearContainer();
        fetch('service.json')
        .then(response => response.json())
        .then(answer => {
            const result = answer.services;
            let i = 5;
            showSingleCard(result, i);
        });
    }
};


// Функция роутинга

function changeRouting(attr, result) {
    switch(attr) {
        case 'multikarta-fitness-house' : {
            let i = 0;
            showSingleCard(result, i);
            navigationToGo('/multikarta-fitness-house');
            break;
        };
        case 'abonement-fitness-house' : {
            let i = 1;
            showSingleCard(result, i);
            navigationToGo('/abonement-fitness-house');
            break;
        };
        case 'detskaya-sekcia-voda' : {
            let i = 2;
            showSingleCard(result, i);
            navigationToGo('/detskaya-sekcia-voda');
            break;
        };
        case 'paket-prsonalnih-trenirovok' : {
            let i = 3;
            showSingleCard(result, i);
            navigationToGo('/paket-prsonalnih-trenirovok');
            break;
        };
        case 'gruppovie-zanatiya' : {
            let i = 4;
            showSingleCard(result, i);
            navigationToGo('/gruppovie-zanatiya');
            break;
        };
        case 'master-class' : {
            let i = 5;
            showSingleCard(result, i);
            navigationToGo('/master-class');
            break;
        }
    }
};


// Фильтрация элементов

filter();

function filter() {
    setTimeout(() => {
        const selects = Array.from(document.getElementsByClassName('select'));
        const blocks = Array.from(document.getElementsByClassName('cards--item'));
        const query = {};

        function hideBlock(block) {
            block.style.display = 'none';
        };

        function showBlock(block) {
            block.style.display = 'block';
        };

        function updateQuery(e) {
            const updatedQuery = e.target.dataset['query'];
    
        if (event.target.value) {
            query[updatedQuery] = e.target.value;
        }
        else {
            delete query[updatedQuery];
        }
    
        const blocksToShow = blocks.filter(block => {
            return Object.entries(query).every(([key, value]) => {
            return block.dataset[key] === value;
        });
    });

    
        blocks.forEach(block => hideBlock(block));
        blocksToShow.forEach(block => showBlock(block));
    };

    selects.forEach(select => select.addEventListener('change', updateQuery));
    }, 1000);
};
