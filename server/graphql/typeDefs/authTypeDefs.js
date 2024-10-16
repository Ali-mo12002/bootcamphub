const { gql } = require('apollo-server-express');

const authTypeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    userStatus: String!
    graduationDate: String
    courseId: ID
    token: String
    city: String               # Optional field
    interested: [String!]      # Optional field
    hasCompletedOnboarding: Boolean! # Add this field
    followers: [User]
    following: [User]
  }

  type Provider {
    id: ID
    name: String
    location: String
    website: String
  }

  type Course {
    id: ID!
    providerId: ID!
    name: String!
    deliveryMode: String!
    schedule: String!
    cost: Float!
  }

  type Review {
    id: ID!
    courseId: ID!
    curriculumRating: Int!
    instructorRating: Int!
    supportRating: Int!
    overallRating: Int
    feedback: String!
  }

  input ProviderInput {
    name: String!
    location: String
    website: String
  }

  input CourseInput {
    providerId: ID!
    name: String!
    deliveryMode: String!
    schedule: String!
    cost: Float!
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
    userStatus: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input UpdateGradInfoInput {
    id: ID!
    graduationDate: String!
    courseId: ID!
  }

  input OnboardingInput {    
    id: ID!
    interested: [String!]!
  }

  input UpdateCityInput {
    id: ID!
    city: String!
  }

  type Post {
    id: ID!
    creatorName: String!
    createdAt: String!
    content: String!
    likes: [ID!]!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    creatorName: String!
    createdAt: String!
    content: String!
    postId: ID!          # Ensure this is non-nullable
    parentCommentId: ID
    replies: [Comment!]!
    likes: [ID!]!
  }

  type Query {
    me: User
    getProviders: [Provider]!
    getCoursesByProvider(providerId: ID!): [Course]!
    posts: [Post!]!
    post(id: ID!): Post
    getCommentReplies(commentId: ID!): Comment
    getRecommendedPeople(userId: ID!): [User]
    userProfile(userId: ID!): User
      getNetworkPosts(userId: ID!): [Post!]!

  }

  type Mutation {
    createPost(creatorName: String!, content: String!): Post!
    createComment(creatorName: String!, content: String!, postId: ID!, parentCommentId: ID): Comment!
    likePost(postId: ID!): Post!
    replyComment(creatorName: String!, content: String!, commentId: ID!): Comment!
    likeComment(commentId: ID!, userId: ID!): Comment!
    likeReply(commentId: ID!, userId: ID!): Comment!
    register(registerInput: RegisterInput): User!
    createProvider(input: ProviderInput!): Provider!
    createCourse(input: CourseInput!): Course!
    login(loginInput: LoginInput): User!
    updateGradInfo(updateGradInfoInput: UpdateGradInfoInput): User!
    submitReview(courseId: ID!, curriculumRating: Int!, instructorRating: Int!, supportRating: Int!, overallRating: Int, feedback: String!): Review
    completeOnboarding(onboardingInput: OnboardingInput!): User!
  updateCity(updateCityInput: UpdateCityInput!): User!
  followUser(userIdToFollow: ID!): User
  unfollowUser(userIdToUnfollow: ID!): User
  }
`;

module.exports = authTypeDefs;
