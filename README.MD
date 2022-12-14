<p align="center">
  <img src="https://imgur.com/9Xg8trr.png" width="720" title="Whatsapp">
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg"></a>
  <a href="https://github.com/HubertRyanOfficial/firebase-batch-hook"><img src="https://img.shields.io/github/stars/HubertRyanOfficial/firebase-batch-hook"></a>
  <a href="https://www.npmjs.com/package/firebase-batch-hook"><img src="https://img.shields.io/npm/dm/firebase-batch-hook.svg"></a> 
</p>

# Firebase Batch Hook

A hook to make a batch **transaction with many firestore documents using firebase and firebase functions**. In some cases when we have applications made with firebase on a large scale of data to be updated or even created with a specific reference, we need to send this data in a way that does not happen so many unnecessary readings or transactions going through one by one with the for with each item. useBatch helps us a lot with this, let's see a little more.

One of the first things to know what a **hook** is for in our javascript ecosystem. This concept comes from the react js developers stack, but it works for everything in the javascript world. In short, they are small pieces of code that can be used as a hook inside the front-end components and be reused several times. If you want to know a little more, take a look at the official documentation on: https://reactjs.org/docs/hooks-intro.html

```bash
$ yarn add firebase-batch-hook

or

$ npm install firebase-batch-hook --save
```

## Getting Started

You know when we have that amount of transactions that we need to use both on the client side and on the server **functions**? That's right, we can reduce billing using this hook, reducing the amount of reads and transitions within a listener in **firebase functions** or even on the front-end side.

> Recommendation: It's worth remembering that it's not recommended so many batches on the front-end side using batch, so handle all this on the backend side using firebase functions.

This library will help you to assemble a complete patch of all documents after a call to the firestore, decreasing for example from **2000 reads to 4 at once**, that's why it's called batch. The two thousand documents will be divided by five objects within an array. Firebase's own batch firestore allows us to send transitions of five hundred documents at once, so this gives us the possibility of splitting if our amount of documents is greater than 500, and thus dividing into several batches and decreasing a lot. An example of the code below:

```js
import admin from "firebase-admin";
import useBatch from "firebase-batch-hook";

export function $updatePostsListener() {
  const postsRef = admin.firestore().collection("posts");
  const postsData = await postsRef.get();

  // Here an exact and ready structure to separate the amount of documents
  // for a certain amount of transitions and the rest we leave for a for, thus specifying what the
  // batch can do with these documents.
  const dataBatch = useBatch(postsData.docs);

  for await (const batchList of dataBatch) {
    let newBatch = admin.firestore().batch();

    for (const batchItem of batchList) {
      newBatch.delete(batchItem.ref);
    }

    await newBatch.commit();
  }

  ...
}
```

Here we find that firebase-batch-hook is a batch builder for firebase firestore! Below I will be showing an example with different methods from the firestore itself such as delete, update or set. If you don't know much about batch, you can read more about it here in the official firebase documentation: https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes

```js
...

export function $updatePostsListener() {

  const dataBatch = useBatch(allLikedPosts);

  for await (const batchList of dataBatch) {
    let newBatch = admin.firestore().batch();

    for (const batchItem of batchList) {
      newBatch.delete(
        admin
          .firestore()
          .collection("posts")
          .doc(batchItem)
          .collection("likes")
          .doc(userId)
      );
    }

    await newBatch.commit();
  }

  ...
}

```

## Rules

Inside firebase we have many security tips in case you have several disallowed readings and unexpected places. In security rules for transactions or batched writes, there is a limit of 20 document access calls for the entire atomic operation in addition to the normal 10 call limit for each single document operation in the batch.. If you want to know more here is the batch with firestore rules and limits from the official documentation: https://firebase.google.com/docs/firestore/manage-data/transactions#security_rules_limits

```js
service cloud.firestore {
  match /databases/{db}/documents {
    function prefix() {
      return /databases/{db}/documents;
    }
    match /chatroom/{roomId} {
      allow read, write: if request.auth != null && roomId in get(/$(prefix())/users/$(request.auth.uid)).data.chats
                            || exists(/$(prefix())/admins/$(request.auth.uid));
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId
                            || exists(/$(prefix())/admins/$(request.auth.uid));
    }
    match /admins/{userId} {
      allow read, write: if request.auth != null && exists(/$(prefix())/admins/$(request.auth.uid));
    }
  }
}

```

## You got it! ????????

This repository is worth thanking <a href="https://github.com/Arkadina">@Arkadina</a> for helping to code this library in its first versions.
Thank you very much, I hope I have helped the great React community. ???????

<p align="center">
  <img src="https://imgur.com/nIAoYGc.png" width="300" title="Whatsapp">
</p>
