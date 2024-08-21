import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import styles from '../styles/postDetail.module.css';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { FaReply } from 'react-icons/fa';
import { AiFillLike } from 'react-icons/ai';
import { GET_POST, GET_COMMENT_REPLIES } from '../utils/queries';
import { CREATE_COMMENT, LIKE_COMMENT, LIKE_REPLY } from '../utils/mutations';
import { formatDistanceToNow } from 'date-fns';
import Auth from '../utils/auth';

const PostDetail = () => {
  const { postId } = useParams();
  const { loading, error, data } = useQuery(GET_POST, { variables: { id: postId } });

  const [createComment] = useMutation(CREATE_COMMENT, {
    refetchQueries: [{ query: GET_POST, variables: { id: postId } }],
    onError: (error) => console.error('Error submitting comment:', error),
  });

  const [likeComment] = useMutation(LIKE_COMMENT, {
    refetchQueries: [{ query: GET_POST, variables: { id: postId } }],
    onError: (error) => console.error('Error liking comment:', error),
  });

  const [fetchReplies, { loading: repliesLoading }] = useLazyQuery(GET_COMMENT_REPLIES, {
    onError: (error) => console.error('Error fetching replies:', error),
  });
  const [likeReply] = useMutation(LIKE_REPLY, {
    refetchQueries: [
      ({ variables }) => ({
        query: GET_COMMENT_REPLIES,
        variables: { commentId: variables.commentId }
      })
    ],
    onError: (error) => console.error('Error liking reply:', error),
  });
  const [content, setContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [showReplies, setShowReplies] = useState({});
  const [repliesData, setRepliesData] = useState({});

  const isLoggedIn = Auth.loggedIn();
  const username = isLoggedIn ? Auth.getProfile().data.username : '';
  const userId = isLoggedIn ? Auth.getProfile().data._id : '';

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await createComment({ variables: { postId, creatorName: username, content } });
      setContent('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleReplySubmit = async (e, parentCommentId) => {
    e.preventDefault();
    try {
      await createComment({
        variables: { postId, creatorName: username, content: replyContent, parentCommentId },
      });
      setReplyContent('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  const toggleReplies = async (commentId) => {
    if (showReplies[commentId]) {
      setShowReplies((prev) => ({ ...prev, [commentId]: false }));
    } else {
      if (!repliesData[commentId]) {
        const { data } = await fetchReplies({ variables: { commentId } });
        setRepliesData((prev) => ({
          ...prev,
          [commentId]: data.getCommentReplies.replies,
        }));
      }
      setShowReplies((prev) => ({ ...prev, [commentId]: true }));
    }
  };

  const handleLike = async (commentId) => {
    try {
      await likeComment({ variables: { commentId, userId } });
      // After liking a comment, refetch replies for that specific comment
      if (showReplies[commentId]) {
        const { data } = await fetchReplies({ variables: { commentId } });
        setRepliesData((prev) => ({
          ...prev,
          [commentId]: data.getCommentReplies.replies,
        }));
      }
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };
  const handleLikeReply = async (commentId) => {
    try {
      const { data } = await likeReply({ variables: { commentId, userId } });
      // Optionally, update the local state if needed
      // For example, you can trigger a refetch or update local state for replies
      console.log(data);
    } catch (error) {
      console.error('Error liking reply:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const post = data.post;

  return (
    <div>
      <Header />
      <div className={styles.layout}>
        <Sidebar />
        <div className={styles.post}>
          <div className={styles.postDetail}>
            <h2>{post.creatorName}'s Post</h2>
            <p className={styles.postContent}>{post.content}</p>
            <p className={styles.postDate}>
              Created {formatDistanceToNow(new Date(parseInt(post.createdAt)))} ago
            </p>
          </div>
          <div className={styles.comments}>
            <h3>Comments:</h3>
            <form onSubmit={handleCommentSubmit} className={styles.textAreaContainer}>
              <textarea
                placeholder="Leave A Comment"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                id={styles.input}
              />
              <div className={styles.buttonContainer}>
                <button className={styles.button} type="submit">Post</button>
              </div>
            </form>
            {post.comments.map((comment) => (
              <div key={comment.id} className={styles.comment}>
                <h3 className={styles.creatorName}>{comment.creatorName}</h3>
                <p>{comment.content}</p>
                <div className={styles.btns}>
                  {comment.replies.length > 0 && (
                    <div className={styles.replybtncontainer}>
                      <a
                        className={styles.showRepliesBtn}
                        onClick={() => toggleReplies(comment.id)}
                      >
                        {showReplies[comment.id]
                          ? 'Hide Replies'
                          : `Show ${comment.replies.length} ${comment.replies.length > 1 ? 'Replies' : 'Reply'}`}
                      </a>
                    </div>
                  )}
                  <button
                    className={styles.replybtn}
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  >
                    <FaReply /> Reply
                  </button>
                  <button className={styles.likebtn} onClick={() => handleLike(comment.id)}>
                    <AiFillLike />{comment.likes.length}
                  </button>
                </div>
                {showReplies[comment.id] && (
                  <div className={styles.replies}>
                    {repliesLoading ? (
                      <p>Loading replies...</p>
                    )  : (
                      repliesData[comment.id]?.map((reply) => (
                        <div key={reply.id} className={styles.reply}>
                          <h3 className={styles.creatorName}>{reply.creatorName}</h3>
                          <p>{reply.content}</p>
                          <button className={styles.likebtn} onClick={() => handleLikeReply(reply.id)}>
                            <AiFillLike />{reply.likes.length}
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
                {replyingTo === comment.id && (
                  <form
                    onSubmit={(e) => handleReplySubmit(e, comment.id)}
                    className={styles.replyForm}
                  >
                    <textarea
                      placeholder="Leave A Reply"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      id={styles.replyInput}
                    />
                    <div className={styles.buttonContainer}>
                      <button className={styles.button} type="submit">Reply</button>
                    </div>
                  </form>
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
