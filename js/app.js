function startApp() {

    const categoriesSelect = document.querySelector('#categories');
    const areasSelect = document.querySelector('#areas');
    const resultsCatContainer = document.querySelector('#results-cat');
    const resultsFavContainer = document.querySelector('#results-fav');
    const resultsAreaContainer = document.querySelector('#results-area');
    const error = document.querySelector('.error');
    const modal = new bootstrap.Modal('#modal', {});
    
    const favoritesSection = document.querySelector('.favorites');

    if( categoriesSelect ){
        categoriesSelect.addEventListener( 'change', selectCategory );
        getCategories();
    }

    if( areasSelect ) {
        areasSelect.addEventListener( 'change', selectArea );
        getAreas();
    }

    if( favoritesSection ) {
        getFavorites();
    }

    // *********************  functions  ********************

    function getCategories() {
        const url = 'https://www.themealdb.com/api/json/v1/1/categories.php'

        fetch(url)
            .then(res => {
                return res.json()
            })
            .then(result => {
                showCategoriesSelectOptions(result.categories)
            })
    }

    function getAreas() {
        const url = 'https://www.themealdb.com/api/json/v1/1/list.php?a=list'

        fetch(url)
            .then(res => {
                return res.json()
            })
            .then(result => {
                showAreasSelectOptions(result.meals)
            })
    }

    function showCategoriesSelectOptions(categories = []){
        
        categories.forEach(cat =>{
            const opt = document.createElement('option');
            const { strCategory } = cat;

            opt.value = strCategory;
            opt.textContent = strCategory;
            categoriesSelect.appendChild(opt)
        })
    }

    function showAreasSelectOptions(areas = []){
        
        areas.forEach( area =>{
            const opt = document.createElement('option');
            const { strArea } = area;

            opt.value = strArea;
            opt.textContent = strArea;
            areasSelect.appendChild(opt)
        })
    }

    function selectCategory(e) {

        const cat = e.target.value;
        const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`;

        activateSpinner(resultsCatContainer);

        fetch(url)
            .then(res =>{
                return res.json();
            })
            .then(result =>{

                showRecipes(
                    result.meals, 
                    `Discover flavorful recipes belonging to ${cat} category`,
                    resultsCatContainer
                );
            })
            .catch(error => {     
                showError() 
                console.error(error);
            })

    }

    function selectArea(e) {

        const area = e.target.value;
        const url = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`;

        activateSpinner(resultsAreaContainer);

        fetch(url)
            .then(res =>{
                return res.json();
            })
            .then(result =>{
                console.log(result)
                showRecipes(
                    result.meals, 
                    `Discover amazing and tasty ${area} meals`,
                    resultsAreaContainer
                );
            })
            .catch(error => {     
                showError() 
                console.error(error);
            })
    }












    function showRecipes( recipes = [], title, resultsElement ) {

        const rowCategories = document.createElement('DIV');
        rowCategories.classList.add('row', 'g-5');

        const headContainer = document.createElement('DIV');
        headContainer.classList.add('col-12', 'text-center', 'fs-4', 'text-uppercase');
        headContainer.textContent = title;

        rowCategories.appendChild(headContainer);

        recipes.forEach( rec =>{
            const col = document.createElement('DIV');
            col.classList.add('col-md-4');

            const card = document.createElement('DIV');
            card.classList.add('card' );

            const cardImg = document.createElement('IMG');
            cardImg.classList.add('card-img-top');
            // ****************
            cardImg.src = rec.strMealThumb;
            cardImg.alt = `${rec.strMeal} - image`;

            const cardBody = document.createElement('DIV');
            cardBody.classList.add('card-body');

            const cardTitle = document.createElement('H5');
            cardTitle.classList.add('card-title', 'mb-3');
            cardTitle.textContent = `${rec.strMeal}`

            const btn = document.createElement('BUTTON');
            btn.classList.add('btn-custom', 'text-white', 'fw-medium', 'px-3', 'py-1', 'rounded-2');
            btn.textContent = 'See more';
            btn.onclick = function() {
                selectRecipe(rec.idMeal)
            }

            cardBody.appendChild(cardTitle);
            cardBody.appendChild(btn);
            card.appendChild(cardImg);
            card.appendChild(cardBody);
            col.appendChild(card);

            rowCategories.appendChild(col);
        })

        resetHtmlElement(resultsElement);
        resultsElement.appendChild(rowCategories);
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
        const favIcon = document.querySelector('.modal .favorite-icon');
        const modalTitle = document.querySelector('.modal .modal-title');
        const modalBody = document.querySelector('.modal .modal-body');

        favIcon.classList.add('d-none')
        if(existsRecipeOnFavorites( idMeal )){
            favIcon.classList.remove('d-none')
        }

        modalTitle.textContent = strMeal;
        modalBody.innerHTML = `
            <div class="text-center">
                <img class="img-fluid mb-3" src="${strMealThumb}" alt="Meal - ${strMeal}">
            </div>
            
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

        const modalFooter = document.querySelector('.modal-footer');

        resetHtmlElement(modalFooter);

        

        const btnSave = document.createElement('BUTTON');
        btnSave.textContent = existsRecipeOnFavorites( idMeal ) ? 'Remove from favorites' : 'Save as favorite';

        if(existsRecipeOnFavorites( idMeal )) {
            btnSave.classList.add( 'btn', 'col', 'btn-danger' );
        } else {
            btnSave.classList.add( 'btn', 'col', 'btn-custom-bg', 'border', 'border-black' );
        }
        

        btnSave.onclick = function() {

            if( existsRecipeOnFavorites(idMeal) ) {

                btnSave.textContent = 'Save as favorite';
                btnSave.classList.remove('btn-danger');
                btnSave.classList.add('btn-custom-bg', 'border', 'border-black');
                favIcon.classList.add('d-none');
                removeRecipeFromFavorites(idMeal);
                showToast('Removed from favorites');
                return;
            }

            recipeData = {
                idMeal,
                strMeal,
                strMealThumb,
                strInstructions,
                strArea,
                strCategory
            }

            btnSave.textContent = 'Remove from favorites';
            btnSave.classList.remove('btn-custom-bg', 'border', 'border-black');
            btnSave.classList.add('btn-danger');
            favIcon.classList.remove('d-none');
            saveRecipeAsFavorite(recipeData);
            showToast('Added to favorites');
        };

        const btnClose = document.createElement('BUTTON');
        btnClose.classList.add( 'btn', 'col', 'btn-secondary' );
        btnClose.textContent = 'Close';
        btnClose.onclick = function() {
            modal.hide()
        };

        modalFooter.appendChild(btnSave);
        modalFooter.appendChild(btnClose);

        modal.show();

    }

    function removeRecipeFromFavorites(id) {
        const favorites = JSON.parse(localStorage.getItem('favorites')) ?? [];
        const UpdatedFavorites = favorites.filter( rec => rec.idMeal != id);
        localStorage.setItem('favorites', JSON.stringify(UpdatedFavorites));  
    }

    function saveRecipeAsFavorite(recipe) {
        const favorites = JSON.parse(localStorage.getItem('favorites')) ?? [];
        localStorage.setItem('favorites', JSON.stringify([...favorites, recipe]));
    }

    function showToast(message) {
        var toastElement = document.querySelector('#toast');
        var toastBody = document.querySelector('.toast-body');
        var toast = new bootstrap.Toast(toastElement);

        toastBody.textContent = message;
        toast.show();
    }

    function existsRecipeOnFavorites(id){
        const favorites = JSON.parse(localStorage.getItem('favorites')) ?? [];
        return favorites.some( fav => fav.idMeal === id );
    }

    function resetHtmlElement(element) {

        while(element.firstChild) {
            element.removeChild(element.firstChild)
        }

    }

    function showError(){
        error.classList.remove('d-none');
        const errorMessage = document.createElement('DIV');
        errorMessage.classList.add('text-danger', 'text-center');
        error.appendChild(errorMessage)
    }

    function getFavorites(){

        const favorites = JSON.parse(localStorage.getItem('favorites')) ?? [];

        if(favorites.length) {
            showRecipes(
                favorites,
                `Enjoy your favorites`,
                resultsFavContainer
            );
        } else {
            const error = document.createElement('DIV');
            error.classList.add('text-center', 'mt-5');
            error.textContent = 'There are no favorite recipes yet'

            favoritesSection.appendChild(error);
        }

    }

    function activateSpinner(resultsElement){

        resetHtmlElement(resultsElement);

        const spinnerContainer = document.createElement('DIV')
        spinnerContainer.classList.add('d-flex', 'justify-content-center')

        const divSpinner = document.createElement('DIV');
        divSpinner.classList.add('sk-chase');
        divSpinner.innerHTML = `
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
        `;

        spinnerContainer.appendChild(divSpinner);
        resultsElement.appendChild(spinnerContainer);
    }

}

document.addEventListener('DOMContentLoaded', startApp);

