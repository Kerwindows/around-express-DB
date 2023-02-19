/* --------------------------------- imports -------------------------------- */
import React from "react";
import closeIcon from "../images/close-icon.svg";

/* ------------------------- function PopupWIthOutForm ------------------------- */
function PopupWithOutForm({
  name,
  isOpen,
  onClose,
  onSubmit,
  children,
  title,
}) {
  return (
    <div id={name} className={`popup ${isOpen && "popup_opened"}`}>
      <div className='popup__overlay'></div>
      <div className='popup__form-card'>
        <button
          onClick={onClose}
          aria-label='Close Form Button'
          type='button'
          className={`popup__close-btn popup__${name}-close-btn`}
        >
          <img className='popup__close-icon' src={closeIcon} alt='close' />
        </button>
        <div
          id={name}
          onSubmit={onSubmit}
          className={`popup__${name}-form popup__form`}
          name={`${name}Form`}
        >
          {" "}
          {children}
          <h2 className='popup__form-label' style={{ textAlign: "center" }}>
            {title}
          </h2>
        </div>
      </div>
    </div>
  );
}
export default PopupWithOutForm;
