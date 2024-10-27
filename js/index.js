///<reference types="../@types/jquery" />
let apiArr = [];
let apiArrTwo = [];

async function getApi(x="f=s") {
    try {
        $(".loadingsec").fadeIn(0)
        $(".loadingsec").fadeOut(1000)
        let api = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?${x}`);
        let json = await api.json();
        apiArr = json.meals || [];
        displaySearch();
    } catch (error) {
       $(".loadingsec").fadeIn()
       $("main").addClass("d-none")
    }
}
getApi(`s=`)

$(".byName").on("keyup", function() {
    $(getApi(`s=${$(".byName").val()}`));
    $(".byFirstLetter").val("");
    $(".Search .display").removeClass("d-none")
});

$(".byFirstLetter").on("keyup", function() {
    if($(".byFirstLetter").val()==""){
      getApi()
    }
    else{
    getApi(`f=${$(".byFirstLetter").val()}`);}
    
    $(".byName").val("");
    $(".Search .display").removeClass("d-none")
});

function displaySearch() {
    let cart = "";
  
    for (let i = 0; i < apiArr.length; i++) {
        cart += `
        <div class="col-md-3 meal-item" data-index="${i}">
            <figure class="position-relative rounded-3 m-0">
                <img src="${apiArr[i].strMealThumb}" alt="${apiArr[i].strMeal}">
                <h3 class="ps-2 header-img position-absolute d-flex align-items-center top-0 bottom-0 end-0 start-0">${apiArr[i].strMeal}</h3>
            </figure>
        </div>`;
    }
    $(".Search .display").html(cart);
    $(".displayCategorie").html(cart);
    $(".home .display").html(cart);

}

$(".Search .display").on("click", ".meal-item", function() {
    let index = $(this).data("index");
    displaymeal(index);
    $(".Search").addClass("d-none");
    $(".meal").removeClass("d-none");
    $(".open-close").addClass("d-none");
    $("nav").addClass("d-none");
});
$(".home .display").on("click", ".meal-item", function() {
    let index = $(this).data("index");
    displaymeal(index);
    $(".home").addClass("d-none");
    $(".meal").removeClass("d-none");
    $(".open-close").addClass("d-none");
    $("nav").addClass("d-none");
});


function  displaymeal(index) {
    let meal = apiArr[index];
    let cart = `
    <div class="col-md-4">
        <div>
            <img class="rounded-3" src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h2>${meal.strMeal}</h2>
        </div>
    </div>
    <div class="col-md-8">
        <div>
            <article>
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
            </article>
            <h3 class="fw-bold">Area : <span class="fw-normal">${meal.strArea}</span></h3>
            <h3 class="fw-bold">Category : <span class="fw-normal">${meal.strCategory}</span></h3>
            <h3 class="fw-bold">Recipes :</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">
                ${generateIngredientsList(meal)}
            </ul>
            <h3>Tags :</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">
                ${generateTagsList(meal.strTags)}
            </ul>
            <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
            <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
        </div>
    </div>`;
    $(".meal .displaymeal").html(cart);
}

function generateIngredientsList(meal) {
    let ingredients = [];
    for (let i = 1; i <= 20; i++) {
        let ingredient = meal[`strIngredient${i}`];
        let measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim() !== "") {
            ingredients.push(`<li class="alert alert-info m-2 p-1">${measure} ${ingredient}</li>`);
        }
    }
    return ingredients.join("");
}

function generateTagsList(tagsString) {
    if (!tagsString) return "";
    let tags = tagsString.split(",");
    return tags.map(tag => `<li class="alert alert-danger m-2 p-1">${tag.trim()}</li>`).join("");
}

const wNav = $("nav").innerWidth();
$("nav").css("left", -wNav);
$(".open-close").css("left", "0");

$(".open-close .fa-bars").on("click", function() {
    $("nav").animate({left: 0}, 500);
    $(".open-close").animate({left: `${wNav - 10}px`}, 500);


    $("nav ul").children().each(function(index) {
        setTimeout(() => {
            $(this).css('transform', 'translateY(0)');
        }, 200 * (index + 1));
    });

    $(".open-close .fa-xmark").toggleClass("d-none");
    $(".open-close .fa-bars").toggleClass("d-none");
});

$(".open-close .fa-xmark").on("click", function() {
    $("nav").animate({left: -wNav}, 500);
    $("nav ul li").css('transform', 'translateY(650%)');
    $(".open-close").animate({left: 0}, 500);
    $(".open-close .fa-xmark").toggleClass("d-none");
    $(".open-close .fa-bars").toggleClass("d-none");
});

let currentClass = "";

$("nav ul li").on("click", function(){
    let listact = $(this).text().trim();
    if (listact=="Search"){
        $(".Search .display").addClass("d-none");
    }
    if (listact=="Area"){
        $(".displayLocation").removeClass("d-none"); 
    }
    if (listact=="Categories"){
        $(".Categories .container ").removeClass("d-none"); 
    }
    if (listact=="Ingredients"){
        $(".displayIngredients").removeClass("d-none"); 
    }
    $(".home").addClass("d-none")
    $("#Categorie").addClass("d-none")
    if (currentClass !== "") {
        $(`.${currentClass}`).addClass("d-none");
    }
    $(`.${listact}`).removeClass("d-none");
    currentClass = listact;
});

// ------------------------------------------------------

async function getApiCategories(endpoint) {
    try {
        $(".loadingsec").fadeIn(0)
        $(".loadingsec").fadeOut(1000)
        let api = await fetch(`https://www.themealdb.com/api/json/v1/1/${endpoint}`);
        let json = await api.json();
        apiArr = json.meals || [];
        apiArrTwo = json.categories || [];
   
       
    } catch (error) {
        $(".loadingsec").fadeIn()
        $("main").addClass("d-none")
    }
}

