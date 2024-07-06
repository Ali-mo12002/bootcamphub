const bcrypt = require('bcryptjs');
const { signToken } = require('../../utils/auth');
const User = require('../../models/User');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const Provider = require('../../models/Provider');

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
  },
  Mutation: {
    register: async (_, { registerInput: { username, email, password, userStatus } }) => {
      try {
        // Check if user with given email already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
          throw new Error('User already exists');
        }

        // Hash the password

        // Create new user
        const user = await User.create({
          username,
          email,
          password,
          userStatus,
        });

        // Generate JWT token
        const token = signToken(user);

        return {token, user };
      } catch (error) {
        console.error('Error registering user:', error);
        throw new Error('Registration failed');
      }
    },

    login: async (_, { loginInput: { email, password } }) => {
      try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error('Invalid email or password');
        }
  


        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error('Invalid email or password');
        }
        
        // Generate JWT token
        const token = signToken(user);
        console.log('ss', user);
        return {token, user };


      } catch (error) {
        console.error('Error logging in user:', error);
        throw new Error('Login failed');
      }
    },
    createProvider: async (_, { input:{ name, location, website } }) => {
      try {

        // Check if provider already exists
        let provider = await Provider.findOne({ name });
        if (provider) {
          throw new Error('Provider already exists');
        }

        // Create new provider
        provider = await Provider.create({
          name,
          location,
          website,
        });

        // Save provider to database
        const savedProvider = await provider.save();
        return savedProvider;
      } catch (error) {
        throw new Error(`Failed to create provider: ${error.message}`);
      }
    },
  },
};

module.exports = authResolvers;
