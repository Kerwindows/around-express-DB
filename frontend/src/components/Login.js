import React, { useState } from "react";
import { Link } from "react-router-dom";

const Login = ({ loginRequest }) => {
  const [loginCredentialCheck, setLoginCredentialCheck] = useState("");
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
      setLoginCredentialCheck("All fields are required");
      return;
    }
    loginRequest(email, password);
    setLoginCredentialCheck("");
    setCredentials({
      email: "",
      password: "",
    });
  };

  return (
    <div className='login'>
      <h2 className='login__title'> Log in</h2>
      <form onSubmit={handleSubmit}>
        <p className='login__error'>{loginCredentialCheck}</p>
        <input
          className='login__email'
          type='email'
          name='email'
          placeholder='Email'
          autoComplete='on'
          onChange={handleChange}
          value={credentials.email}
        />
        <input
          className='login__password'
          type='password'
          name='password'
          placeholder='Password'
          autoComplete='on'
          onChange={handleChange}
          value={credentials.password}
        />
        <button className='login__button' type='submit'>
          Log in
        </button>
      </form>

      <p className='login__signin'>
        Not a member yet?{" "}
        <Link to='signup' className='login__signin-link'>
          Sign up here!
        </Link>
      </p>
    </div>
  );
};

export default Login;
