import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  query,
} from "firebase/firestore";
import { GetStaticPaths, GetStaticProps } from "next";
import { firestore, getUserWithUsername, postToJSON } from "../../lib/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import PostContent from "../../components/PostContent";
import AuthCheck from "../../components/AuthCheck";
import HeartButton from "../../components/HeartButton";
import Link from "next/link";

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { username, slug } = params;

  let userDoc;

  if (typeof username === "string")
    userDoc = await getUserWithUsername(username);
  else {
    userDoc = await getUserWithUsername(username[0]);
  }

  let post = null;
  let path = null;

  if (userDoc) {
    const postRef = doc(userDoc.ref, "posts", `${slug}`);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      post = postToJSON(postSnap);
    }

    path = postRef.path;
  }

  return {
    props: { post, path },
    revalidate: 5000,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const postsQuery = query(collectionGroup(firestore, "posts"));
  const querySnapshot = await getDocs(postsQuery);

  const paths = querySnapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
};

export default function Post(props) {
  const postRef = doc(firestore, props.path);

  const [realtimePost] = useDocumentData(postRef);
  console.log(realtimePost);

  const post = realtimePost || props.post;

  return (
    <main className={"container"}>
      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post?.heartCount || 0} 🤍</strong>
        </p>

        <AuthCheck
          fallback={
            <Link href="/enter">
              <button>💗 Sign up</button>
            </Link>
          }
        >
          <HeartButton postRef={postRef} />
        </AuthCheck>
      </aside>
    </main>
  );
}
