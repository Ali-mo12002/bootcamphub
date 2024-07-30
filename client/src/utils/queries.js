import { gql } from '@apollo/client';

export const GET_USER = gql`
  query me {
    me {
      id
      username
      userStatus
    }
  }
`;
export const GET_PROVIDERS = gql`
  query GetProviders {
    getProviders {
      id
      name
    }
  }
`;
export const GET_COURSES_BY_PROVIDER_ID = gql`
  query GetCoursesByProvider($providerId: ID!) {
    getCoursesByProvider(providerId: $providerId) {
      id
      name
      deliveryMode
      schedule
      cost
    }
  }
`;

export const GET_POSTS = gql`
  query GetPosts {
    posts {
        comments {
          content
          createdAt
          creatorName
          id
          
          replies {
            content
            createdAt
            creatorName
            id
            postId
          }
        }
        content
        createdAt
        creatorName
        id
        likes
      
    }
  }
`;

export const GET_POST = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      id
      creatorName
      createdAt
      content
      likes 
      comments {
        id
        creatorName
        createdAt
        content
        likes
        replies {
          id
          creatorName
          content
        }
      }
    }
  }
`;