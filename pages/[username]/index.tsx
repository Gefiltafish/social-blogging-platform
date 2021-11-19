import {
  collection,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query as firestoreQuery,
  where,
} from "firebase/firestore";
import React from "react";
import PostFeed from "../../components/PostFeed";
import UserProfile from "../../components/UserProfile";
import { getUserWithUsername, postToJSON } from "../../lib/firebase";
import { GetServerSideProps } from "next";
import Metatags from "../../components/Metatags";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;

  let userDoc;
  if (typeof query.username === "string") {
    userDoc = await getUserWithUsername(query.username);
  } else {
    userDoc = await getUserWithUsername(query.username[0]);
  }

  if (!userDoc) {
    return {
      notFound: true,
    };
  }

  let user = null;
  let posts = null;

  if (userDoc) {
    user = userDoc.data();

    const postsQuery = firestoreQuery(
      collection(userDoc.ref, "posts"),
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      limit(5)
    );
    const querySnapshot = await getDocs(postsQuery);
    posts = querySnapshot.docs.map(postToJSON);
  }

  return {
    props: { user, posts },
  };
};

export default function UserProfilePage({ user, posts }) {
  return (
    <main>
      <Metatags title="user profile page"></Metatags>

      <UserProfile user={user}></UserProfile>
      <PostFeed posts={posts}></PostFeed>
    </main>
  );
}
