import React, { useEffect, useState } from 'react';
import Share from "../share/Share";
import "./posts.css";
import { useSelector } from 'react-redux';
import { request } from '../../util/request';
import Post from "../post/Post";



const Posts = () => {
  const [posts, setPosts] = useState([]);
  const {token} = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchTimelinePosts = async() => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        }
        const data = await request("/post/timelinePosts", "GET", headers);
        setPosts(data);
      } catch (error) {
        console.error(error)
      }
    }
    fetchTimelinePosts();
  }, [token]);

  return (
    <div className='post_container'>
      <div className='post_wrapper'>
        <Share />
        <div className='posts'>
          {posts?.map((post) => (
            <Post  post={post} key={post._id} />
          ))}
        </div>
      </div>
    </div>
  )
};

export default Posts;