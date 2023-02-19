import React from "react";
import closeIcon from "../images/close-icon.svg";
import loader from "../images/loader.png";

function ImagePopup({ onClose, card }) {
  return (
    <div className={`popup ${card && "popup_opened"}`}>
      <div className="popup__overlay"></div>
      <div className="popup__form-card popup__form-image">
        <button
          onClick={onClose}
          aria-label="Close Form Button"
          className="popup__close-btn popup__image-close-btn"
          type="button"
        >
          <img className="popup__close-icon" src={closeIcon} alt="close" />
        </button>
        <img
          className="popup__card-image-preview"
          src={(card && card.link) || {loader}}
          alt={card ? card.name : ""}        />
        <p className="popup__card-image-preview-name">{card && card.name}</p>
      </div>
    </div>
  );
}

export default ImagePopup;
