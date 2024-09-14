import React from 'react';
import "./auth.css";
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { request } from "../../util/request";
import { useDispatch } from 'react-redux';
import { register, login } from '../../redux/authSlice';



const Auth = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const headers = { "Content-Type" : "application/json" }

    try {
      if (isRegister) {
        if(username === "" || email === "" || password === ""){
          setError("Fill all fields")
          setTimeout(() => {
            setError(false)
          }, 2500)
          return;
        }
        const body = {username, email, password}
        const data = await request("/auth/register", "POST", headers, body);
        dispatch(register(data));
        navigate("/");
      } else {
        if(email === "" || password === ""){
          setError("Fill all fields!")
          setTimeout(() => {
            setError(false)
          }, 2500)
          return;
        }

        const body = {
          email,
          password
        }

        const data = await request("/auth/login", "POST", headers, body)
        dispatch(login(data))
        navigate("/");
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleAuthInput = (e) => {
    setUsername(e.target.value);
    setEmail(e.target.value);
    setPassword(e.target.value);
  }

  return (
    <div className='auth_container'>
      <div className='auth_wrapper'>
        <form onSubmit={handleSubmitForm} className='auth_left'>
        <div className='auth_right'>
          <h1>EaglesApp</h1>
          <p>Connect with your friends and relatives</p>
        </div>
          {isRegister && <input type='text' placeholder='Enter username...' onChange={handleAuthInput} />}
          <input type='email' placeholder='Enter your email ' onChange={handleAuthInput} />
          <input type='password' placeholder='Enter your password' onChange={handleAuthInput} />
          <button className='submit_btn'>
            { isRegister ? "Register" : "login" }
          </button>
          {isRegister 
          ? <p className='login' onClick={() => setIsRegister(prev => !prev)}>Already have an account? </p> 
          : <p className='register' onClick={() => setIsRegister(prev => !prev)}>Don't have account? <Link>Register</Link></p> }
        </form>
        {error && (
                <div className="error">
                    {error}
                </div>
            )}
      </div>
    </div>
  )
}
export default Auth