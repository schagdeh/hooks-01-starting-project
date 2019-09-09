import React, { useReducer, useEffect, useCallback, useMemo } from 'react';


import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList'
import ErrorModal from '../UI/ErrorModal'
import useHttp from '../../Hooks/http'

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients
    case 'ADD':
      return [...currentIngredients, action.ingredients]
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id)
    default:
      throw new Error('Should not get there')
  }
}



const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, [])
  const {isLoading, error, data, sendRequest, reqExtra, reqIdentifier, clear} =useHttp()
  //const [userIngredients, setUserIngredients] = useState([])

  //const [isLoading, setIsLoading] = useState(false)
  //const [error, setError] = useState()

  useEffect(() => {
    //console.log('rendering ingredients', userIngredients)
    if (!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT') {
      dispatch({type: 'DELETE', id: reqExtra })
    } else if (!isLoading && !error && reqIdentifier === 'ADD_INGREDIENT') {
      dispatch({type: 'ADD', ingredients: {id: data.name, ...reqExtra}})

    }
  }, [data, reqExtra, reqIdentifier, isLoading, error])

  const filteredIngredientsHandler = useCallback((filteredIngredient) => {
    //setUserIngredients(filteredIngredient)
    dispatch({type: 'SET', ingredients: filteredIngredient})
  }, [])

const addIngredientHandler = useCallback((ingredient) => {
  sendRequest(
    'https://react-hooks-01.firebaseio.com/ingredients.json',
    'POST',
    JSON.stringify(ingredient),
    ingredient,
    'ADD_INGREDIENT'
    )
  //setIsLoading(true)
  // dispatchHttp({type: 'SEND'})
  //   fetch('https://react-hooks-01.firebaseio.com/ingredients.json', {
  //     method: 'POST',
  //     body: JSON.stringify(ingredient),
  //     headers: { 'Content-Type': 'application/json'}
  //   }).then(response => {
  //     //setIsLoading(false)
  //     dispatchHttp({type: 'RESPONSE'})
  //     return response.json()
  //   }).then(responseData => {
  //     // setUserIngredients(prevIngredients => [
  //     //     ...prevIngredients,
  //     //     {id: responseData.name, ...ingredient}
  //     //   ]
  //     // )
  //     dispatch({type: 'ADD', ingredients: {id: responseData.name, ...ingredient}})
  //   })

}, [sendRequest])
const removeIngredientHandler = useCallback((id) => {
    //setIsLoading(true)
  //dispatchHttp({type: 'SEND'})
  sendRequest(`https://react-hooks-01.firebaseio.com/ingredients/${id}.json`,
    'DELETE',
    null,
    id,
    'REMOVE_INGREDIENT'
    )



}, [sendRequest])

/*const clearError = useCallback(() => {
    //setError(null)
  //dispatchHttp({type: 'CLEAR'})
  //setIsLoading(false)
  clear()
}, [])*/
const IngredientsList = useMemo(() => {
  return  <IngredientList
              ingredients={userIngredients}
              onRemoveItem={removeIngredientHandler}/>

  },[userIngredients, removeIngredientHandler])
  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}/>

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        {IngredientsList}
      </section>
    </div>
  );
}

export default Ingredients;
