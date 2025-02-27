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
  mutation createMessage(
    $content: String!
    $sender: String!
    $receiver: String!
  ) {
    createMessage(content: $content, sender: $sender, receiver: $receiver) {
      id
      content
      sender
      receiver
      createdAt
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
