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
      id
      name
      location
      website
    }
  }
`;

export const CREATE_COURSE = gql`
  mutation CreateCourse($providerId: ID!, $name: String!, $deliveryMode: String!, $schedule: String!, $cost: Float!) {
    createCourse(input: { providerId: $providerId, name: $name, deliveryMode: $deliveryMode, schedule: $schedule, cost: $cost }) {
      providerId
      name
      deliveryMode
      schedule
      cost
    }
  }
`;

export const UPDATE_GRAD_INFO = gql`
  mutation UpdateGradInfo($id: ID!, $graduationDate: String!, $courseId: ID!) {
    updateGradInfo(updateGradInfoInput: { id: $id, graduationDate: $graduationDate, courseId: $courseId }) {
      id
      graduationDate
      courseId
    }
  }
`;

export const SUBMIT_REVIEW = gql`
  mutation SubmitReview($courseId: ID!, $curriculumRating: Int, $instructorRating: Int, $supportRating: Int, $overallRating: Int, $feedback: String) {
    submitReview(courseId: $courseId, curriculumRating: $curriculumRating, instructorRating: $instructorRating, supportRating: $supportRating, overallRating: $overallRating, feedback: $feedback) {
      id
      courseId
      curriculumRating
      instructorRating
      supportRating
      overallRating
      feedback
    }
  }
`;

export const COMPLETE_ONBOARDING = gql`
  mutation CompleteOnboarding($id: ID!, $city: String!, $interested: [String!]!) {
    completeOnboarding(onboardingInput: { id: $id, city: $city, interested: $interested }) {
      id
      city
      interested
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost($creatorName: String!, $content: String!) {
    createPost(creatorName: $creatorName, content: $content) {
      id
      creatorName
      content
      createdAt
      likes 
      comments {
        id
        content
        creatorName
        createdAt
      }
    }
  }
`;

export const LIKE_POST = gql`
  mutation LikePost($postId: ID!, $userId: ID!) {
    likePost(postId: $postId, userId: $userId) {
      id
      likes {
        id
        username
      }
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation CreateComment($postId: ID!, $creatorName: String!, $content: String!, $parentCommentId: ID) {
    createComment(postId: $postId, creatorName: $creatorName, content: $content, parentCommentId: $parentCommentId) {
      id
      content
      creatorName
      createdAt
      post {
        id
      }
      parentComment {
        id
      }
      replies {
        id
        content
      }
      likes {
        id
        username
      }
    }
  }
`;

export const LIKE_COMMENT = gql`
  mutation LikeComment($commentId: ID!, $userId: ID!) {
    likeComment(commentId: $commentId, userId: $userId) {
      id
      likes {
        id
        username
      }
    }
  }
`;

