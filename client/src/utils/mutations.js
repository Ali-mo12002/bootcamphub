import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(loginInput: { email: $email, password: $password }) {
      token
    }
  }
`;
export const REGISTER_USER = gql`
  mutation Register($username: String!, $email: String!, $password: String!, $userStatus: String!) {
    register(registerInput: { username: $username, email: $email, password: $password, userStatus: $userStatus }) {
      token
      
    }
  }
`;
export const CREATE_PROVIDER = gql`
  mutation CreateProvider($name: String!, $location: String!, $website: String!) {
    createProvider(input: { name: $name, location: $location, website: $website }) {
      
      name
      location
      website
    }
  }
`;