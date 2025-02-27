import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:5000/",
  cache: new InMemoryCache(),
  headers: {
    authorization: `Bearer ${localStorage.getItem("access_token")}`,
  },
});

export { ApolloProvider, client };
