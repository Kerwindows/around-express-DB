class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _handleResponse(res) {
    return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
  }

  initialize() {
    return Promise.all([this.getUser(), this.getInitialCards()]);
  }

  _request(url, options) {
    return fetch(url, options).then(this._handleResponse);
  }

  getInitialCards() {
    return this._request(`${this._baseUrl}/cards`, {
      headers: this._headers,
    });
  }

  getUser() {
        return this._request(`${this._baseUrl}/users/me`, {
         headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
   
  }

  setUserInfo({ name, description }) {
    return this._request(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        about: description,
      }),
    });
  }

  addCard({ name, link }) {
    return this._request(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name: name,
        link: link,
      }),
    });
  }

  deleteCard(cardId) {
    return this._request(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._headers,
    });
  }

  toggleLike(id, isLiked) {
    console.log('liked clicked')
    return this._request(`${this._baseUrl}/cards/${id}/likes`, {
      method: isLiked ? "DELETE" : "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
  }
  updateProfilePic(avatar) {
    return this._request(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        avatar,
      }),
    });
  }
}

// const api = new Api({
//   baseUrl: "https://around.nomoreparties.co/v1/group-12",
//   headers: {
//     authorization: "388e1377-9ab5-4db7-9c4c-d98eb5bc0391",
//     "Content-Type": "application/json",
//   },
// });


const api = new Api({
  baseUrl:
    process.env.NODE_ENV === 'production'
      ? 'https://api.devaround.students.nomoreparties.sbs'
      : 'http://localhost:3000',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
});

export default api;
