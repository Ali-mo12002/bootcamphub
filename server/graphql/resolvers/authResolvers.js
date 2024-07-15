const bcrypt = require('bcryptjs');
const { signToken } = require('../../utils/auth');
const User = require('../../models/User');
const Provider = require('../../models/Provider');
const Course = require('../../models/Course');
const Review = require('../../models/Review');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const authResolvers = {
  Query: {
    me: async (_, __, context) => {
      if (!context.user) {
        throw new Error('you need to be logged in');
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
  },
  Mutation: {
    register: async (_, { registerInput: { username, email, password, userStatus } }) => {
      try {
        const userExists = await User.findOne({ email });
        if (userExists) {
          throw new Error('User already exists');
        }

        const user = await User.create({
          username,
          email,
          password,
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
        console.log(provider);
        const savedProvider = await provider.save();
        console.log(savedProvider);
        return savedProvider;
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
        const savedCourse = await course.save();
        return savedCourse;
      } catch (error) {
        throw new Error(`Failed to create course: ${error.message}`);
      }
    },
    updateGradInfo: async (_, { updateGradInfoInput }, { user }) => {
      if (!user) {
        throw new AuthenticationError('Authentication required');
      }
    
      const { graduationDate = '', courseId = '' } = updateGradInfoInput;
      console.log(user, '2s23123');
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
    completeOnboarding: async(_, {  onboardingInput }, { user })  => {
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
      // Assuming you have a Review model
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
  },
};

module.exports = authResolvers;