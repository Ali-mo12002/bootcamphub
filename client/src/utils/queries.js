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
          likes
          
        }
      }
    }
  }
`;

export const GET_COMMENT_REPLIES = gql`
query GetCommentReplies($commentId: ID!) {
  getCommentReplies(commentId: $commentId) {
    id
    creatorName
    content
    createdAt
    likes
    replies {
      id
      creatorName
      content
      createdAt
      likes
    }
  }
}
`;

export const GET_RECOMMENDED_PEOPLE = gql`
  query GetRecommendedPeople($userId: ID!) {
    getRecommendedPeople(userId: $userId) {
      id
      username
      graduationDate
      city
    }
  }
`;