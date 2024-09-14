import React from 'react';
import  "./comment.css";
import { useEffect } from 'react'
import { useState } from 'react'
import { format } from 'timeago.js'
import { request } from '../../util/request'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import image from "../../assets/image.jpg";

const Comment = ({comment}) => {
  const { user, token } = useSelector((state) => state.auth)
  const [commentAuthor, setCommentAuthor] = useState("")
  const [isLiked, setIsLiked] = useState(comment.likes.includes(user._id))


  useEffect(() => {
    const fetchCommentAuthor = async () => {
        try {
            const data = await request(`/user/find/${comment.userId}`, 'GET')
            setCommentAuthor(data)
        } catch (error) {
            console.error(error)
        }
    }
    fetchCommentAuthor()
}, [comment.userId])

const handleLikeComment = async () => {

    try {
        const headers = {'Authorization': `Bearer ${token}`}

        await request(`/comment/toggleLike/${comment._id}`, 'PUT', headers)
        
        setIsLiked(prev => !prev)
    } catch (error) {
      console.error(error)
    }
}

  return (
    <div className="comment">
            <div className="commentLeft">
                <img src={image} alt='' className="commentImg" />
                <div className="commentDetails">
                    <h4>{commentAuthor?.username}</h4>
                    <span>{format(comment.createdAt)}</span>
                </div>
                <div className="commentText">{comment.text}</div>
            </div>
            {isLiked ? <AiFillHeart onClick={handleLikeComment}/> : <AiOutlineHeart onClick={handleLikeComment}/>}
        </div>
  )
}

export default Comment