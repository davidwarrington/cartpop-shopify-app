import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
} from "@apollo/client";
import { useAppBridge } from "@shopify/app-bridge-react";
import { userLoggedInFetch } from "../helpers";

const GraphQLProvider = ({ children }) => {
  const app = useAppBridge();

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      credentials: "include",
      fetch: userLoggedInFetch(app),
    }),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default GraphQLProvider;
