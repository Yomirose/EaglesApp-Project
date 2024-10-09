import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Avatar from './Avatar';
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import uploadFile from '../helpers/uploadFile';
import { IoClose } from "react-icons/io5";
import "../App.css";
import Loading from './Loading';
import backgroundImage from "../assets/background.webp";
import { IoMdSend } from "react-icons/io";
import moment from "moment"


const MessagePage = () => {
  const params = useParams();
  const socketConnection = useSelector(state => state?.user?.socketConnection);
  const user = useSelector(state => state?.user);
  const [userData, setUserData] = useState({
    _id: "",
    name: "",
    email: "",
    profile_pic: "",
    online: false
  });

  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: ""
  });

  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMessage] = useState([]);
  const currentMessage = useRef(null);

  useEffect(()=>{
    if(currentMessage.current){
      currentMessage.current.scrollIntoView({behavior : "smooth", block : "end"})
    }
  },[allMessage])

  const handleOpenImageVideoUpload = () => {
    setOpenImageVideoUpload(preve => !preve)
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setOpenImageVideoUpload(false);

    setMessage(preve => {
      return{
        ...preve,
        imageUrl: uploadPhoto.url
      }
    }) 
  };

  const handleClearUploadImage = () => {
    setMessage(preve => {
      return{
        ...preve,
        imageUrl: ""
      }
    })
  }

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setOpenImageVideoUpload(false);

    setMessage(preve => {
      return{
        ...preve,
        videoUrl: uploadPhoto.url
      }
    })
  }

  const handleClearUploadVideo = () => {
    setMessage(preve => {
      return{
        ...preve,
        videoUrl: ""
      }
    })
  }

  useEffect(()=>{
    if(socketConnection){
      socketConnection.emit("message-page", params.userId);

      socketConnection.emit("seen",params.userId )

      socketConnection.on("message-user", (data)=>{

        setUserData(data)
      });
      socketConnection.on("message", (data)=>{
        
        setAllMessage(data)
      })
    }
  },[socketConnection, params?.userId, user])

  const handleOnchangeText = (e) => {
    const {value} = e.target
    setMessage(preve => {
      return{
        ...preve,
        text: value
      }
    })
  };

  const handleSendMessage = (e) => {
    e.preventDefault()
    if(message.text || message.imageUrl || message.videoUrl){
      if(socketConnection){

        socketConnection.emit("new message", {
          sender: user?._id,
          receiver: params.userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          msgByUserId: user?._id
        })
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: ""
        })
      }
    }
  }

  return (
    <div style={{backgroundImage: `url(${backgroundImage})`}} className='bg-no-repeat bg-cover '>
      <header className='sticky top-0 h-16 bg-white shadow-md z-10 flex justify-between items-center px-4'>
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
        <div >
          <button className='text-2xl text-gray-700 cursor-pointer hover:text-secondary'>
            <HiDotsVertical />
          </button>
        </div>
      </header>

      <section className=' overflow-x-hidden overflow-y-scroll h-[calc(100vh-128px)] scrollbar relative bg-slate-200 bg-opacity-55'>

        {/* show all messages here */}
        <div className='flex flex-col space-y-2 p-4' ref={currentMessage}>
          {
            allMessage.map((msg,index)=>{

              return(
                <div key={index} className={`p-1 py-2 my-2 rounded shadow-lg w-fit max-w-md  ${user._id === msg.msgByUserId._id ? "ml-auto bg-teal-100" : "bg-white"}`}>
                  
                 <div className='w-full'>
                    {
                      msg.imageUrl && (
                        <img 
                          src={msg?.imageUrl} 
                          alt=''
                          className='w-full h-full object-scale-down'
                        />
                      )
                    }

                    {
                      msg.videoUrl && (
                        <video
                          src={msg?.videoUrl} 
                          controls
                          muted
                          autoPlay
                          className='w-full h-full object-scale-down'
                        />
                      )
                    }  
                  </div>

                  <p className='px-3 font-semibold text-x1'>{msg.text}</p>
                  <p className='ml-auto w-fit text-gray-700'>{moment(msg.createdAt).format("hh:mm")}</p>
                </div>
              )
            })
          }
        </div>

        {/* display Images */}
        {
          message.imageUrl && (
            <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
              <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-white' onClick={handleClearUploadImage}>
                <IoClose size={30} />
              </div>
              <div className='bg-white p-3'>
                  <img  src={message.imageUrl} 
                    alt='uploadImage'
                    className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                  />
              </div>
            </div>
          )
        }

    {/* display Videos */}
        {
          message.videoUrl && (
            <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
              <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-white' onClick={handleClearUploadVideo}>
                <IoClose size={30} />
              </div>
              <div className='bg-white p-3'>
                  <video  src={message.videoUrl} 
                    className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                    controls
                    muted
                    autoPlay
                  />
              </div>
            </div>
          )
        };

        {
          loading && (
            <div className='w-full h-full sticky bottom-0 flex justify-center items-center'>
              <Loading />
            </div>
          )
        }
      </section>

      <section className='h-16 bg-white flex items-center'>
        <div className='relative'>
          <button onClick={handleOpenImageVideoUpload} className='flex justify-center items-center w-12 h-12 rounded-full hover:bg-primary hover:text-white'>
            <FaPlus size={20} />
          </button>

          {
            openImageVideoUpload && (
            <div className='bg-white shadow-md rounded absolute bottom-14 w-36 p-2 ml-3'>
              <form>
                <label htmlFor='uploadImage' className='flex items-center p-2 gap-3 hover:bg-gray-300 cursor-pointer px-4'>
                  <div className='text-primary'>
                    <FaImage size={18} />
                  </div>
                  <p>Image</p>
                </label>

                <label htmlFor='uploadVideo' className='flex items-center p-2 gap-3 hover:bg-gray-300 cursor-pointer px-4'>
                  <div className='text-purple-900'>
                    <FaVideo size={18} />
                  </div>
                  <p>Video</p>
                </label>

                <input 
                  type='file'
                  id='uploadImage'
                  onChange={handleUploadImage}
                  className='hidden'
                />

                <input 
                  type='file'
                  id='uploadVideo'
                  onChange={handleUploadVideo}
                  className='hidden'
                />
              </form>
            </div>
            )
          }
          
        </div>

        <form className=' h-full w-full flex gap-2' onSubmit={handleSendMessage}>
            <input
            type='text'
            placeholder='Type your message here...' 
            className='py-1 px-4 outline-none w-full h-full'
            value={message.text}
            onChange={handleOnchangeText}
            />
            <button className='text-primary hover:text-secondary'>
              <IoMdSend size={30} />
            </button>
        </form>
      </section>

    </div>
  )
}

export default MessagePage