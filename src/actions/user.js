import axios from "axios";
import config from "../config";
// import jws from "jsonwebtoken"; jws.decode(token)
import jwtDecode from "jwt-decode";
import { customFetch, encryptToken } from "../functions/functions";

export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";

export const LOGOUT_REQUEST = "LOGOUT_REQUEST";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const LOGOUT_FAILURE = "LOGOUT_FAILURE";

export const requestLogin = () => ({
  type: LOGIN_REQUEST
});

export const receiveLogin = payload => ({
  type: LOGIN_SUCCESS,
  payload
});

export const loginError = payload => ({
  type: LOGIN_FAILURE,
  payload
});

export const requestLogout = () => ({
  type: LOGOUT_REQUEST
});

export const receiveLogout = () => ({
  type: LOGOUT_SUCCESS
});

// Logs the user out
export const logoutUser = () => dispatch => {
  dispatch(requestLogout());
  dispatch(receiveLogout());
  localStorage.removeItem("HWuCsirI$sD4");
  localStorage.removeItem("(cEAEjW&RjYKWe4:");
  document.cookie = "token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  axios.defaults.headers.common["Authorization"] = "";
};

export const receiveToken = (token, rToken = null) => dispatch => {
  let { exp, nbf, sub: aggregateId } = jwtDecode(token);
  let tokenData = { exp, nbf, aggregateId, token };

  localStorage.setItem("HWuCsirI$sD4", encryptToken(tokenData));

  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`; //still logged in
  dispatch(receiveLogin({ tokenData, rToken }));
};

export const loginUser = ({ email, password }) => async dispatch => {
  dispatch(requestLogin());

  if (email.length <= 0 || password.length <= 0) {
    return dispatch(loginError("Something was wrong. Try again"));
  }

  //fetch data
  try {
    let res = await customFetch({
      url: `${config.authAPI}/connect/token`,
      bodyType: "urlencoded", //json
      method: "POST",
      body: {
        username: email,
        password: password,
        grant_type: "password",
        client_id: "admin.spa.client",
        client_secret: "secret",
        scopes: "communitytiles.api admin.api"
      }
    });
    console.log(res);

    if (res.status !== 200 && res.status !== 201) {
      //created or OK
      throw new Error("Invalid credentials");
    }

    let { access_token, refresh_token } = res.data; // code is ran if if-statemnet is false
    dispatch(receiveToken(access_token, refresh_token));
  } catch (error) {
    dispatch(loginError("Invalid Credentials"));
  }
};
