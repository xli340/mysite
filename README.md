## branch:frontend_user

The main work of this branch is to create a basic framework from the front end, mainly including:
- Configuration of graphql code generator;
- Create register, login, changePassword, forgotPassword and other pages;
- Create a navigation bar component.

The technologies used are:
- Apollo client
- GraphQL Code Generator
- Material UI
- react route
- Formik

reference doc : [GraphQL Code Generator](https://the-guild.dev/graphql/codegen/docs/getting-started)

First, install package

```bash
npm install -D typescript
npm install @apollo/client graphql
npm install react-router-dom
npm install graphql
npm install -D @graphql-codegen/cli
npx graphql-code-generator init
npm install -D @graphql-codegen/client-preset
npm install -D @graphql-codegen/typescript-react-apollo
npm install formik
npm install @mui/material @emotion/react @emotion/styled
```

Apollo client needs to configure the header to use session and cookie for user authentication.
main.tsx code:
```typescript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
  credentials: "include",
  headers: { "X-Forwarded-Proto": "https" },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);

```
Create a new folder component under src, and create a reusable component in it:
- Layout.tsx
- NavBar.tsx
- Wrapper.tsx
- InputField.tsx

`Layout.tsx` is used to wrap NavBar and Wrapper
`NavBar.tsx` is the navigation bar
`Wrapper.tsx` is the main part of the page under the navigation bar
`InputField.tsx` is the component that submits the form, because both login and register need to submit the form, so it can be reused
`Home.tsx` currently puts Layout directly

Create a new generated folder, which is the output path of the graphql code generator generated code
The hook function is taken from graphql

About the configuration steps of code generator
```bash
- npm install graphql
```
```bash
- npm install -D @graphql-codegen/cli
```
```bash
- npx graphql-code-generator init
```
Choose the default react
- Then select the schema path
http://localhost:4000/graphql
- Then select the generated file storage path
src/graphql/**/*.graphql
The relevant names for the configuration are as follows:
```
    Welcome to GraphQL Code Generator!
    Answer few questions and we will setup everything for you.
  
? What type of application are you building? Application built with React
? Where is your schema?: (path or url) http://localhost:4000/graphql
? Where are your operations and fragments?: src/graphql/**/*.graphql
? Where to write the output: src/generated/graphql.tsx
? Do you want to generate an introspection file? No
? How to name the config file? codegen.yml
? What script in package.json should run the codegen? gen
```
```bash
npm install -D @graphql-codegen/client-preset
```
Install codegen's apollo plugin
```bash
npm install -D @graphql-codegen/typescript-react-apollo
```
Modify the yml file to add the apollo plugin and two typescript plugins
```yml
overwrite: true
schema: "http://localhost:4000/graphql"
documents: "src/graphql/**/*.graphql"
generates:
  src/generated/:
    preset: "client"
    plugins:
    - "typescript"
    - "typescript-operations"
    - 'typescript-react-apollo'
```

Create a new graphql folder, and create two folders, queries and mutations, below to store the graphql files required by the code generator
The structure is as follows:
- graphql
  - mutations
    - changePassword.graphql
    - forgotPassword.graphql
    - login.graphql
    - logout.graphql
    - register.graphql
  - queries
    - me.graphql

Install the plug-in GraphQL for VSCode to help check the syntax of graphql
graphql copied directly from the Apollo sandbox
After saving here, run npm run gen to generate the front-end hook function in the grapql.ts file under the generated folder

run
```
npm run gen
```
The required code is generated under the generated folder

Notice
The backend must be running before using the command npm run gen
The generated code grapqhl has duplicate definitions that need to be deleted manually (no solution has been found yet)

Define the route of the page in App.tsx:
```typescript
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/Forgot-password";
import ChangePassword from "./pages/Change-password"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/change-password/:token" element={<ChangePassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```
Some points in Register
- The usage of update:
The update section is a callback function used to update the Apollo cache. It is called after the form is submitted successfully, and receives two parameters: cache and {data}.
In this particular code segment, the function of the update segment is to update the "MeQuery" query results in the cache. It uses the cache.writeQuery method to write new query data to the cache. The updated data includes the "me" field after the user has successfully registered, which comes from data.register.user in the response data.
By updating the "MeQuery" in the cache, you can ensure that the application's state is updated and the user's latest data is displayed immediately after a successful registration. This avoids reissuing network requests to obtain the latest user information, which improves the responsiveness of the application.
Summary: The function of the update section is to update the "MeQuery" query result in the Apollo cache to ensure that the status of the application is updated immediately after the user's registration is successful.

- Usage of Formik:
onSubmit is a processing function for form submission, which receives two parameters: values and {setErrors}. Among them, values is the value object of the form field, and { setErrors } is an object containing various auxiliary functions provided by Formik.
The setErrors function is used to set error messages for form fields. It takes as a parameter an object whose keys are the names of the form fields and whose values are the corresponding error messages. By calling the setErrors function, you can assign error messages to form fields so that corresponding error messages are displayed when the form is rendered.
A common scenario for using setErrors is to display the error on the form by calling setErrors to set the error information of the corresponding field if a validation error occurs after the form is submitted.

- Analysis of toErrorMap code:
Record is a generic type provided in the TypeScript standard library. It is used to create an object type with specified key type and value type.
field indicates the field name, and message indicates the error message corresponding to the field.
The logic of the function is as follows:
1. Create an empty object errorMap to store the mapping between field names and corresponding error messages.
2. Traverse the errors array and process each FieldError object.
3. For each FieldError object, store its field attribute as the key and message attribute as the value in the errorMap object.
4. Finally, return the generated errorMap object.

Create a new folder utils under src to place some public functions that need to be used:
`isServer.ts`
`toErrorMap.ts`

The role of isServer.ts
code:
```tpyescript
export const isServer = () => typeof window === "undefined";
```
The function of this function is to determine whether the current code is executed on the server side.
The implementation logic of the function is judged by checking whether the window object is undefined. In the browser environment, window is one of the global objects and represents the browser window, but in the code executed on the server side, the window object does not exist.
Therefore, when this function is executed on the server side, the result of typeof window will be undefined, thus returning true to indicate that the current code is being executed on the server side; while in the browser environment, the result of typeof window will be object, thus returning false to indicate the current Code is not executed on the server side.

The role of toErrorMap.ts
code:
```tpyescript
import { FieldError } from "../generated/graphql";

export const toErrorMap = (errors: FieldError[]) => {
  const errorMap: Record<string, string> = {};
  errors.forEach(({ field, message }) => {
    errorMap[field] = message;
  });

  return errorMap;
};
```
This code is mainly called by Formik's setError
This code defines a function called toErrorMap that takes a parameter called errors, which is an array of FieldError. The role of the function is to convert the FieldError array into an error map.
The implementation logic of the function is as follows:
1. Create an empty object errorMap, whose type is Record<string, string>, to store the error map.
2. Use forEach to loop through each element in the errors array.
3. For each element, deconstruct the field and message attributes, which represent the wrong field and error message respectively.
4. Use the wrong field as the attribute of the errorMap object, use the error information as the attribute value, and store them in the errorMap object.
5. After the loop ends, errorMap is returned as the result.
In this way, by calling the toErrorMap function and passing in a FieldError array, you can get a mapping table with the error field as the key and the error information as the value, which is convenient for error handling or display of error information.

About Material UI

The main components used here are the following categories

- for creating a single page: `Link, Button, Grid`

- As a result of configuring Fomik to create the form: `FormControl, FormLabel, FormHelperText, TextField`

- for creating the navbar: `AppBar, Toolbar, MenuIcon`