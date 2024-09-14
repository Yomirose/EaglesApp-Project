import React, { useState } from 'react';
import "./post.css";
import image from "../../assets/image.jpg";
import { Link } from 'react-router-dom';
import {format} from "timeago.js/lib/index";
import { AiFillLike, AiOutlineComment, AiOutlineLike } from 'react-icons/ai'
import { IoMdSettings, IoMdShareAlt } from 'react-icons/io';
import { useEffect } from 'react';
import { request } from '../../util/request';
import { useSelector } from 'react-redux';
import Comment from '../comment/Comment';





const Post = ({ post }) => {
  const { user, token } = useSelector((state) => state.auth);
  const [authorDetails, setAuthorDetails] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [isLiked, setIsLiked] = useState(post?.likes?.includes(user._id));
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await request(`/user/find/${post.userId}`, 'GET');
        setAuthorDetails(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchDetails();
  }, [post.userId]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await request(`/comment/${post._id}`, 'GET');
        console.log(data);
        setComments(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchComments();
  }, [post._id]);

  const handleDeletePost = async() => {
    try {
      const headers = {
        'Authorization': `Bearer ${token}`
      }

      await request('/post/deletePost/' + post._id, 'DELETE', headers)
      window.location.reload()
    } catch (error) {
      console.error(error)
    }
  };

  const handleLike = async () => {
    const headers = {
      'Authorization': `Bearer ${token}`
    }
    try {
      await request(`/post/likePost/${post._id}`, "PUT", headers)
      setIsLiked(prev => !prev)
    } catch (error) {
      console.error(error)
    }
  };

  const handleComment = async (e) => {
    e.preventDefault()

    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
      const data = await request('/comment', 'POST', headers, { text: commentText, postId: post._id })
      console.log(data)
      setComments(prev => {
        if (prev.length === 0) return [data]
        return [data, ...prev]
      })

      setCommentText("")
    } catch (error) {
      console.error(error)
    }
  }


  const handleDislike = async () => {
    const headers = {
      'Authorization': `Bearer ${token}`
    }
    try {
      await request(`/post/dislikePost/${post?._id}`, "PUT", headers)
      setIsLiked(prev => !prev)
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='post'>
      <div className="post_top">
        <Link to={`/profile/${authorDetails?._id}`} className="topLeft">
        <img  src={image} alt='' className='postAuthImage'/>
        <div className="postDetails">
          <span>{authorDetails?.username}</span>
          <span className='data'>{format(post?.createdAt)}</span>
        </div>
        </Link>
        {user._id === post?.userId && <IoMdSettings onClick={() => setShowDeleteModal(prev => !prev)}/>}
        {showDeleteModal && (
          <span className="deleteModal" onClick={handleDeletePost}>
             Delete post
          </span>
        )}
      </div>
      <p className="desc">{post?.desc}</p>
      <div className="postImgContainer">
        <img src={`http://localhost:5000/images/${post.imageUrl}`} alt="" className="postImg" />
      </div>
      <div className="actions">
      {
          !isLiked &&
          <span className="action" onClick={handleLike}>
            Like <AiOutlineLike />
          </span>
        }
        {isLiked &&
          <span className="action" onClick={handleDislike}>
            Liked <AiFillLike />
          </span>
        }
        <span className="action" onClick={() => setShowComments(prev => !prev)}>
          Comment <AiOutlineComment />
        </span>
        <span className="action">
          Share <IoMdShareAlt />
        </span>
      </div>
      {showComments && (
        <>
        <div className="comments">
          {comments?.length > 0 ? (
            comments?.map((comment) => (
              <Comment comment={comment} key={comment._id} />
            ))
          ) : <p>No comments yet</p>}
        </div>
        <form className="commentSection" onSubmit={handleComment}>
            <textarea value={commentText} type="text" placeholder='Type comment...' onChange={(e) => setCommentText(e.target.value)} />
            <button type="submit">Post</button>
          </form>
        </> 
      )}
    </div>
  )
};

export default Post;