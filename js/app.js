function startApp() {

    const categoriesSelect = document.querySelector('#categories');
    categoriesSelect.addEventListener('change', selectCategory)

    const resultsContainer = document.querySelector('#results');

    getCategories();

    function getCategories() {
        const url = 'https://www.themealdb.com/api/json/v1/1/categories.php'

        fetch(url)
            .then(res => {
                return res.json()
            })
            .then(result => {
                displayCategories(result.categories)
            })
    }

    function displayCategories(categories = []){
        
        categories.forEach(cat =>{
            const opt = document.createElement('option');
            const { strCategory } = cat;

            opt.value = strCategory;
            opt.textContent = strCategory;
            categoriesSelect.appendChild(opt)
        })
    }

    function selectCategory(e) {

        const cat = e.target.value;
        const url = `http://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`;

        // debugger

        fetch(url)
            .then(res =>{
                return res.json();
            })
            .then(result =>{
                
                showRecipes(result.meals);
            })

    }

    function showRecipes(recipes = []) {

        const container = document.createElement('div');
        const row = document.createElement('div');
        container.classList.add('container');
        row.classList.add('row', 'g-3');

        container.appendChild(row);
        

        recipes.forEach( rec =>{

            const col = document.createElement('div');
            col.classList.add('col-md-4');

            const card = document.createElement('div');
            card.classList.add('card', 'mb-4');

            col.appendChild(card);

            card.innerHTML = `
                <img src="${rec.strMealThumb}" class="card-img-top">
                <div>
                    hello world
                </div>
            `
            row.appendChild(col)
        })

        resultsContainer.appendChild(container)

    }

}

document.addEventListener('DOMContentLoaded', startApp);