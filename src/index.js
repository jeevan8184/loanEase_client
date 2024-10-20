import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { thunk } from "redux-thunk";
import reducer from "./redux/redux";
import { loadStripe } from "@stripe/stripe-js";
import {PaymentElement} from '@stripe/react-stripe-js';
import { Elements } from "@stripe/react-stripe-js";

const rootReducer=combineReducers({
  reducer
})

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

const stripe=loadStripe("pk_test_51PZz4V2MjBByE5wiGZOMfOvE67nxs782HT0Kht5wvVut2ZnNizlMHkZNPLCyKL68EOWQQhdnuX3qalvOB4umLcpf00djUgAV5f");

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ToastContainer />
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

