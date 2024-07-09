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
  overallRating: Int!
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
    graduationDate: String!
    courseId: ID!
  }

  type Query {
    me: User
    getProviders: [Provider]!
    getCoursesByProvider(providerId: ID!): [Course]!
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    createProvider(input: ProviderInput!): Provider!
    createCourse(input: CourseInput!): Course!
    login(loginInput: LoginInput): User!
    updateGradInfo(updateGradInfoInput: UpdateGradInfoInput): User!
    submitReview(courseId: ID!, curriculumRating: Int!, instructorRating: Int!, supportRating: Int!, overallRating: Int!, feedback: String!): Review

  }
`;

module.exports = authTypeDefs;
