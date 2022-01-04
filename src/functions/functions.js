import axios from "axios";
import qs from "query-string";
import Raven from "raven-js";
import { receiveToken } from "../actions/user.js";
import config from "../config.js";
// import SimpleCrypto from "simple-crypto-js";
import jwtDecode from "jwt-decode";
import { useJwt } from "react-jwt";
import jwt from "jwt-encode";


export const customFetch = async ({ method = "POST", ...params }) => {
  try {
    //check if there is a token in argument
    if (params.accessToken && params.refreshToken) {
      if (isTokenExpired(params.accessToken)) {
        //get new access token
        let newTokenData = await getNewTokens(params.refreshToken);
        if (typeof newTokenData != "object") {
          throw new Error("Data received is incorrect");
        }
        axios.defaults.headers.common["Authorization"] =
          "Bearer " + newTokenData.access_token;
        //update accessToken
        params.dispatch(
          receiveToken(newTokenData.acces_token, newTokenData.refresh_token)
        );
      }
    }
    if (params.noAuthorization) {
      axios.defaults.headers.common["Authorization"] = "";
    }
    let axiosObj = {
      url: params.url,
      method: method,
      headers: {}
    };
    switch (params.bodyType) {
      case "urlencoded":
        axiosObj["data"] = qs.stringify(params.body);
        axiosObj.headers["Content-Type"] = "application/x-www-form-urlencoded";
        break;
      case "json":
        axiosObj["data"] = { ...params.body };
        break;
      default:
        axiosObj["data"] = { ...params.body };
        break;
    }
    let res = await axios(axiosObj);
    return res;
  } catch (err) {
    return err;
  }
};

//Check if token is expired after every ____
export const isTokenExpired = tokenData => {
  const date = new Date().getTime() / 1000;
  if (date < (tokenData || {}).exp) {
    return false;
  }
  return true;
};

export const getNewTokens = async refreshToken => {
  try {
    if (!refreshToken) {
      throw new Error();
    }
    let res = await customFetch({
      url: `${config.baseURLApi}/connect/token`,
      method: "POST",
      bodyType: "urlencoded",
      body: {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: "sponsorhub.spa.client",
        client_secret: "secret"
      }
    });
    if (res.status !== 200 && res.status !== 201) {
      throw new Error("Invalid token");
    }
    return res;
  } catch (err) {
    Raven.captureException(err);
    return "There has been an error. Please try again later";
  }
};

export const encryptToken = token => {
  // const { decodedToken, TokenExpired } = useJwt(token)
  try {
    const str = "fqy$RY0g"; // jwt token
    const jwt = jwt.sign(str);
    // const simpleCrypto = new SimpleCrypto(str);
    return jwt.encrypt(token);
  } catch (err) {
    return undefined;
  }
};

export const decryptToken = (token = null, mode = "str") => {
  try {
    if (!token) return;
    const str = "fqy$RY0g";
    const simpleCrypto = new SimpleCrypto(str);
    return simpleCrypto.decrypt(token, mode === "obj" ? true : false);
  } catch (err) {
    return undefined;
  }
};

export const handleValidationTemplate = (initialErrors, { ...data }) => {
  let errors = { ...initialErrors };
  Object.keys(data).forEach(k =>
    data[k].validationFunctions.forEach(inner => {
      if (inner.oneOf) {
        for (let validator of inner.oneOf) {
          let res = validator.fn(validator.args);
          errors[k][validator.mode] = res;
          if (!res) {
            break;
          }
        }
      } else {
        errors[k][inner.mode] = inner.fn(inner.args);
      }
    })
  );
  return errors;
};
// returns null if process if good to go for dispatch
// otherwise, returns validation errors
export const handleSubmitTemplate = ({
  extraConditionals = () => false,
  initialErrors = {},
  ...data
}) => {
  let errors = handleValidationTemplate(initialErrors, data);
  if (
    !Object.values(errors).every(o => Object.keys(o).every(k => !o[k])) ||
    extraConditionals()
  ) {
    return errors;
  }
};

export const numToUsd = (num = 0) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  });
  return formatter.format(num);
};