/* --------------------------------- imports -------------------------------- */
import React, { useEffect, useRef } from "react";
import PopupWithForm from "./PopupWithForm";
import { useForm } from "react-hook-form";

/* ------------------------ function EditProfilePopup ----------------------- */

function EditAvatarPopup({ onUpdateAvatar, isLoading, isOpen, onClose }) {
  const avatarRef = useRef(null);

  function handleSubmitPost(validatedData, e) {
    onUpdateAvatar(validatedData);
  }

  useEffect(() => {
    reset({ avatar: "" });
  }, [isOpen]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  return (
    <PopupWithForm
      name='edit-profile-pic'
      title='Change profile picture'
      submitText={isLoading ? "Saving..." : "Save"}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit(handleSubmitPost)}
    >
      <input
        ref={avatarRef}
        id='js-input-edit-profile-pic-input'
        className='popup__form-input js-input-type-edit-profile-pic'
        type='text'
        placeholder='Image url Link'
        {...register("avatar", {
          required: "Image url is required",
          pattern: {
            //eslint-disable-next-line
            value: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:\/?#[\]@!\$&'\(\)\*\+,;=.]+/,
            message: "Please enter a valid url",
          },
        })}
      />
      <span className='popup__input-type-error js-input-place-url-input-error'>
        {errors.avatar && <p style={{ margin: 0 }}>{errors.avatar.message}</p>}
      </span>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
