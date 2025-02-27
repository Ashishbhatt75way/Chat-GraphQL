import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    password: String!
    active: Boolean!
    email: String!
    messages: [Message!]!
  }

  type Message {
    id: ID!
    content: String!
    sender: String!
    receiver: String!
    user: User!
    createdAt: String!
  }

  type AuthPayload {
    accessToken: String!
    refreshToken: String!
  }

  type Query {
    hello: String
    users: [User!]!
    me: User
    messages: [Message!]!
    getMessage(id: ID!): Message
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!): User!
    createMessage(
      content: String!
      sender: String!
      receiver: String!
    ): Message!
    login(email: String!, password: String!): AuthPayload
    refreshToken(refreshToken: String!): AuthPayload
  }
`;
