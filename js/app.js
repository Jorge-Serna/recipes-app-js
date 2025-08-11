function startApp() {

    const categoriesSelect = document.querySelector('#categories');
    const resultsContainer = document.querySelector('#results');
    const homeImg = document.querySelector('.img-container');
    const error = document.querySelector('.error');
    const modal = new bootstrap.Modal('#modal', {});

    categoriesSelect.addEventListener('change', selectCategory);

    getCategories();

    function getCategories() {
        const url = 'https://www.themealdb.com/api/json/v1/1/categories.php'

        fetch(url)
            .then(res => {
                return res.json()
            })
            .then(result => {
                showCategories(result.categories)
            })
    }

    function showCategories(categories = []){
        
        categories.forEach(cat =>{
            const opt = document.createElement('option');
            const { strCategory } = cat;

            opt.value = strCategory;
            opt.textContent = strCategory;
            categoriesSelect.appendChild(opt)
        })
    }

    function selectCategory(e) {

        homeImg.classList.add('d-none')

        if(!error.classList.contains('d-none')){
            error.classList.add('d-none')
        }

        const x = 'esdfgsdfg';

        const cat = e.target.value;
        const url = `http://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`;

        fetch(url)
            .then(res =>{
                return res.json();
            })
            .then(result =>{

                showRecipes(result.meals, cat);
            })
            .catch(error => {      
                showError(error);
            })

    }

    function showRecipes(recipes = [], categoryName) {

        resetHtmlCardsContainer(resultsContainer);

        const headContainer = document.createElement('DIV');
        headContainer.classList.add('col-12');

        const headTitle = document.createElement('H3');
        headTitle.classList.add('m-0', 'p-0', 'text-center')
        headTitle.textContent = recipes.length ? `Here you have several flavorful recipes that you can try using ${categoryName}`: showError();

        headContainer.appendChild(headTitle);
        resultsContainer.appendChild(headContainer);

        recipes.forEach( rec =>{
            const col = document.createElement('DIV');
            col.classList.add('col-md-4');

            const card = document.createElement('DIV');
            card.classList.add('card' );

            const cardImg = document.createElement('IMG');
            cardImg.classList.add('card-img-top');
            cardImg.src = rec.strMealThumb;
            cardImg.alt = `${rec.strMeal} - image`;

            const cardBody = document.createElement('DIV');
            cardBody.classList.add('card-body');

            const cardTitle = document.createElement('H5');
            cardTitle.classList.add('card-title', 'mb-3');
            cardTitle.textContent = `${rec.strMeal}`

            const btn = document.createElement('BUTTON');
            btn.classList.add('btn', 'btn-custom-bg', 'border', 'border-black');
            btn.textContent = 'See more';
            btn.onclick = function() {
                selectRecipe(rec.idMeal)
            }

            cardBody.appendChild(cardTitle);
            cardBody.appendChild(btn);
            card.appendChild(cardImg);
            card.appendChild(cardBody);
            col.appendChild(card);

            resultsContainer.appendChild(col);
        })
    }

    function selectRecipe(id) {
        const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`

        fetch(url)
            .then(res =>{
                return res.json()
            })
            .then(res => {
                return showRecipeModal(res.meals[0]);
            })
    }

    function showRecipeModal(recipe) {

        const { idMeal, strArea, strCategory, strInstructions, strMealThumb, strMeal } = recipe;
        const modalTitle = document.querySelector('.modal .modal-title');
        const modalBody = document.querySelector('.modal .modal-body');

        modalTitle.textContent = strMeal;
        modalBody.innerHTML = `
            <img class="img-fluid mb-3" src="${strMealThumb}" alt="Meal - ${strMeal}">
            <h5>Instructions</h5>
            <p>${strInstructions}</p>
            <h5 class="mb-3">Ingredients & Measures</h5>
        `;

        const list = document.createElement('UL');
        list.classList.add('list-group');


        for(let i = 0; i < 20; i++) {
            if(recipe[`strIngredient${i}`]) {

                const ingredient = recipe[`strIngredient${i}`];
                const measure = recipe[`strMeasure${i}`];

                const listItem = document.createElement('LI');
                listItem.classList.add('list-group-item', 'd-flex');

                const item1 = document.createElement('DIV');
                const item2 = document.createElement('DIV');

                item1.classList.add('w-50', 'border-end', 'border-light');
                item2.classList.add('w-50', 'ps-3');

                item1.textContent = ingredient;
                item2.textContent = measure;

                listItem.appendChild(item1)
                listItem.appendChild(item2)

                list.appendChild(listItem);
            }
        }

        modalBody.appendChild(list);

        modal.show();

    }

    function resetHtmlCardsContainer(element) {

        while(element.firstChild) {
            element.removeChild(element.firstChild)
        }

    }

    function showError(er){
        error.classList.remove('d-none');
        const errorMessage = document.createElement('DIV');
        errorMessage.classList.add('text-danger', 'text-center');
        errorMessage.textContent = er;
        error.appendChild(errorMessage)
    }

}

document.addEventListener('DOMContentLoaded', startApp);