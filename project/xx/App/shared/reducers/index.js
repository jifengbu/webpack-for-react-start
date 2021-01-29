import { combineReducers } from 'redux';
import { routerStateReducer as router } from 'redux-router';
import { relateReducer } from 'relatejs';

export const reducersToCombine = {
    relateReducer,
    router,
};
const rootReducer = combineReducers(reducersToCombine);

export default rootReducer;
