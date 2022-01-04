import { combineReducers } from "redux";
import {
  asyncMac,
  mac,
  mat,
  makeFetchingReducer,
  makeSetReducer,
  reduceReducers,
  makeCrudReducer,
} from "./utils";

const asyncTodos = mat("todos");

const [setPending, setFulfilled, setError] = asyncMac(asyncTodos);

export const setComplete = mac("todos/complete", "payload");
export const setFilter = mac("todos/filter", "payload");

export const fetchThumk = () => async (dispatch) => {
  dispatch(setPending());
  try {
    const response = await fetch("http://jsonplaceholder.typicode.com/todos");
    const data = await response.json();
    const todos = data.slice(0, 10);
    dispatch(setFulfilled(todos));
  } catch (err) {
    dispatch(setError(err.message));
  }
};

export const filterReducer = makeSetReducer(["filter/set"]);

export const fetchingReducer = makeFetchingReducer(asyncTodos);

const fulfilledReducer = makeSetReducer(["todos/fulfilled"]);
const crudReducer = makeCrudReducer(["todo/add", "todo/acomplete"]);
export const todosReducer = reduceReducers(crudReducer, fulfilledReducer);

export const reducer = combineReducers({
  todos: combineReducers({
    entities: todosReducer,
    status: fetchingReducer,
  }),
  filter: filterReducer,
});

export const selectTodos = (state) => {
  const {
    todos: { entities },
    filter,
  } = state;

  if (filter === "complete") {
    return entities.filter((todo) => todo.completed);
  }
  if (filter === "incomplete") {
    return entities.filter((todo) => !todo.completed);
  }
  return entities;
};

export const selectStatus = (state) => state.todos.status;
