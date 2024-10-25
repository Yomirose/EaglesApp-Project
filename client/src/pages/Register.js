import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/uploadFile';
import axios from "axios";
import toast from 'react-hot-toast';

const Register = () => {
const [uploadPic, setUploadPic] = useState("");
const navigate = useNavigate()

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: ""
  });

  const handleOnChange = (e)=>{
    const {name, value} = e.target

    setData((prev) => {
      return{
        ...prev,
        [name]: value
      }
    })
  };

  const handleUploadPic = async (e)=>{
    const file = e.target.files[0]

    const uploadPhoto = await uploadFile(file)

    setUploadPic(file)

    setData((prev) =>{
      return{
        ...prev,
        profile_pic: uploadPhoto?.url
      }
    })
  };

  const handleClearPic = (e)=>{
    e.preventDefault()
    e.stopPropagation()
    setUploadPic(null)
  };

  const handleSubmitForm = async (e)=>{
    e.preventDefault()
    e.stopPropagation()
    
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/register`
    try {
      const response = await axios.post(URL, data)
      toast.success(response.data.msg)

      if(response.data.success){
        setData({
          name: "",
          email: "",
          password: "",
          profile_pic: ""
        })
        navigate("/email")
      }
    } catch (error) {
      toast.error(error?.response?.data?.msg)
    }
  };

  return (
    <div className='mt-3'>
        <div className='bg-white w-full max-w-md  mx-auto shadow-md rounded overflow-hidden p-4 '>
        <h1 className="font-bold text-center text-3xl text-primary" >Welcome to eaglesApp!</h1>
        <p className="font-semibold text-md text-center" >EaglesApp is where you connect with your friends and relatives</p>

        <form className='grid gap-4 py-' onSubmit={handleSubmitForm}>
          <div className='flex flex-col gap-1'>
            <label className='text-[20px]' htmlFor="name">Name:</label>
            <input className="bg-slate-100 px-2 py-2 focus:outline-primary"
            type="text" 
            id="name" 
            name="name"
            placeholder="Enter your name"
            value={data.name}
            onChange={handleOnChange}
            required
             />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-[20px]' htmlFor="name">Email:</label>
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

          <div className='flex flex-col gap-1'>
            <label className='text-[20px]' htmlFor="name">Password:</label>
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

          <div className='flex flex-col gap-1'>
            <label className='text-[20px]' htmlFor="profile_pic">Photo:
              <div className='h-14 bg-slate-200 flex justify-center items-center cursor-pointer border rounded hover:border-primary'>
                <p className='text-sm max-w-[300px text-ellipsis line-clamp-1]'>
                  {
                    uploadPic?.name ? uploadPic?.name : "Upload profile photo"
                  }
                  </p>
                  {
                    uploadPic?.name && (
                      <button className='text-lg ml-3 hover:text-red-600' onClick={handleClearPic}>
                        <IoClose />
                      </button>
                    )
                  }  
              </div>
            </label>

            <input className="bg-slate-100 py-3 px-3 focus:outline-primary hidden"
            type="file" 
            id="profile_pic" 
            name="profile_pic"
            onChange={handleUploadPic}
             />
          </div>
          <button className='bg-primary font-bold text-white text-xl leading-3 tracking-wider mb-5 py-3 px-3 hover:bg-secondary rounded mt-3'>
            Register
            </button>
        </form>
        <p className='text-xl mb-3 text-center'>Already have account?<Link to={"/email"} className='hover:text-secondary font-semibold text-primary hover:underline'>Login</Link></p>
        </div>
    </div>
  )
};

export default Register;