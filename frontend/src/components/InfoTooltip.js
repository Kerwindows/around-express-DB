/* --------------------------------- imports -------------------------------- */
import React from "react";
import PopupWithOutForm from "./PopupWithOutForm";
import successful from "../images/successful.svg";
import unsuccessful from "../images/unsuccessful.svg";

/* ------------------------ function EditProfilePopup ----------------------- */

function InfoTooltip({ regStatus, isOpen, onClose }) {
  let regStatusImage = unsuccessful;
  let regStatusNotice = "Oops, something went wrong! Please try again.";

  if (regStatus === true) {
    regStatusImage = successful;
    regStatusNotice = "Success! You have now been registered.";
  }

  return (
    <PopupWithOutForm
      name='registration-status'
      title={regStatusNotice}
      isOpen={isOpen}
      onClose={onClose}
    >
      <img
        className='popup__register'
        src={regStatusImage}
        alt='Registration Success'
      />
    </PopupWithOutForm>
  );
}

export default InfoTooltip;
