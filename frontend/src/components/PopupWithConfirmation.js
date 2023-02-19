import React from "react";
import PopupWithForm from "./PopupWithForm";

const PopupWithConfirmation = ({
  onCardDelete,
  cardToDelete,
  isLoading,
  isOpen,
  onClose,
}) => {
  function handleSubmit(e) {
    e.preventDefault();
    onCardDelete(cardToDelete);
  }

  return (
    <PopupWithForm
      name='popup-confirmation'
      title={"Are you sure?"}
      submitText={isLoading ? "Deleting..." : "Are you sure"}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    ></PopupWithForm>
  );
};

export default PopupWithConfirmation;
