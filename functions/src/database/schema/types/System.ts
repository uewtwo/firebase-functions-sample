export const CommonType = gql`
  type Query {
    hello: HelloResponse!
  }

  type HelloResponse {
    message: String!
  }
`
