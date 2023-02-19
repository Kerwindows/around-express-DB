import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register = ({ registerRequest }) => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const email = credentials.email;
    const password = credentials.password;
    if (!email || !password) {
      return;
    }
    registerRequest(password, email);
    setCredentials({
      email: "",
      password: "",
    });
  };

  return (
    <div className='register'>
      <h2 className='register__title'> Sign up</h2>
      <form onSubmit={handleSubmit} name='Form'>
        <input
          className='register__email'
          type='email'
          name='email'
          placeholder='Email'
          onChange={handleChange}
          value={credentials.email}
          autoComplete='on'
        />
        <input
          className='register__password'
          type='password'
          name='password'
          placeholder='Password'
          onChange={handleChange}
          value={credentials.password}
          autoComplete='on'
        />
        <button className='register__button' type='submit'>
          Sign up
        </button>
      </form>

      <p className='register__signup'>
        Already a member?{" "}
        <Link to='signin' className='register__signup-link'>
          Log in here!
        </Link>
      </p>
    </div>
  );
};

export default Register;
