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