import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import styles from '../styles/network.module.css';
import { Link } from 'react-router-dom';
import { FaRegCommentAlt } from "react-icons/fa";
import { AiFillLike } from "react-icons/ai";
import { useQuery, useMutation } from '@apollo/client';
import { GET_RECOMMENDED_PEOPLE, GET_NETWORK_POSTS } from '../utils/queries';
import { FOLLOW_USER, UNFOLLOW_USER, LIKE_POST } from '../utils/mutations';
import Auth from '../utils/auth';
import { formatDistanceToNow } from 'date-fns'; // Import formatDistanceToNow

// Post Component for rendering network posts
const Post = ({ post }) => {
  const userId = Auth.getProfile()?.data?._id; // Get the current user's ID

  // Mutation to like a post
  const [likePost] = useMutation(LIKE_POST, {
    refetchQueries: [{ query: GET_NETWORK_POSTS }],
    onError: (error) => console.error('Error liking post:', error),
  });

  const handleLike = async () => {
    if (!userId) {
      console.error('User must be logged in to like a post');
      return;
    }
    try {
      await likePost({ variables: { postId: post.id, userId } });
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  return (
    <Link to={`/post/${post.id}`} className={styles.post}> {/* Make the entire post clickable */}
      <h3>{post.creatorName}</h3> {/* Creator's name */}
      <p>{post.content}</p>
      <div className={styles.metadata}>
        <button className={styles.like} onClick={handleLike}>
          <AiFillLike />
        </button>
        <p className={styles.likeCount}>{post.likes.length}</p>

        <FaRegCommentAlt className={styles.comment} />
        <p className={styles.commentLength}>{post.comments.length}</p>
        <p className={styles.date}>{formatDistanceToNow(new Date(parseInt(post.createdAt)))} ago</p>
      </div>
    </Link>
  );
};

// Main Network Component
const Network = () => {
  const userId = Auth.getProfile()?.data?._id; // Get the current user's ID
  
  // Query to get recommended people
  const { loading: loadingPeople, error: errorPeople, data: dataPeople } = useQuery(GET_RECOMMENDED_PEOPLE, {
    variables: { userId },
    skip: !userId,
  });

  // Query to get network posts
  const { loading: loadingPosts, error: errorPosts, data: dataPosts } = useQuery(GET_NETWORK_POSTS, {
    variables: { userId },
    skip: !userId,
  });

  // Mutation for following a user
  const [followUser] = useMutation(FOLLOW_USER, {
    refetchQueries: [{ query: GET_RECOMMENDED_PEOPLE, variables: { userId } }],
    onError: (error) => console.error('Error following user:', error),
  });

  // Mutation for unfollowing a user
  const [unfollowUser] = useMutation(UNFOLLOW_USER, {
    refetchQueries: [{ query: GET_RECOMMENDED_PEOPLE, variables: { userId } }],
    onError: (error) => console.error('Error unfollowing user:', error),
  });

  if (loadingPeople || loadingPosts) return <p>Loading...</p>;
  if (errorPeople || errorPosts) return <p>Error: {errorPeople?.message || errorPosts?.message}</p>;

  const recommendedPeople = dataPeople?.getRecommendedPeople || [];
  const networkPosts = dataPosts?.getNetworkPosts || [];

  // Follow/Unfollow button component
  const FollowButton = ({ person }) => {
    const isFollowing = person.followers?.some((follower) => follower.id === userId) || false;

    const handleFollow = async () => {
      try {
        await followUser({ variables: { userIdToFollow: person.id.toString() } });
      } catch (error) {
        console.error('Error following user:', error);
      }
    };

    const handleUnfollow = async () => {
      try {
        await unfollowUser({ variables: { userIdToUnfollow: person.id.toString() } });
      } catch (error) {
        console.error('Error unfollowing user:', error);
      }
    };

    return (
      <button className={styles.followButton} onClick={isFollowing ? handleUnfollow : handleFollow}>
        {isFollowing ? 'Unfollow' : 'Follow'}
      </button>
    );
  };

  return (
    <div>
      <Header />
      <div className={styles.layout}>
        <Sidebar />

        {/* Network Feed Section */}
        <div className={styles.networkFeed}>
          <h1>Network Posts</h1>
          {networkPosts.length > 0 ? (
            networkPosts.map((post) => <Post key={post.id} post={post} />)
          ) : (
            <p>No posts available at the moment.</p>
          )}
        </div>

        {/* Recommended People Section */}
        <div className={styles.recommendedPeople}>
          <h2>People You May Know</h2>
          {recommendedPeople.length > 0 ? (
            recommendedPeople.map((person) => (
              <div key={person.id} className={styles.recommendedPerson}>
                <div className={styles.personInfo}>
                  <h4>{person.username}</h4>
                  <p>Graduation Year: {new Date(parseInt(person.graduationDate)).getFullYear()}</p>
                  <p>City: {person.city}</p>
                  {/* Follow/Unfollow button */}
                  <FollowButton person={person} />
                </div>
              </div>
            ))
          ) : (
            <p>No recommendations available at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Network;
