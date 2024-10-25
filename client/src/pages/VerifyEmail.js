import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PiUserCircle } from "react-icons/pi";
import axios from "axios";
import toast from 'react-hot-toast';
import Loading from '../components/Loading';

const VerifyEmail = () => {
const navigate = useNavigate()

  const [data, setData] = useState({
    email: ""
  });

  const [loading, setLoading] = useState(false);

  const handleOnChange = (e)=>{
    const {name, value} = e.target

    setData((prev) => {
      return{
        ...prev,
        [name]: value
      }
    })
  };

  const handleSubmitForm = async (e)=>{
    e.preventDefault()
    e.stopPropagation()
    
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/email`

    setLoading(true);
    
    try {
      const response = await axios.post(URL, data) 
      toast.success(response.data.message)

      if(response.data.success){
        setData({
          email: ""
        })
        navigate("/password",{
          state: response?.data?.data
        })
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }finally {
      setLoading(false); 
    }
  };
  return (
    <div className='mt-3'>
    <div className='bg-white w-full max-w-md  mx-auto shadow-md rounded overflow-hidden p-4 '>

      <div className='w-fit mx-auto mb-2'>
        <PiUserCircle 
        size={90}
        />
      </div>

    <h1 className="font-bold text-center text-3xl text-primary" >Welcome to eaglesApp!</h1>
    <p className="font-semibold text-md text-center" >EaglesApp is where you connect with your friends and relatives</p>

    <form className='grid gap-4 py-' onSubmit={handleSubmitForm}>
      <div className='flex flex-col gap-1'>
        <label className='text-[20px]' htmlFor="email">Email:</label>
        <input className="bg-slate-100 px-2 py-2 focus:outline-primary"
        type="email" 
        id="email" 
        name="email"
        placeholder="Enter your email"
        value={data.email}
        onChange={handleOnChange}
        required
         />
      </div>

      <button
            className='bg-primary font-bold text-white text-xl leading-3 tracking-wider mb-5 py-3 px-3 hover:bg-secondary rounded mt-3'
            type="submit"
            disabled={loading} 
          >
            {loading ? <Loading /> : "Let's Continue"}
          </button>
    </form>
    <p className='text-xl mb-3 text-center'>New User?<Link to={"/register"} className='hover:text-secondary font-semibold text-primary hover:underline'>Register</Link></p>
    </div>
</div>
  )
}

export default VerifyEmail