$("#Area").on("click", async function() {
   await getApiCategories("list.php?a=list");
   await displayLocation();
});
$("#Ingredients").on("click", async function() {
    await getApiCategories("list.php?i=list");
    displayIngredients();
});

function displayIngredients() {
    let cart = "";
    for (let i = 0; i < apiArr.length; i++) {
        let description = apiArr[i].strDescription ? apiArr[i].strDescription.split(' ').slice(0, 20).join(' ') : "No description available";
        cart += `
        <div class="col-md-3 ingredientsName" data-index="${i}" style="cursor: pointer;">
            <div class="text-center">
                <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                <h3 class="mt-2">${apiArr[i].strIngredient}</h3>
                <p>${description}</p>
            </div>
        </div>`;
    }
    $(".displayIngredients").html(cart);
}
$(".displayIngredients").on("click", ".ingredientsName",async function() {
    let index = $(this).data("index");
    var x = $(this).find("h3").text().trim();
 console.log(x);
    console.log("lol");
    await getApiCategories(`filter.php?i=${x}`);
    console.log(apiArr);
    $(".displayIngredients").addClass("d-none");
    $(".Categorie").removeClass("d-none");
    displaySearch()
  
});

function displayLocation() {
    let cart = "";
    for (let i = 0; i < apiArr.length; i++) {
        cart += `
        <div class="col-md-3 locationName" data-index="${i}" style="cursor: pointer;">
            <div class="text-center">
                <i class="fa-solid  fa-house-laptop fa-4x"></i>
                <h3>${apiArr[i].strArea}</h3>
            </div>
        </div>`;
    }
    $(".displayLocation").html(cart);
}
$(".displayLocation").on("click", ".locationName",async function() {
    let index = $(this).data("index");
 var x=$(this).text().trim()
 console.log(x);
    console.log("lol");
    await getApiCategories(`filter.php?a=${x}`);
    console.log(apiArr);
    $(".displayLocation").addClass("d-none");
    $(".Categorie").removeClass("d-none");
    displaySearch()
  
});

$(".categories").on("click", async function() {
    await getApiCategories("categories.php");
    await displayCategories();
});



