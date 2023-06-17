## branch:frontend_post_updoot

The main things supporting this part are:
* The front end adds post, including creating, editing, deleting and a single post page;
* updoot function;
* pagination, homepage posts fetch 15 posts at a time through the load more button at the bottom of the page, and render on the basis of the original posts.
* The single post page supports markdown format;
* The CV page supports pdf display and download functions;



First install the relevant package:
```bash
npm install @types/react-pdf
npm install react-markdown
```

---
### post related functions

Create a new post-related grapqhl file under the grapqhl folder:
queries folder:
- post.graphql
- posts.graphql
- post.graphql

mutations folder:
- createPost.graphql
- deletePost.graphql
- updatePost.graphql

Use the command to generate the hook function:
```bash
npm run gen
```
(Delete redundant code in graphql.ts)

Create a new folder under the pages folder to place post related files, and create a new file under the post folder:
- Create-post.ts
- Edit-post.ts
- Single-post.ts
In addition, in order to add styles to Single-post, you need to create a new `Single.css`

The create post function needs to be logged in before it can be used, so a function needs to be added to judge the login status
If you are not currently logged in, jump to the login interface
Create a new `userIsAuth.ts` file under the utils folder, and export the above functions

The following evict function is used in the hook function to update the cache:
```typescript
<Formik
  initialValues={{ title: "", text: "" }}
  onSubmit={async (values) => {
    const { errors } = await createPost({
      variables: { input: values },
      update: (cache) => {
        cache.evict({ fieldName: "posts:{}" });
      },
    });
    if (!errors) {
      navigate("/");
    }
  }}
>
```
Since the edit box needed for the post editing page is large, it is necessary to modify the InputField component under the component folder
Use the multiline attribute in MUI's TextField to set a multiline input box
Note: There is a conflict between the multiline and type attributes. After using multiline, the type of password is not supported. Therefore, it is necessary to determine which attribute to use through the input parameters.

Editing a post page requires 2 buttons:
edit and delete
Create a new file EditDeletePostButtons.tsx under the component folder
The logic of this component is:
- Determine whether the currently logged in user is the creator of this post, otherwise return null
- Jump to the edit page or delete the post according to the post id
---
### updoot related functions

Create related files under the graphql folder:
Create the file vote.graphql in the mutations folder
Create a new frgments folder, and create a file PostSnippet.graphql below to define the post format (this file can be reused by other files under graphql)

Use npm run gen to generate related hooks

Create a new file, UpdootSection.tsx, under the component folder to define the two buttons for likes and offs and the number of updots and offs for the corresponding posts.
Here, the database read and write and cache operations are processed separately to improve the interface display speed.
Functions for manipulating the cache:

```typescript
const updateAfterVote = (
  value: number, // The value of the vote, which may be positive or negative
  postId: number, // ID of the post
  cache: ApolloCache<VoteMutation> // Apollo cache object
) => {
  // read data for a specific post from cache
  const data = cache.readFragment<{
    id: number;
    points: number;
    voteStatus: number | null;
  }>({
    id: "Post:" + postId, // Build a cache key based on the post ID
    // Define a GraphQL fragment for reading specific fields of a post
    fragment: gql`
      fragment _ on Post {
        id
        points
        voteStatus
      }
    `,
  });

  // If the data is read from the cache
  if (data) {
    // If the previous voting status is the same as the current voting value, return directly without performing subsequent operations
    if (data.voteStatus === value) {
      return;
    }
    // Calculate the new number of likes
    const newPoints =
      (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
    // Update the post data in the cache
    cache.writeFragment({
      id: "Post:" + postId,
      fragment: gql`
        fragment __ on Post {
          points
          voteStatus
        }
      `,
      data: { points: newPoints, voteStatus: value }, // updated post data
    });
  }
};
```
---
### pagination related functions

First, use the card component of MUI to display post information on the home page, including:
- Creator Avatar
- release time
- first 50 characters of post
- updoot information
- The post created by the current user also needs to display the edit and delete buttons, and the post not created by the current user does not display these two buttons

The implementation of pagination is the cursor method, the code is as follows:
```typescript
const { data, loading, error, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 5, // Limit the number of posts to query
      cursor: null, // Cursor, used for pagination query, indicating from which position to start getting posts
    },
    notifyOnNetworkStatusChange: true, // Send a notification when the network status changes
  });

  // If data loading is complete and no data is returned
  if (!loading && !data) {
    return (
      <div>
        <div>you got query failed for some reason</div>
        <div>{error?.message}</div>
      </div>
    );
  }

  // Define function that handles loading more posts
  const handleFetchMore = () => {
    fetchMore({
      variables: {
        limit: variables?.limit, // continue to use the same post count limit
        cursor: data?.posts.posts[data.posts.posts.length - 1].createdAt, // Use the creation time of the current last post as a new cursor
      },
      updateQuery: (prevData, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prevData;
        return {
          posts: {
            __typename: prevData.posts.__typename,
            hasMore: fetchMoreResult.posts.hasMore, // Update status if there are more posts
            posts: [...prevData.posts.posts, ...fetchMoreResult.posts.posts], // Add the newly fetched post to the existing list of posts
          },
        };
      },
    });
  };
```
---
### single post related functions

Create under the post folder in the folder pages:
- Single-post.tsx is used to display the specific content of a single post
- Single-post.css creates a single post display style

Use `ReactMarkdown` component to display post body content
The relevant format of markdown is defined in `Single-post.css`

---
### pdf display and download function

Create the file `CV.tsx` under the folder pages

Use the `Document`, `Page`, and `pdfjs` of the react-pdf library to realize the display function of PDF