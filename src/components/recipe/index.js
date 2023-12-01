import React from "react";
import "./style.css"; 

export default function RecipeTile({ recipe, onSelect, isSelected }) {
  return (
    recipe["image"].match(/\.(jpeg|jpg|gif|png)$/) != null && (
      <div
        className={`recipeTile ${isSelected ? 'selected' : ''}`}
        onClick={onSelect}
      >
        <img className="recipeTile__img" src={recipe["image"]} alt={recipe["label"]} />
        <p className="recipeTile__name">{recipe["label"]}</p>
      </div>
    )
  );
}