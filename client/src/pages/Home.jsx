import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import styles from '../styles/home.module.css'; // CSS Modules
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import Auth from '../utils/auth'; // Adjust the path based on your project structure
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { CREATE_POST } from '../utils/mutations'; // Import GraphQL operations
import { GET_POSTS } from '../utils/queries'; // Import GraphQL operations
import { formatDistanceToNow } from 'date-fns';

// Additional component for displaying posts
const formatDate = (timestamp) => {
  const date = new Date(parseInt(timestamp));
  return date.toLocaleString(); // You can format the date string as needed
};
const Post = ({ post }) => {
  return (

    <div className={styles.post}>
      <h3>{post.creatorName}</h3>
      <p>{post.content}</p>
      <p>{formatDistanceToNow(new Date(parseInt(post.createdAt)))} ago</p>
      <div>
        <button className={styles.like}>Like ({post.likes.length})</button>
        {/* You can add functionality for liking and commenting here */}
      </div>
      <div>
        {post.comments.map(comment => (
          <div key={comment.id}>
            <p>{comment.creatorName}: {comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
const Home = () => {
  const [potentialVisible, setPotentialVisible] = useState(false);
  const [currentVisible, setCurrentVisible] = useState(false);
  const [graduateVisible, setGraduateVisible] = useState(false);
  const [content, setContent] = useState('');
  const [createPost] = useMutation(CREATE_POST, {
    refetchQueries: [{ query: GET_POSTS }],
  });
  const { loading, error, data } = useQuery(GET_POSTS);

  const togglePotential = () => setPotentialVisible(!potentialVisible);
  const toggleCurrent = () => setCurrentVisible(!currentVisible);
  const toggleGraduate = () => setGraduateVisible(!graduateVisible);

  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };

  let username = '';
  if (Auth.loggedIn() === true) {
    const user = Auth.getProfile();
    username = user.data.username;
  }

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPost({ variables: { creatorName: username, content } });
      setContent('');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className={styles.home}>
      {Auth.loggedIn() ? (
        <>
          <Header />
          <section className={styles.emptyContent}>
            <Sidebar />

            <div className={styles.container}>
              <h2>Posts</h2>
              <form onSubmit={handlePostSubmit} className={styles.textAreaContainer}>
                <textarea
                  placeholder='Create A New Post'
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  id={styles.input}
                ></textarea>
                <div className={styles.buttonContainer}>
                  <button className={styles.button} type='submit'>
                    Post
                  </button>
                </div>
              </form>
              <div className={styles.postsList}>
                {data.posts.map((post) => (
                  <Post key={post.id} post={post} />
                ))}
              </div>
            </div>
          </section>
        </>
      ) : (
        <>
          <div className={styles.login}>
            <Link to="/login" className={styles.navLink}>
              Log In
            </Link>
          </div>
          <section className={styles.hero}>
            <div className={styles.heroContent}>
              <h1>Bootcamp Hub</h1>
              <p>Your Ultimate Resource for Coding Bootcamps</p>
            </div>
          </section>

          <section className={styles.features}>
            <div className={styles.container}>
              <h2>Discover, Learn, Succeed</h2>

              <div className={styles.featureGroup}>
                <h3 onClick={togglePotential} className={styles.dropdownHeader}>
                  <FontAwesomeIcon icon={faChevronDown} className={styles.dropdownIcon} />
                  For Potential Students
                </h3>
                {potentialVisible && (
                  <ul className={styles.dropdownContent}>
                    <li><FontAwesomeIcon icon={faCheckCircle} className={styles.icon} /> Explore coding bootcamps and find out what others think about it</li>
                    <li><FontAwesomeIcon icon={faCheckCircle} className={styles.icon} /> Compare options and curricula</li>
                    <li><FontAwesomeIcon icon={faCheckCircle} className={styles.icon} /> Get expert advice to start your journey in tech</li>
                  </ul>
                )}
              </div>

              <div className={styles.featureGroup}>
                <h3 onClick={toggleCurrent} className={styles.dropdownHeader}>
                  <FontAwesomeIcon icon={faChevronDown} className={styles.dropdownIcon} />
                  For Current Students
                </h3>
                {currentVisible && (
                  <ul className={styles.dropdownContent}>
                    <li><FontAwesomeIcon icon={faCheckCircle} className={styles.icon} /> Access additional learning resources</li>
                    <li><FontAwesomeIcon icon={faCheckCircle} className={styles.icon} /> Connect with peers and collaborate</li>
                    <li><FontAwesomeIcon icon={faCheckCircle} className={styles.icon} /> Prepare for success in your bootcamp</li>
                  </ul>
                )}
              </div>

              <div className={styles.featureGroup}>
                <h3 onClick={toggleGraduate} className={styles.dropdownHeader}>
                  <FontAwesomeIcon icon={faChevronDown} className={styles.dropdownIcon} />
                  For Graduates
                </h3>
                {graduateVisible && (
                  <ul className={styles.dropdownContent}>
                    <li><FontAwesomeIcon icon={faCheckCircle} className={styles.icon} /> Access job placement assistance</li>
                    <li><FontAwesomeIcon icon={faCheckCircle} className={styles.icon} /> Utilize career services and networking opportunities</li>
                  </ul>
                )}
              </div>
            </div>
          </section>

          <section className={styles.signUpLogin}>
            <div className={styles.container}>
              <h2>Get Started Today</h2>
              <p>Join Bootcamp Hub to connect with fellow students and alumni, access exclusive resources, and take the next step in your coding career.</p>

              <div className={styles.join}>
                <Link to="/register" className={styles.joinLink}>Sign Up</Link>
                <Link to="/login" className={styles.joinLink}>Log In</Link>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Home;
