const express = require('express');
const dotenv = require('dotenv');
const { ApolloServer } = require('apollo-server-express');
const connectDB = require('./config/db');
const { typeDefs, resolvers } = require('./graphql/schema');
const { authMiddleware } = require('./utils/auth');
const uploadRoutes = require('./routes/upload.js'); // Update path as needed
const cors = require('cors');

dotenv.config();

// Connect to MongoDB
connectDB();

// Create an instance of ApolloServer
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

// Initialize Express app
const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));

app.use(express.json());
app.use('/upload', uploadRoutes); // Mount the upload route
app.use('/uploads', express.static('uploads')); // Serve uploaded images as static files

// Apply ApolloServer middleware to Express app
async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
  });
}

// Start the server
startServer();
