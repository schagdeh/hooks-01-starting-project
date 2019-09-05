import React, { useState, useEffect, useCallback } from 'react';


import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList'

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([])

  useEffect(() => {
    console.log('rendering ingredients', userIngredients)
  }, [userIngredients])

  const filteredIngredientsHandler = useCallback((filteredIngredient) => {
    setUserIngredients(filteredIngredient)
  }, [])

const addIngredientHandler = (ingredient) => {
    fetch('https://react-hooks-01.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json'}
    }).then(response => {
      return response.json()
    }).then(responseData => {
      setUserIngredients(prevIngredients => [
          ...prevIngredients,
          {id: responseData.name, ...ingredient}
        ]
      )
    })

}
const removeIngredientHandler = (id) => {
    setUserIngredients(prevIngredients => prevIngredients.filter(ingredient => ingredient.id !== id)

    )
}
  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler}/>

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
