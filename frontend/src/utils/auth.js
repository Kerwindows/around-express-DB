// export const BASE_URL = "https://register.nomoreparties.co";
export const BASE_URL = "http://localhost:3000";

export const register = (password, identifier) =>
  fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password, email: identifier }),
  }).then((data) => checkResponse(data));

export const authorize = (email, password) =>
  fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  }).then((data) => checkResponse(data));

  export const checkToken = (token) => {
    console.log('checkToken: token = ', token);
    return fetch(`${BASE_URL}/users/me`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((data) => {
      console.log('checkToken: response = ', data);
      return checkResponse(data);
    });
  };
  

const checkResponse = (res) =>
  res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