function displayCategories() {
    let cart = "";
    if (apiArrTwo.length === 0) {
        cart = `<p>No categories available to display.</p>`;
    } else {
        for (let i = 0; i < apiArrTwo.length; i++) {
            let description = apiArrTwo[i].strCategoryDescription.split(' ').slice(0, 20).join(' ');
            cart += `
            <div class="col-md-3 meal-item" data-index="${i}">
                <figure class="position-relative rounded-3 m-0">
                    <img src="${apiArrTwo[i].strCategoryThumb}" alt="">
                    <figcaption class="position-absolute d-flex flex-column caption text-dark text-center top-0 bottom-0 end-0 start-0">
                        <h3 class="mt-2 header-img">${apiArrTwo[i].strCategory}</h3>
                        <p class="mt-2 px-2">${description}</p>
                    </figcaption>
                </figure>
            </div>`;
        }
    }
    $(".Categories .display").html(cart);
}

$(".Categories .display").on("click", ".meal-item", async function() {
    let index = $(this).data("index");
    console.log(apiArrTwo[index].strCategory);
   await getApiCategories(`filter.php?c=${apiArrTwo[index].strCategory}`)
   displaySearch()
    $(".Categories .meal").addClass("d-none");
    $(".Categorie").removeClass("d-none");
});
$(".displayCategorie").on("click", ".meal-item", async function() {
    try {
       
        let searchText = $(this).text().trim();
        await getApi(`s=${searchText}`);

        console.log(apiArr); 
         displaymeal(0);
        $(".displayCategorie").addClass("d-none");
        $(".Categories").addClass("d-none");
        $(".meal").removeClass("d-none");
        $(".open-close").addClass("d-none");
        $("nav").addClass("d-none");
    } catch (error) {
        console.error('Error in displayCategorie click handler:', error);
    }
});
$(window).on("load",function(){
    $(".loadingsec").fadeOut(1000)
    $("main").removeClass("d-none")
    $(".home").removeClass("d-none")
    
})
$("#nameInput").on("keyup", function () {
    let regexName = /^[a-zA-Z]+$/; 

    if (regexName.test($("#nameInput").val())) {
        $("#nameAlert").addClass("d-none");
    } else {
        $("#nameAlert").removeClass("d-none");
    }
});

$("#emailInput").on("keyup", function () {
    let regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (regexEmail.test($("#emailInput").val())) {
        $("#emailAlert").addClass("d-none");
    } else {
        $("#emailAlert").removeClass("d-none");
    }
});

$("#phoneInput").on("keyup", function () {
    let regexPhone = /^(011|012)[0-9]{8}$/;

    if (regexPhone.test($("#phoneInput").val())) {
        $("#phoneAlert").addClass("d-none");
    } else {
        $("#phoneAlert").removeClass("d-none");
    }
});

$("#ageInput").on("keyup", function () {
    let regexAge = /^(100|[1-9]?[0-9])$/;

    if (regexAge.test($("#ageInput").val())) {
        $("#ageAlert").addClass("d-none");
    } else {
        $("#ageAlert").removeClass("d-none");
    }
});

$("#passwordInput").on("keyup", function () {
    let regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (regexPassword.test($("#passwordInput").val())) {
        $("#passwordAlert").addClass("d-none");
    } else {
        $("#passwordAlert").removeClass("d-none");
    }
});

$("#re-PasswordInput").on("keyup", function () {
    let password = $("#passwordInput").val();
    let rePassword = $("#re-PasswordInput").val();

    if (password === rePassword) {
        $("#re-passwordAlert").addClass("d-none");
    } else {
        $("#re-passwordAlert").removeClass("d-none");
    }
});


$("button").on("click", function(e) {
    if (!$("#nameAlert").hasClass("d-none") ||
        !$("#emailAlert").hasClass("d-none") ||
        !$("#phoneAlert").hasClass("d-none") ||
        !$("#ageAlert").hasClass("d-none") ||
        !$("#passwordAlert").hasClass("d-none") ||
        !$("#re-passwordAlert").hasClass("d-none")) {
        
        e.preventDefault(); 
    }
    
    if ($("#nameInput").val() === "" ||
        $("#emailInput").val() === "" ||
        $("#phoneInput").val() === "" ||
        $("#ageInput").val() === "" ||
        $("#passwordInput").val() === "" ||
        $("#re-PasswordInput").val() === "") {
        
        e.preventDefault(); 
    }
});















