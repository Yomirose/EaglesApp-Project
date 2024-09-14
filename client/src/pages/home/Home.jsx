import React from 'react';
import Navbar from "../../componets/navbar/Navbar";
import Sidebar from "../../componets/sidebar/Sidebar";
import Posts from "../../componets/posts/Posts";
import Friends from "../../componets/friends/Friends"
import  "./home.css";

const Home = () => {
  return (
    <div className="container">
      <div className="wrapper">
        <Navbar /> 
        <main className='main'>
          <Sidebar />
          <Posts />
          <Friends />
        </main>
      </div>
    </div>
  )
}

export default Home