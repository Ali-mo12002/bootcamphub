import { gql } from '@apollo/client';

export const GET_USER = gql`
  query me {
    me {
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
