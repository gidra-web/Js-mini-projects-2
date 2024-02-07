const meals = document.getElementById("meals");

getRandomMeal();

async function getRandomMeal() {
  const resp = await fetch(
    `https://www.themealdb.com/api/json/v1/1/random.php`
  );
  const respData = await resp.json();
  const randomMeal = respData.meals[0];

  addMeal(randomMeal, true);
}

async function getMealById(id) {
  const resp = await fetch(
    `www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const meal = await resp.json();
}

async function getMealBySearch(term) {
  const resp = await fetch(
    `www.themealdb.com/api/json/v1/1/search.php?s=${term}`
  );
  const search = await resp.json();
}

function addMeal(mealData, random = false) {
  console.log(mealData);

  const meal = document.createElement("div");
  meal.classList.add("meal");

  meal.innerHTML = `
    <div class="meal-header">
    ${random ? `<span class="random"> ${mealData.strMeal} </span>` : ""}
    <img
        src="${mealData.strMealThumb}"
        alt="${mealData.strMeal}"
    />
    </div>
    <div class="meal-body">
        <h4>${mealData.strMeal}</h4>
            <button class="fav-btn">
            <i class="fas fa-heart"></i>
        </button>
    </div>
    `;

  meals.appendChild(meal);

  const btn = meal.querySelector(" .meal-body .fav-btn");

  btn.addEventListener("click", () => {
    if (btn.classList.contains("active")) {
      removeMealLS(mealData.idMeal);
      btn.classList.remove("active");
    } else {
      addMealLS(mealData.idMeal);
      btn.classList.add("active");
    }
  });
}

function addMealLS(mealId) {
  const mealIds = getMealLS();

  localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
}

function removeMealLS(mealId) {
  const mealIds = getMealLS();

  localStorage.setItem(
    "mealIds",
    JSON.stringify(mealIds.filter((id) => id !== mealId))
  );
}
function getMealLS() {
  const mealIDs = JSON.parse(localStorage.getItem("mealIds"));
  return mealIDs === null ? [] : mealIDs;
}
