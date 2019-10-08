import * as types from '../actions';

export default function(state = [], action) {
  const response = action.response;
  if (response === undefined){
    return state;
  }
  return { ...state, response };
};