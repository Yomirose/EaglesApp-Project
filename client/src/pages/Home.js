import axios from 'axios'
import React, { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
// import { useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { logout, setOnlineUser, setSocketConnection, setUser } from '../redux/userSlice';
import Sidebar from '../components/Sidebar';
import logo from "../assets/logo.png";
import io from "socket.io-client";

const Home = () => {
  // const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation()

  // console.log("redux user", user)

  const fetchUserDetails = useCallback(async () => {
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`;
      const response = await axios({
        url: URL,
        withCredentials: true
      });

      dispatch(setUser(response.data.data))

      if (response.data.data.logout) {
        dispatch(logout());
        navigate("/email");
      }
    } catch (error) {
      console.log("error", error);
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  useEffect(() =>{
     const socketConnection = io(process.env.REACT_APP_BACKEND_URL,{
      auth: {
        token: localStorage.getItem("token")
      }
     });

     socketConnection.on("onlinUser",(data)=>{
      console.log(data);
      dispatch(setOnlineUser(data))
     });

     dispatch(setSocketConnection(socketConnection))

     return ()=>{
      socketConnection.disconnect()
     }
  }, [dispatch])


  const basePath = location.pathname === "/"

  return (
    <div className='grid lg:grid-cols-[300px_1fr] h-screen max-h-screen '>
      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <Sidebar />
      </section>
      <section className={`${basePath && "hidden"}`}>
        <Outlet />
      </section>

      <div className={` justify-center items-center flex-col gap-2 hidden ${!basePath ? "hidden" : "lg:flex "}`}>
        <div className='items-center flex '>
          <img className='mb-2' src={logo} alt='logo' width={100} height={50} />
          <h1 className='font-bold mb-22 text-5xl text-primary mr-2'>eaglesApp</h1>
        </div>
        <p className='text-lg mt-2 text-center text-slate-500 font-semibold'>Select user to send message</p>
      </div>
    </div>
  )
}

export default Home;
