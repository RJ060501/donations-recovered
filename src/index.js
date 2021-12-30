import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import App from './App';
import reducers from "./reducers";
import axios from 'axios';
import { library } from "@fortawesome/fontawesome-svg-core";
import {
    faHeart,
    faSitemap,
    faHome,
    faTimes
  } from "@fortawesome/free-solid-svg-icons";
library.add(faHeart, faSitemap, faHome, faTimes);

axios.defaults.baseURL = config.baseURLApi;
axios.defaults.headers.common["Content-Type"] = "application/json";

const decryptedToken = decryptToken(
localStorage.getItem("HWuCsirI$sD4"),
"obj"
);
const token = (decryptedToken || {}).token;

if (token) {
axios.defaults.headers.common["Authorization"] = "Bearer " + token;
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
reducers,
composeEnhancers(applyMiddleware(ReduxThunk))
);

ReactDOM.render(
<Provider store={store}>
    <App />
</Provider>,
document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
// ReactDOM.render(<App />, document.querySelector('#root'));