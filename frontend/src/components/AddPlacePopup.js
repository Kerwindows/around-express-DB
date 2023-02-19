/* --------------------------------- imports -------------------------------- */
import React, { useEffect } from "react";
import PopupWithForm from "./PopupWithForm";
import { useForm } from "react-hook-form";

/* ------------------------ function EditProfilePopup ----------------------- */

function AddPlacePopup({ onAddPlaceSubmit, isLoading, isOpen, onClose }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  function handleSubmitPost(validatedData, e) {
    onAddPlaceSubmit(validatedData);
  }

  useEffect(() => {
    reset({ name: "", link: "" });
  }, [isOpen]);

  return (
    <PopupWithForm
      name='add-place'
      title='Add Place'
      submitText={isLoading ? "Saving..." : "Create"}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit(handleSubmitPost)}
    >
      <input
        id='js-input-place-name-input'
        className='popup__form-input js-input-type-place-name'
        type='text'
        placeholder='Title'
        {...register("name", {
          required: "Image name is required",
          minLength: {
            value: 2,
            message: "Name must be at least 2 characters",
          },
          maxLength: {
            value: 30,
            message: "Name cannot be more than 30 characters",
          },
        })}
      />
      <span className='popup__input-type-error js-input-place-name-input-error'>
        {errors.name && <p style={{ margin: 0 }}>{errors.name.message}</p>}
      </span>
      <input
        id='js-input-place-url-input'
        className='popup__form-input js-input-type-place-url'
        type='text'
        placeholder='Image url'
        {...register("link", {
          required: "Image url is required",
          pattern: {
            //eslint-disable-next-line
            value: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:\/?#[\]@!\$&'\(\)\*\+,;=.]+/,
            message: "Please enter a valid url",
          },
        })}
      />
      <span className='popup__input-type-error js-input-place-url-input-error'>
        {errors.link && <p style={{ margin: 0 }}>{errors.link.message}</p>}
      </span>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
