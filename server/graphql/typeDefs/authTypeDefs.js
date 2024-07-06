const { gql } = require('apollo-server-express');

const authTypeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    userStatus: String!
    token: String
  }
type Provider {
  id: ID
  name: String
  location: String
  website: String
}

input ProviderInput {
  name: String!
  location: String
  website: String
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

  type Query {
    me: User
    getProviders: [Provider]!
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    createProvider(input: ProviderInput!): Provider!
    login(loginInput: LoginInput): User!
  }
`;

module.exports = authTypeDefs;
