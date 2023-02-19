export const BASE_URL = "https://register.nomoreparties.co";

export const register = (password, identifier) =>
  fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      authorization: "388e1377-9ab5-4db7-9c4c-d98eb5bc0391",
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

export const checkToken = (token) =>
  fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((data) => checkResponse(data));

const checkResponse = (res) =>
  res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
