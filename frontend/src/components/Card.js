/* --------------------------------- imports -------------------------------- */
import React, { useContext } from "react";
import trash from "../images/Trash.svg";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

/* ------------------------ function EditProfilePopup ----------------------- */
function Card({
  card,
  onCardClick,
  onCardLike,
  deleteConfirmation,
  getCardToDelete,
}) {
  const currentUser = useContext(CurrentUserContext);

  // Checking if the current user is the owner of the current card
  const isOwn = card.owner._id === currentUser._id;

  // Creating a variable for the delete button
  const cardDeleteButtonClassName = `card__trash ${
    isOwn ? "card__trash_visible" : "card__trash_hidden"
  }`;

  // Check if the card was liked by the current user
  const isLiked = card.likes.some((user) => user._id === currentUser._id);

  // Creating a variable for the like button
  const cardLikeButtonClassName = `card__place-favorite ${
    isLiked ? "card__place-favorite_active" : ""
  }`;

  function handleClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleCardDelete(e) {
    e.preventDefault();
    deleteConfirmation(true);
    getCardToDelete(card);
  }

  return (
    <li className='card'>
      <img
        onClick={handleClick}
        className='card__image'
        src={card.link}
        alt=''
      />
      <button
        className={cardDeleteButtonClassName}
        onClick={handleCardDelete}
        aria-label='Delete card'
      >
        <img
          className='card__trash-image'
          src={trash}
          alt={`Delete ${card.name}`}
        />
      </button>
      <div className='card__place-title'>
        <h2 className='card__place-name'>{card.name}</h2>
        <div className='card__place-container'>
          <button
            onClick={handleLikeClick}
            type='button'
            className={cardLikeButtonClassName}
            aria-label='Like this'
          ></button>
          <p className='card__place-num'>{card.likes.length}</p>
        </div>
      </div>
    </li>
  );
}

export default Card;
