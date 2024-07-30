// src/pages/PostDetail.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import styles from '../styles/postDetail.module.css'; // Add your CSS module if needed
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { FaReply } from "react-icons/fa";
import { AiFillLike } from "react-icons/ai";
import { GET_POST } from '../utils/queries'; // Import the query for fetching a specific post
import { CREATE_COMMENT } from '../utils/mutations'; // Import your comment mutationimport styles from '../styles/postDetail.module.css';
import { formatDistanceToNow } from 'date-fns';
import Auth from '../utils/auth'; // Adjust the path based on your project structure

const PostDetail = () => {
  const { postId } = useParams();
  const { loading, error, data } = useQuery(GET_POST, {
    variables: { id: postId },
  });
  const [createComment] = useMutation(CREATE_COMMENT, {
    refetchQueries: [{ query: GET_POST, variables: { id: postId } }],
    onError: (error) => {
      console.error('Error submitting comment:', error);
      setCommentError('Error submitting comment');
    },
    onCompleted: () => {
      setContent('');
      setCommentError(null);
    },
  });
  let username = '';
  if (Auth.loggedIn() === true) {
    const user = Auth.getProfile();
    username = user.data.username;
  }
  const [content, setContent] = useState('');
  const [commentError, setCommentError] = useState(null);

  const formatDate = (timestamp) => {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleString();
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await createComment({
        variables: {
          postId,
          creatorName: username,
          content,
        },
      });
    } catch (error) {
      console.error('Error submitting comment:', error);
      setCommentError('Error submitting comment');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const post = data.post;

  return (
    <div>
      <Header/>
      <div className={styles.layout}>
        <Sidebar/>
    <div className={styles.post}>
      <div className={styles.postDetail}>
      <h2>{post.creatorName}'s Post</h2>
      <p className={styles.postContent}>{post.content}</p>
      <p className={styles.postDate}>Created {formatDistanceToNow(new Date(parseInt(post.createdAt)))} ago</p>
      </div>
      <div className={styles.comments}>
        <h3>Comments:</h3>
        <form onSubmit={handleCommentSubmit} className={styles.textAreaContainer}>
          <textarea
            placeholder="Leave A Comment"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            id={styles.input}
          ></textarea>
          <div className={styles.buttonContainer}>
            <button className={styles.button} type="submit">
              Post
            </button>
          </div>
          {commentError && <p className={styles.error}>{commentError}</p>}
        </form>
        {post.comments.map((comment) => (
          <div key={comment.id} className={styles.comment}>
            <h3 className={styles.creatorName}>{comment.creatorName}</h3>
            <p>{comment.content}</p>
            <div className={styles.btns}>
            <button className={styles.replybtn}><FaReply /></button>
            <p className={styles.commentLength}>{comment.replies.length}</p>
            <button className={styles.replybtn}><AiFillLike /></button>
            <p className={styles.likeCount}>{comment.likes.length}</p>

            </div>
            {comment.replies.length > 0 && (
              <div className={styles.replies}>
                {comment.replies.map((reply) => (
                  <div key={reply.id} className={styles.reply}>
                    <p>
                      <strong>{reply.creatorName}</strong>: {reply.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
    </div>
    </div>

  );
};

export default PostDetail;
