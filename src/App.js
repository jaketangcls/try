import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';
import './Greeting.js';
import AppDetails from './Greeting.js';

function App() {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const recipeDetailsRef = useRef(null);

  const YOUR_APP_ID = '82e453da'; 
  const YOUR_APP_KEY = '3bb5d1a3b992f408b9003effd74c9c22'; 

  const getRecipes = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await axios.get(`https://api.edamam.com/search?q=${query}&app_id=${YOUR_APP_ID}&app_key=${YOUR_APP_KEY}`);
      console.log('API Results: ', result.data);
      setRecipes(result.data.hits);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    getRecipes();
  };

  const selectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const clearResults = () => {
    setRecipes([]);
    setSelectedRecipe(null);
  };

  useEffect(() => {
    getRecipes();
  }, []); 

  useEffect(() => {
    
    if (selectedRecipe && recipeDetailsRef.current) {
      recipeDetailsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedRecipe]);

  return (
    <div className="app">
      <a href='index.js'><img id="logo" src="logoRecipe.png" alt="Logo Image"/></a>
      <h1 className="recipe-name">Recipe Finder</h1>
      <form onSubmit={onSubmit} className="search-form">
        <input 
          type="text" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="Search for a recipe"
          className="search-input" 
        />
        <button type="submit" className="search-button">Search</button>
        <button type="button" onClick={clearResults} className="clear-button">Clear</button>
      </form>
      <br />

      {loading && <p id="load">Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      <div>
        <AppDetails />
      </div>
    
      <div className="recipes-container">
        {recipes.map((recipe, index) => (
          <RecipeTile
            key={index}
            recipe={recipe.recipe}
            onSelect={() => selectRecipe(recipe.recipe)}
            isSelected={selectedRecipe && recipe.recipe.label === selectedRecipe.label}
          />
        ))}
      </div>

      {selectedRecipe && (
        <div ref={recipeDetailsRef}>
          <RecipeDetails recipe={selectedRecipe} />
        </div>
      )}
    </div>
  );
}

const RecipeTile = ({ recipe, onSelect, isSelected }) => {
  return (
    <div className={`recipeTile ${isSelected ? 'selected' : ''}`} onClick={onSelect}>
      <img className="recipeTile__img" src={recipe.image} alt={recipe.label} />
      <p className="recipeTile__name">{recipe.label}</p>
      <StarRating rating={recipe.rating || 0} />
    </div>
  );
};

const StarRating = ({ rating }) => {
 
  const stars = Array.from({ length: 5 }, (_, index) => (
    <span key={index} className={index < rating ? 'star-filled' : 'star-empty'}>&#9733;</span>
  ));

  return <div className="star-rating">{stars}</div>;
};

const RecipeDetails = ({ recipe }) => {
  return (
    <div className="recipe-details">
      <h2>{recipe.label}</h2>
      <img src={recipe.image} alt={recipe.label} />
      <p>Calories: {Math.round(recipe.calories)}</p>
      <ul>
        {recipe.ingredientLines.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <StarRating rating={recipe.rating || 0} />
    </div>
  );
};

export default App;