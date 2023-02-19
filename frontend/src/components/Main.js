import React, { useContext } from "react";
import edit from "../images/edit.svg";
import vector from "../images/Vector.svg";
import userAvatar from "../images/blank-user.jpg";
import plusSign from "../images/plus-sign.svg";
import Card from "./Card";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Main({
  onEditAvatarClick,
  onEditProfileClick,
  onAddPlaceClick,
  cards,
  onCardClick,
  onCardLike,
  deleteConfirmation,
  getCardToDelete,
}) {
  const currentUser = useContext(CurrentUserContext);
  return (
    <main className='main'>
      <section className='profile'>
        <div className='profile__image-container'>
          <img
            className='profile__image'
            src={currentUser.avatar || userAvatar}
            alt='Person'
          />
          <div className='profile__image-edit'>
            <button
              onClick={onEditAvatarClick}
              className='profile__image-edit-btn'
            >
              <img
                className='profile__image-edit-icon'
                src={vector}
                alt='Edit icon'
              />
            </button>
          </div>
        </div>
        <div className='profile__edit-column'>
          <div className='profile__edit'>
            <h1 className='profile__edit-name'>{currentUser.name}</h1>
            <button
              onClick={onEditProfileClick}
              className='profile__edit-btn'
              type='button'
            >
              <img
                className='profile__edit-icon'
                src={edit}
                alt='Edit button'
              />
            </button>
          </div>
          <p className='profile__about-me'>{currentUser.about}</p>
        </div>

        <button
          onClick={onAddPlaceClick}
          className='profile__add-places-btn'
          type='button'
        >
          <img
            className='profile__add-places-icon'
            src={plusSign}
            alt='Add place'
          />
        </button>
      </section>
      <section className='cards'>
        <ul className='cards__list'>
          {cards.map((card) => (
            <Card
              key={card._id}
              card={card}
              onCardClick={onCardClick}
              onCardLike={onCardLike}
              deleteConfirmation={deleteConfirmation}
              getCardToDelete={getCardToDelete}
            />
          ))}
        </ul>
      </section>
    </main>
  );
}

export default Main;
