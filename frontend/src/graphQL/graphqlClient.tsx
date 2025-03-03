import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_BASE_URL;

const client = new ApolloClient({
  uri: GRAPHQL_URL,
  cache: new InMemoryCache(),
  headers: {
    authorization: `Bearer ${localStorage.getItem("access_token")}`,
  },
});

export { ApolloProvider, client };
