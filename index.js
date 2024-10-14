function addRecipe() {
  const name = document.getElementById('recipeName').value;
  const ingredients = getIngredients(); 
  const steps = getSteps(); 
  const image = document.getElementById('recipeImage').files[0];
  if (name === '' || ingredients.length === 0 || steps.length === 0 || !image) {
      alert('Please fill out all fields, add ingredients, preparation steps, and an image.');
      return;
  }
  const reader = new FileReader();
  reader.onload = function(event) {
      const imageDataUrl = event.target.result;
      const newRecipe = {
          name: name,
          ingredients: ingredients.join(', '),
          steps: steps.join(', '),
          image: imageDataUrl
      };
      const recipes = getRecipesFromStorage();
      recipes.push(newRecipe);
      saveRecipesToStorage(recipes);
      document.getElementById('recipeForm').reset();
      clearIngredientSteps();
      alert('Recipe added successfully and stored in the browser!');
  };
  reader.readAsDataURL(image);
}

function saveRecipesToStorage(recipes) {
  localStorage.setItem('recipes', JSON.stringify(recipes));
}

function getRecipesFromStorage() {
  const storedRecipes = localStorage.getItem('recipes');
  return storedRecipes ? JSON.parse(storedRecipes) : [];
}

function loadRecipes() {
  const recipes = getRecipesFromStorage();
  const recipeGrid = document.getElementById('recipeGrid');
  recipeGrid.innerHTML = '';

  const initialLoadCount = 4; 
  const remainingRecipes = recipes.length - initialLoadCount;

  recipes.slice(0, initialLoadCount).forEach((recipe, index) => {
      recipeGrid.appendChild(createRecipeCard(recipe, index));
  });

  if (remainingRecipes > 0) {
      const showMoreButton = document.createElement('button');
      showMoreButton.textContent = 'Show More >>';
      showMoreButton.classList.add('show-more-button');
      showMoreButton.onclick = function() {
         
          recipes.slice(initialLoadCount).forEach((recipe, index) => {
              recipeGrid.appendChild(createRecipeCard(recipe, index + initialLoadCount));
          });
          
          showMoreButton.style.display = 'none';
      };
      recipeGrid.appendChild(showMoreButton);
  }
}

function searchRecipes() {
  const query = document.getElementById('search').value.toLowerCase();
  const recipes = getRecipesFromStorage();
  const recipeGrid = document.getElementById('recipeGrid');
  recipeGrid.innerHTML = '';

  const filteredRecipes = recipes.filter(recipe =>
      recipe.name.toLowerCase().includes(query) ||
      recipe.ingredients.toLowerCase().includes(query)
  );

  if (filteredRecipes.length === 0) {
      recipeGrid.innerHTML = '<p>No recipes found.</p>';
      return;
  }

  filteredRecipes.forEach((recipe, index) => {
      recipeGrid.appendChild(createRecipeCard(recipe, index));
  });
}

function createRecipeCard(recipe, index) {
  const recipeCard = document.createElement('div');
  recipeCard.classList.add('recipe-card');
  recipeCard.innerHTML = `
    <img src="${recipe.image}" alt="${recipe.name}">
    <h3>${recipe.name}</h3>
    <button class="show-button" onclick="showDetails(${index})">Show Recipe</button>
  `;
  return recipeCard;
}

function showDetails(index) {
  const recipes = getRecipesFromStorage();
  const recipe = recipes[index];

  document.getElementById('detailsName').textContent = recipe.name;

  document.getElementById('detailsIngredients').textContent = recipe.ingredients;

  const stepsContainer = document.getElementById('detailsSteps');
  stepsContainer.innerHTML = '';
  const stepsArray = recipe.steps.split(',').map(step => step.trim()); 
  const orderedList = document.createElement('ol');
  stepsArray.forEach((step, index) => {
      const listItem = document.createElement('li');
      listItem.textContent = `Step ${index + 1}: ${step}`;
      orderedList.appendChild(listItem);
  });

  stepsContainer.appendChild(orderedList);
  document.getElementById('recipeDetails').style.display = 'block';
}

function closeDetails() {
  document.getElementById('recipeDetails').style.display = 'none';
}

window.onload = loadRecipes;

document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.burger');
  const navbarList = document.querySelector('.navbarList');

  burger.addEventListener('click', () => {
      navbarList.classList.toggle('active');
  });
});

let ingredients = [];
let steps = [];

function addIngredient() {
  const ingredientInput = document.getElementById('ingredientInput');
  const ingredient = ingredientInput.value.trim();

  if (ingredient) {
      ingredients.push(ingredient);
      ingredientInput.value = ''; 
      displayIngredients();
  } else {
      alert('Please enter an ingredient.');
  }
}

function addStep() {
  const stepInput = document.getElementById('stepInput');
  const step = stepInput.value.trim();

  if (step) {
      steps.push(step);
      stepInput.value = ''; 
      displaySteps();
  } else {
      alert('Please enter a preparation step.');
  }
}

function displayIngredients() {
  const ingredientList = document.getElementById('ingredientList');
  ingredientList.innerHTML = ''; 
  ingredients.forEach((ingredient, index) => {
      const listItem = document.createElement('li');
      listItem.textContent = `${index + 1}. ${ingredient}`;
      ingredientList.appendChild(listItem);
  });
}

function displaySteps() {
  const stepList = document.getElementById('stepList');
  stepList.innerHTML = '';
  steps.forEach((step, index) => {
      const listItem = document.createElement('li');
      listItem.textContent = `Step ${index + 1}: ${step}`; 
      stepList.appendChild(listItem);
  });
}

function getIngredients() {
  return ingredients;
}

function getSteps() {
  return steps;
}

function clearIngredientSteps() {
  ingredients = [];
  steps = [];
  displayIngredients();
  displaySteps();
}
