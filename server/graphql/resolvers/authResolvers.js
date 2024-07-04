const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const dotenv = require('dotenv');

dotenv.config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const authResolvers = {
  Query: {
    hello: () => 'Hello, world!',
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
        console.log(email);
        console.log(await bcrypt.hash(password, 10));
        console.log(user.password);
        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error('Invalid email or password');
        }
        
        // Generate JWT token
        const token = generateToken(user._id);

        return {
          id: user._id,
          username: user.username,
          email: user.email,
          userStatus: user.userStatus,
          token,
        };
      } catch (error) {
        console.error('Error logging in user:', error);
        throw new Error('Login failed');
      }
    },
  },
};

module.exports = authResolvers;
