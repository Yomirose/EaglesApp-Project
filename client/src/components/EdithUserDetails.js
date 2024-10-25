import React, { useEffect, useRef, useState } from 'react';
import Avatar from './Avatar';
import uploadFile from '../helpers/uploadFile';
import Divider from './Divider';
import axios from 'axios';
import toast from "react-hot-toast";
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';

const EdithUserDetails = ({onClose, user}) => {
    const [data, setData] = useState({
        name: user?.user,
        profile_pic: user?.profile_pic

    });
    const uploadPhotoRef = useRef();
    const dispatch = useDispatch()

    useEffect(() =>{
        setData((prev) =>{
            return{
                ...prev,
                ...user
            }
        })
    }, [user])

    const handleOnChange = (e) =>{
        const {name, value} = e.target

        setData((prev) =>{
            return{
                ...prev,
                [name] : value
            }
        })
    };

    const handleOpenUploadPic = (e) =>{
        e.preventDefault();
        e.stopPropagation();
        uploadPhotoRef.current.click()
    };

    const handleUpLoadPic = async (e) => {
        const file = e.target.files[0]

        const uploadPhoto = await uploadFile(file)
    
        setData((prev) =>{
          return{
            ...prev,
            profile_pic: uploadPhoto?.url
          }
        })
    };

   
    const handleSubmitForm = async (e) => {
        e.preventDefault();
        e.stopPropagation();
     
        try {
            const URL = `${https://eaglesapp-backend.onrender.com}/api/update-user`;
            
            const payload = {
                name: data.name,
                profile_pic: data.profile_pic,
            };
     
            const response = await axios.post(URL, payload, { withCredentials: true });
            toast.success(response?.data?.message);
            
            if (response.data.success) {
                dispatch(setUser(response.data.data));
                onClose();
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || error.message || "An error occurred");
        }
     };
     

  return (
    <div className='fixed top-0 bottom-0 right-0 left-0 bg-slate-600 bg-opacity-40 flex justify-center items-center z-20'>
        <div className='bg-white p-4  py-6 m-1 rounded w-full max-w-sm'>
            <h2 className='font-bold'>Profile Details</h2>
            <p className='text-sm' >Edit user details</p>

            <form className='grid gap-3 mt-3' onSubmit={handleSubmitForm}>
                <div className='flex flex-col gap-1'>
                    <label htmlFor='name'>Name:</label>
                    <input className='w-full py-1 px-2 focus:outline-primary border'
                        type='text'
                        name='name' 
                        id='name'
                        value={data.name}
                        onChange={handleOnChange}
                    />
                </div>

                <div>
                    <div>Photo:</div>
                    <div className='my-1 flex items-center gap-2'>
                        <Avatar 
                            width={40}
                            height={40}
                            imageUrl={data?.profile_pic}
                            name={data?.name}
                        />
                        <label htmlFor='profile_pic'>
                        <button 
                            type="button"
                            onClick={handleOpenUploadPic}
                            className='font-semibold'>
                            Change Photo
                        </button>
                        <input 
                            type='file'
                            id='profile_pic'
                            className='hidden'
                            onChange={handleUpLoadPic}
                            ref={uploadPhotoRef}
                        />
                        </label>
                    </div>
                </div>

                <Divider />
                <div className='flex gap-2 w-fit ml-auto '>
                    <button onClick={onClose} className='hover:bg-primary hover:text-white border-primary text-primary border px-4 py-1 rounded'>Cancel</button>
                    <button onClick={handleSubmitForm} className=' hover:bg-secondary hover:text-white rounded border-primary bg-primary text-white border px-4 py-1'>Save</button>
                </div>
            </form>
        </div>
    </div>
  )
}
export default React.memo(EdithUserDetails);
