const bcrypt = require('bcryptjs');
const { signToken } = require('../../utils/auth');
const User = require('../../models/User');
const Provider = require('../../models/Provider');
const Course = require('../../models/Course');
const Post = require('../../models/Post');
const Comment = require('../../models/Comments'); // Ensure the model name is correct
const Review = require('../../models/Review');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const authResolvers = {
  Query: {
    me: async (_, __, context) => {
      if (!context.user) {
        throw new Error('You need to be logged in');
      }

      try {
        const user = await User.findById(context.user._id);
        if (!user) {
          throw new Error('User not found');
        }
        return user;
      } catch (error) {
        throw new Error('Invalid token');
      }
    },
    getProviders: async () => {
      try {
        const providers = await Provider.find();
        return providers;
      } catch (error) {
        throw new Error(`Failed to fetch providers: ${error.message}`);
      }
    },
    getCoursesByProvider: async (_, { providerId }) => {
      try {
        const courses = await Course.find({ providerId });
        return courses;
      } catch (error) {
        throw new Error(`Failed to fetch courses: ${error.message}`);
      }
    },
    posts: async () => await Post.find().populate({
      path: 'comments',
      populate: { path: 'replies' }
    }),
    post: async (_, { id }) => await Post.findById(id).populate({
      path: 'comments',
      populate: { path: 'replies' }
    }),
    getCommentReplies: async (_, { commentId }) => {
      try {
        const comment = await Comment.findById(commentId).populate('replies');
        if (!comment) {
          throw new Error('Comment not found');
        }
        return comment;
      } catch (error) {
        throw new Error(`Failed to fetch comment replies: ${error.message}`);
      }
    },
    getRecommendedPeople: async (_, { userId }) => {
      try {
        // Fetch the current user's details
        const currentUser = await User.findById(userId);
        if (!currentUser) {
          throw new Error('User not found');
        }

        // Search for users who did the same course and graduated the same year
        let recommendedPeople = await User.find({
          _id: { $ne: userId }, // Exclude the current user
          courseId: currentUser.courseId,
          graduationYear: currentUser.graduationYear,
        });

        // If no users found, search for users who did the same course (regardless of year)
        if (recommendedPeople.length === 0) {
          recommendedPeople = await User.find({
            _id: { $ne: userId },
            courseId: currentUser.courseId,
          });
        }

        // If no users found, search for users who graduated the same year (regardless of course)
        if (recommendedPeople.length === 0) {
          recommendedPeople = await User.find({
            _id: { $ne: userId },
            graduationYear: currentUser.graduationYear,
          });
        }

        // If still no users found, get random users (up to 10)
        if (recommendedPeople.length === 0) {
          recommendedPeople = await User.aggregate([
            { $match: { _id: { $ne: userId } } },
            { $sample: { size: 10 } },
          ]);
        }

        return recommendedPeople;
      } catch (error) {
        console.error('Error fetching recommended people:', error);
        throw new Error('Failed to fetch recommended people');
      }
    },
  
  },
  Mutation: {
    register: async (_, { registerInput: { username, email, password, userStatus } }) => {
      try {
        const userExists = await User.findOne({ email });
        if (userExists) {
          throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 12); // Hash the password before saving
        const user = await User.create({
          username,
          email,
          password: hashedPassword,
          userStatus,
        });

        const token = signToken(user);
        return { token, user };
      } catch (error) {
        console.error('Error registering user:', error);
        throw new Error('Registration failed');
      }
    },
    login: async (_, { loginInput: { email, password } }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error('Invalid email or password');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error('Invalid email or password');
        }

        const token = signToken(user);
        return { token, user };
      } catch (error) {
        console.error('Error logging in user:', error);
        throw new Error('Login failed');
      }
    },
    createProvider: async (_, { input: { name, location, website } }) => {
      try {
        let provider = await Provider.findOne({ name });
        if (provider) {
          throw new Error('Provider already exists');
        }

        provider = await Provider.create({ name, location, website });
        return provider;
      } catch (error) {
        throw new Error(`Failed to create provider: ${error.message}`);
      }
    },
    createCourse: async (_, { input: { providerId, name, deliveryMode, schedule, cost } }) => {
      try {
        const course = await Course.create({
          providerId,
          name,
          deliveryMode,
          schedule,
          cost,
        });
        return course;
      } catch (error) {
        throw new Error(`Failed to create course: ${error.message}`);
      }
    },
    updateGradInfo: async (_, { updateGradInfoInput }, { user }) => {
      if (!user) {
        throw new AuthenticationError('Authentication required');
      }
    
      const { graduationDate = '', courseId = '' } = updateGradInfoInput;
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
          graduationDate,
          courseId,
        },
        { new: true }
      );
    
      if (!updatedUser) {
        throw new Error('User not found or update failed.');
      }
    
      return updatedUser;
    },
    completeOnboarding: async(_, { onboardingInput }, { user }) => {
      if (!user) {
        throw new AuthenticationError('Authentication required');
      }

      const { city, interested } = onboardingInput;
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { city, interested },
        { new: true }
      );

      if (!updatedUser) {
        throw new Error('User not found');
      }

      return updatedUser;
    },
    submitReview: async (_, { courseId, curriculumRating, instructorRating, supportRating, overallRating, feedback }, context) => {
      const review = await Review.create({
        courseId,
        curriculumRating,
        instructorRating,
        supportRating,
        overallRating,
        feedback,
      });

      return review;
    },
    createPost: async (_, { creatorName, content }) => {
      const newPost = new Post({ creatorName, content });
      return await newPost.save();
    },
    likePost: async (_, { postId }, { user }) => {
      if (!user) {
        throw new AuthenticationError('Authentication required');
      }
    
      const userId = user._id; // Get the user ID from context
      const post = await Post.findById(postId);
      const userIndex = post.likes.indexOf(userId);
      if (userIndex > -1) {
        // If user already liked the post, remove the like
        post.likes.splice(userIndex, 1);
      } else {
        // Otherwise, add the user's like
        post.likes.push(userId);
      }
      return await post.save();
    },
    createComment: async (_, { postId, creatorName, content, parentCommentId }) => {
      const newComment = new Comment({
        postId,
        creatorName,
        content,
        parentComment: parentCommentId || null, // Include parentCommentId if provided
      });

      // If it's a reply to another comment
      if (parentCommentId) {
        const parentComment = await Comment.findById(parentCommentId);
        if (!parentComment) {
          throw new Error('Parent comment not found');
        }
        parentComment.replies.push(newComment._id);
        await parentComment.save();
      } else {
        // If it's a direct comment on the post
        const post = await Post.findById(postId);
        if (!post) {
          throw new Error('Post not found');
        }
        post.comments.push(newComment._id);
        await post.save();
      }
    
      return await newComment.save();
    },
    likeComment: async (_, { commentId, userId }) => {
      const comment = await Comment.findById(commentId);
      if (!comment) {
        throw new Error('Comment not found');
      }
      console.log(userId)
      const userIndex = comment.likes.indexOf(userId);
      if (userIndex > -1) {
        // If user already liked the comment, remove the like
        comment.likes.splice(userIndex, 1);
      } else {
        // Otherwise, add the user's like
        comment.likes.push(userId);
      }
      return await comment.save();
    },
    likeReply: async (_, { commentId, userId }) => {
      const reply = await Comment.findById(commentId);
      if (!reply) {
        throw new Error('Reply not found');
      }

      const userIndex = reply.likes.indexOf(userId);
      if (userIndex > -1) {
        // If user already liked the comment, remove the like
        reply.likes.splice(userIndex, 1);
      } else {
        // Otherwise, add the user's like
        reply.likes.push(userId);
      }
      
      await reply.save();
      return reply;
    },
  }
};

module.exports = authResolvers;
