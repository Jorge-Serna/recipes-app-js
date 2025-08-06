function startApp() {

    const categoriesSelect = document.querySelector('#categories');
    categoriesSelect.addEventListener('change', selectCategory)

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
        const url = `http://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`

        fetch(url)
            .then(res =>{
                return res.json();
            })
            .then(result =>{
                console.log(result)
            })

    }

}

document.addEventListener('DOMContentLoaded', startApp);