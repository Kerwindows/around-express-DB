import React from "react";

const Logout = (props) => {
  const logout = () => {
    props.handleLogout();
    props.setUserEmail("");
  };

  return (
    <div className='header__button' onClick={logout}>
      {"Logout"}
    </div>
  );
};

export default Logout;
