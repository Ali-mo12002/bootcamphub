import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import { useMutation, useQuery } from '@apollo/client';
import { NEW_SHOWCASE } from '../utils/mutations';
import { GET_SHOWCASE_POSTS } from '../utils/queries'; // Import the correct query
import styles from '../styles/showcase.module.css';
import Auth from '../utils/auth';
import { FaRegCommentAlt } from "react-icons/fa";
import { AiFillLike } from "react-icons/ai";

const Showcase = () => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        link: '',
        image: null,
        content: '',
    });
    const navigate = useNavigate(); // Initialize useNavigate hook

    const handlePostClick = (showcase) => {
        console.log(showcase);
        navigate(`/post/${showcase.id}`); // Navigate to the post page
    };
    
    const { loading, data } = useQuery(GET_SHOWCASE_POSTS); // Use the correct query to fetch showcase posts
    const [newShowcase] = useMutation(NEW_SHOWCASE);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const isLoggedIn = Auth.loggedIn();
    const username = isLoggedIn ? Auth.getProfile().data.username : '';

    const handleSubmit = async (e) => {
        e.preventDefault();

        let imageUrl = '';

        // Step 1: Upload the image if it exists
        if (formData.image) {
            const uploadData = new FormData();
            uploadData.append('image', formData.image);

            try {
                const response = await fetch('http://localhost:5000/upload', {
                    method: 'POST',
                    body: uploadData,
                });

                if (!response.ok) {
                    throw new Error("Failed to upload image");
                }

                const result = await response.json();
                imageUrl = result.imageUrl; // Ensure backend returns this correctly
                console.log("Uploaded image URL:", imageUrl);

            } catch (error) {
                console.error("Error uploading image:", error);
                return; // Stop if image upload fails
            }
        }

        // Step 2: Run the GraphQL mutation with the image URL
        try {
            await newShowcase({
                variables: {
                    input: {
                        creatorName: username,
                        title: formData.title,
                        link: formData.link,
                        content: formData.content,
                        image: imageUrl, // Include the uploaded image URL
                        isProject: true,
                    },
                },
            });
            setShowModal(false); // Close modal on success
            setFormData({
                title: '',
                link: '',
                image: null,
                content: '',
            });
        } catch (error) {
            console.error("Error creating showcase post:", error);
        }
    };

    // Render loading state or showcase posts
    if (loading) return <p>Loading showcases...</p>;

    const showcases = data.showcasePosts; // Access the fetched showcase posts
    
    return (
        <div>
            <Header />
            <div className={styles.div}>
                <Sidebar />
                <div className={styles.contentdiv}>
                    <h1>Showcase</h1>
                    <div className={styles.createbtncontainer}>
                        <button onClick={() => setShowModal(true)} className={styles.createbtn}>
                            Create showcase
                        </button>
                    </div>

                    {showModal && (
                        <Modal onClose={() => setShowModal(false)}>
                            <form onSubmit={handleSubmit} className={styles.form}>
                                <label>
                                    Title:
                                    <input 
                                        type="text" 
                                        name="title" 
                                        value={formData.title} 
                                        onChange={handleInputChange} 
                                        required 
                                    />
                                </label>
                                <label>
                                    Link:
                                    <input 
                                        type="url" 
                                        name="link" 
                                        value={formData.link} 
                                        onChange={handleInputChange} 
                                    />
                                </label>
                                <label>
                                    Image:
                                    <input 
                                        type="file" 
                                        name="image" 
                                        accept="image/*" 
                                        onChange={handleImageChange} 
                                    />
                                </label>
                                <label>
                                    Description:
                                    <textarea 
                                        name="content" 
                                        value={formData.content} 
                                        onChange={handleInputChange} 
                                        required 
                                    />
                                </label>
                                <button type="submit">Submit</button>
                            </form>
                        </Modal>
                    )}

                    <h2>Existing Showcases</h2>
                    <div className={styles.showcaseList}>
                        {showcases.map((showcase) => (
                            <div key={showcase.id} className={styles.showcaseItem}>
                                <div className={styles.imageContainer}>
                                    {showcase.image && (
                                        <img
                                            src={showcase.image}
                                            alt={showcase.title}
                                            className={styles.showcaseImage}
                                        />
                                    )}
                                    <div className={styles.overlay} onClick={() => handlePostClick(showcase)}>
                                        <h3 className={styles.title}>{showcase.title}</h3>
                                        <div>
                                            <p className={styles.content}>{showcase.content}</p>
                                            <a href={showcase.link} target="_blank" rel="noopener noreferrer">
                                                View Showcase
                                            </a>
                                        </div>
                                        <div className={styles.metadata}>
                                            <p className={styles.creator}>
                                                <strong>Created by:</strong> {showcase.creatorName}
                                            </p>
                                            <div className={styles.stats}>
                                                <button className={styles.like}>
                                                    <AiFillLike />
                                                </button>
                                                <p className={styles.likeCount}>{showcase.likes.length}</p>
                                                <FaRegCommentAlt className={styles.comment} />
                                                <p className={styles.commentLength}>{showcase.comments.length}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Showcase;
