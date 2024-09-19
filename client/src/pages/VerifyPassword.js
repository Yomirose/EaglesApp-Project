import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { PiUserCircle } from "react-icons/pi";
import axios from "axios";
import toast from 'react-hot-toast';
import Avatar from '../componets/Avatar';
import { useDispatch } from "react-redux";
import { setUser } from '../redux/userSlice';

const VerifyPassword = () => {
  const [data, setData] = useState({ password: ""});
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

console.log("location", location.state )

useEffect(()=>{
  if(!location?.state?.name){
    navigate("/email")
  }
})
  
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
    
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/password`;

    try {
      const response = await axios({
        method: "post",
        url: URL,
      data: {
        userId: location?.state?._id,
        password: data.password
      },
      withCredentials: true
      })
      toast.success(response.data.message)

      if(response.data.success){
        dispatch(setUser)
      }

      if(response.data.success){
        setData({
          password: ""
        })
        navigate("/")
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  };
  return (
    <div className='mt-3'>
    <div className='bg-white w-full max-w-md  mx-auto shadow-md rounded overflow-hidden p-4 '>

      <div className='w-fit mx-auto mb-2 flex justify-center items-center flex-col'>
        {/* <PiUserCircle 
        size={90}
        /> */}
        <Avatar
          width={70}
          height={70}
          name={location?.state?.name}
          imageUrl={location?.state?.profile_pic}
        />
        <h2 className='font-semibold mt-1 text-lg'>{location?.state?.name}</h2>
      </div>

    <h1 className="font-bold text-center text-3xl text-primary" >Welcome to eaglesApp!</h1>
    <p className="font-semibold text-md text-center" >EaglesApp is where you connect with your friends and relatives</p>

    <form className='grid gap-4 py-' onSubmit={handleSubmitForm}>
      <div className='flex flex-col gap-1'>
        <label className='text-[20px]' htmlFor="password">Password:</label>
        <input className="bg-slate-100 px-2 py-2 focus:outline-primary"
        type="password" 
        id="password" 
        name="password"
        placeholder="Enter your password"
        value={data.password}
        onChange={handleOnChange}
        required
         />
      </div>

      <button className='bg-primary font-bold text-white text-xl leading-3 tracking-wider mb-5 py-3 px-3 hover:bg-secondary rounded mt-3'>
        Login
        </button>
    </form>
    <p className='text-xl mb-3 text-center'><Link to={"/forgot-password"} className='hover:text-primary font-semibold text-black hover:underline'>Forgot password ?</Link></p>
    </div>
</div>
  )
}

export default VerifyPassword

