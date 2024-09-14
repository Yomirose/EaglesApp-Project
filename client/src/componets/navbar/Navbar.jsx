import React from 'react';
import "./navbar.css";
import { AiOutlineSearch } from 'react-icons/ai';
import { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import person from "../../assets/image.jpg";
import {FacebookShareButton, TwitterShareButton, WhatsappShareButton, LinkedinShareButton, FacebookIcon,
  TwitterIcon, WhatsappIcon, LinkedinIcon } from "react-share";



const Navbar = () => {
  const shareUrl = "http://localhost:5000";
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate;

  const toggleModal = () => {
    setShowModal(pre => !pre)
  };

const handleLogout = () => {
  localStorage.clear();
  navigate("/auth");
};

  return (
    <div className='container'>
      <div className='navbar'>
        <div className='left'>
          <Link to="/" >
            <h2>EaglesApp</h2>
          </Link>
        </div>
        <div className='socialShare'>
        <div className='facebook_icon'>
        <FacebookShareButton url={shareUrl} >
        <FacebookIcon size={32} round={true} />
      </FacebookShareButton>
        </div>
      <div className='twitter_icon'>
      <TwitterShareButton url={shareUrl} >
        <TwitterIcon size={32} round={true} />
      </TwitterShareButton>
      </div>
      <div className='whatapp_icon'>
      <WhatsappShareButton url={shareUrl} >
        <WhatsappIcon size={32} round={true} />
      </WhatsappShareButton>
      </div>
      <div className='linkedin_icon'>
      <LinkedinShareButton url={shareUrl}>
        <LinkedinIcon size={32} round={true} />
      </LinkedinShareButton>
      </div>
        </div>
        <div className='right'>
          <form className='searchForm'>
            
            <input type='text' placeholder='Search profile...' />
            <AiOutlineSearch className="searchIcon" />
          </form>
          <img src={person} className='personImg' onClick={toggleModal} alt='' />
          {showModal && (
            <div className='modal'>
              <span onClick={handleLogout} className='logout'>logout</span>
              <Link to="/" className='updateProfile'>Update Profile</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar