import { gql } from 'apollo-server-express'

export const UserType = gql`
  type User {
    id: Int!
    firebaseUid: String!
    email: String
    username: String!
    gender: Gender
    birthDate: String
    prefectureId: Int
  }

  enum Gender {
    male
    female
    other
  }

  input CreateUserInput {
    username: String!
    gender: Gender
    birthDate: String!
    prefectureId: Int
  }

  type CreateUserResponse {
    id: Int!
  }

  type Query {
    me: User
  }

  type Mutation {
    createUser(input: CreateUserInput!): CreateUserResponse!
  }
`
