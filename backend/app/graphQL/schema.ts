import { gql } from "apollo-server-express";

export const typeDefs = gql`
  enum UserRole {
    ADMIN
    USER
  }

  type User {
    id: ID!
    name: String!
    role: UserRole!
    password: String!
    active: Boolean!
    email: String!
    messagesSent: [Message!]!
    messagesReceived: [Message!]!
    createdAt: String!
    updatedAt: String!
  }

  type Message {
    id: ID!
    content: String!
    sender: User!
    receiver: User!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    accessToken: String!
    refreshToken: String!
  }

  type Query {
    users: [User!]!
    me: User
    messages: [Message!]!
    getMessages(receiverId: String!): [Message!]
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!): User!
    createMessage(content: String!, receiverId: String!): Message!
    login(email: String!, password: String!): AuthPayload
    refreshToken(refreshToken: String!): AuthPayload
  }
`;
