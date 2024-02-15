const meals = document.getElementById("meals");
const favouriteContainer = document.getElementById("fav-meals");

getRandomMeal();
fetchFavMeals();

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
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const respData = await resp.json();
  const meal = respData.meals[0];

  return meal;
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
    favouriteContainer.innerHTML = "";
    fetchFavMeals();
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

async function fetchFavMeals() {
  const mealIds = getMealLS();

  const meals = [];

  for (let i = 0; i < mealIds.length; i++) {
    const mealId = mealIds[i];
    meal = await getMealById(mealId);

    addMealToFav(meal);
    meals.push(meal);
  }

  console.log(meals);

  //add them to Screen
}

function addMealToFav(mealData) {
  const favMeal = document.createElement("li");
  favMeal.classList.add("card");

  favMeal.innerHTML = `
  <img
      src="${mealData.strMealThumb}"
      alt="${mealData.strMeal}"
      draggable="false"
  />
  <span>${mealData.strMeal}</span>
`;

  favouriteContainer.appendChild(favMeal);
}

//
//
// carousel

const wrapper = document.querySelector(".wrapper");
const carousel = document.querySelector(".carousel");
const firstCardWidth = 75;
const arrowBtns = document.querySelectorAll(".wrapper i");
const carouselChildrens = [...carousel.children];

console.log(firstCardWidth);

let isDragging = false,
  isAutoPlay = true,
  startX,
  startScrollLeft,
  timeoutId;

let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

console.log(carousel.offsetWidth);

carouselChildrens
  .slice(-cardPerView)
  .reverse()
  .forEach((card) => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
  });

// Insert copies of the first few cards to end of carousel for infinite scrolling
carouselChildrens.slice(0, cardPerView).forEach((card) => {
  carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Scroll the carousel at appropriate postition to hide first few duplicate cards on Firefox
carousel.classList.add("no-transition");
carousel.scrollLeft = carousel.offsetWidth;
carousel.classList.remove("no-transition");

// Add event listeners for the arrow buttons to scroll the carousel left and right
arrowBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    carousel.scrollLeft += btn.id == "left" ? -firstCardWidth : firstCardWidth;
    console.log(firstCardWidth);
  });
});

// DRAGGING

const dragStart = (e) => {
  isDragging = true;
  carousel.classList.add("dragging");
  // Records the initial cursor and scroll position of the carousel
  startX = e.pageX;
  startScrollLeft = carousel.scrollLeft;
};

const dragging = (e) => {
  if (!isDragging) return; // if isDragging is false return from here
  // Updates the scroll position of the carousel based on the cursor movement
  carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
};

const dragStop = () => {
  isDragging = false;
  carousel.classList.remove("dragging");
};

const infiniteScroll = () => {
  // If the carousel is at the beginning, scroll to the end
  if (carousel.scrollLeft === 0) {
    carousel.classList.add("no-transition");
    carousel.scrollLeft = carousel.scrollWidth - 2 * carousel.offsetWidth;
    carousel.classList.remove("no-transition");
  }
  // If the carousel is at the end, scroll to the beginning
  else if (
    Math.ceil(carousel.scrollLeft) ===
    carousel.scrollWidth - carousel.offsetWidth
  ) {
    carousel.classList.add("no-transition");
    carousel.scrollLeft = carousel.offsetWidth;
    carousel.classList.remove("no-transition");
  }

  // Clear existing timeout & start autoplay if mouse is not hovering over carousel
  clearTimeout(timeoutId);
  if (!wrapper.matches(":hover")) autoPlay();
};

const autoPlay = () => {
  if (window.innerWidth < 350 || !isAutoPlay) return; // Return if window is smaller than 800 or isAutoPlay is false
  // Autoplay the carousel after every 2500 ms
  timeoutId = setTimeout(() => (carousel.scrollLeft += firstCardWidth), 2500);
};
autoPlay();

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);
