import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Avatar from './Avatar';
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa6";


const MessagePage = () => {
  const params = useParams()
  const socketConnection = useSelector(state => state?.user?.socketConnection)
  const currentUser = useSelector(state => state?.user)
  const [userData, setUserData] = useState({
    _id: "",
    name: "",
    email: "",
    profile_pic: "",
    online: false
  })


  useEffect(()=>{
    if(socketConnection){
      socketConnection.emit("message-page", params.userId);

      socketConnection.on("message-user", (data)=>{
        setUserData(data)
      })
    }
  },[socketConnection, params?.userId, currentUser])
  return (
    <div className='min-h-screen'>
      <header className='fixed top-0 lg:w-[80%] w-full h-16 bg-white shadow-md z-10 flex justify-between items-center px-4'>
        <div className='flex items-center gap-4  '>
          <Link to={"/"} className='lg:hidden'>
            <FaAngleLeft size={30}/>
          </Link>
          <div>
            <Avatar 
              width={50}
              height={50}
              imageUrl={userData?.profile_pic}
              name={userData?.name}
              userId={userData?._id}
            />
          </div>

          <div>
            <h2 className='font-semibold text-lg my-0 text-ellipsis line-clamp-1'>{userData?.name}</h2>
            <p className='-my-2 text-sm'>
              {
                userData.online? <span className='text-primary'>online</span> : <span className='text-slate-600'>offline</span>
              }
            </p>
          </div>
        </div>

        <div className=''>
          <button className='text-2xl text-gray-700 pr-4 cursor-pointer hover:text-secondary'>
            <HiDotsVertical />
          </button>
        </div>
      </header>
    </div>
  )
}

export default MessagePage