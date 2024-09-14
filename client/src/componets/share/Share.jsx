import React, { useState } from 'react';
import "./share.css";
import {useSelector} from "react-redux";
import image from "../../assets/image.jpg";
import {AiFillCamera, AiFillSmile, AiOutlineClose} from "react-icons/ai";
import {IoMdPhotos} from "react-icons/io";
import { request } from "../../util/request";


const Share = () => {
  const [desc, setDesc] = useState("");
  const [photo, setPhoto] = useState("");
  const {token} = useSelector((state) => state.auth);

  const handleInputShare = (e) => {
    setDesc(e.target.value);
  };

  const handleCreatePost = async() => {
    try {
      let filename = null

      if(photo){
        const formData = new FormData();
        filename = crypto.randomUUID() + photo.name
        formData.append("imageUrl", filename)
        formData.append("photo", photo)
        await request("/upload", "POST", {}, formData, true);
      } else {
        return
      };

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }

      const body = {
        imageUrl: filename,
        desc
      }

      await request('/post', 'POST', headers, body)
      window.location.reload()

    } catch (error) {
      console.error(error)
    }
  };

  return (
    <div className='share'>
      <div className='shareTop'>
        <img src={image} alt='' />
        <input type='text' placeholder='Share your opinion here' onChange={handleInputShare}/>
        <button className='btn' onClick={handleCreatePost}>POST</button>
      </div>
      <div className='sharebottom'>
        <div className="share_item">
          Live Video 
          <AiFillCamera />
        </div>
        <label htmlFor='photo' className="shareitem">
          Photo
          <IoMdPhotos />
        </label>
        <div className="share_item">
          Activity
          <AiFillSmile />
        </div>
        <input style={{ display: 'none' }} type="file" id="photo" onChange={(e) => setPhoto(e.target.files[0])} />
      </div>
      {photo && (
          <div className="share_container">
            <AiOutlineClose  className='closeIcon' onClick={() => setPhoto("")}/>
              <img src={URL.createObjectURL(photo)} alt='' className='photo' />
          </div>
        )}
    </div>
  )
}

export default Share