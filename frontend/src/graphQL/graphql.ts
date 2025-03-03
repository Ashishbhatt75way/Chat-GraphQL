import { gql } from "@apollo/client";

export const SIGNUP_MUTATION = gql`
  mutation Signup($name: String!, $email: String!, $password: String!) {
    createUser(name: $name, email: $email, password: $password) {
      id
      name
      email
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      refreshToken
    }
  }
`;

export const GET_ME = gql`
  query me {
    me {
      id
      name
      email
    }
  }
`;

export const GET_USERS = gql`
  query users {
    users {
      id
      name
      email
    }
  }
`;

export const CREATE_MESSAGE_MUTATION = gql`
  mutation createMessage($content: String!, $receiverId: String!) {
    createMessage(content: $content, receiverId: $receiverId) {
      id
      content
      createdAt
      sender {
        id
        name
      }
      receiver {
        id
        name
      }
    }
  }
`;

export const GET_MESSAGES_QUERY = gql`
  query getMessages($receiverId: String!) {
    getMessages(receiverId: $receiverId) {
      content
      createdAt
      sender {
        id
        name
      }
      receiver {
        id
        name
      }
    }
  }
`;
