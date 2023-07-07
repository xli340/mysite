import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const uri = process.env.NODE_ENV === "production" ? "/graphql" : "http://localhost:4000/graphql";

const client = new ApolloClient({
  uri: uri,
  cache: new InMemoryCache(),
  credentials: "include",
  headers: { "X-Forwarded-Proto": "https" },
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root") as HTMLElement
);