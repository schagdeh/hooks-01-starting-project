import { useReducer, useCallback } from 'react'

const initailState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null
}


const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return {loading: true, error: null, data: null, extra: null, identifier: action.identifier}
    case 'RESPONSE':
      return {...currentHttpState, loading: false, data: action.responseData, extra: action.extra}
    case 'ERROR':
      return {loading: false, error: action.errorMessage}
    case 'CLEAR':
      return initailState
    default:
      throw new Error('something is wrong')
  }
}


const useHttp = () => {

  const [httpState, dispatchHttp] = useReducer(httpReducer, initailState)

  const clear = useCallback(() => dispatchHttp({type: 'CLEAR'}), [])

  const sendRequest = useCallback((url, method, body, reqExtra, reqIdentifier) => {
    dispatchHttp({type: 'SEND', identifier: reqIdentifier })
    fetch(url, {
      method: method,
      body: body,
        headers: {
        'Content-Type': 'application/json'
        }
    })
    .then(response => {
      return response.json();
    })
    .then(responseData => {
      dispatchHttp({
        type: 'RESPONSE',
        responseData: responseData,
        extra: reqExtra
      })
    })
    .catch(error => {
      //setError(error.message)
      dispatchHttp({type: 'ERROR', errorMessage: error.message})
    })
  }, [])

  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest: sendRequest,
    reqExtra: httpState.extra,
    reqIdentifier: httpState.identifier,
    clear: clear
  }

};

export default useHttp