import { signInWithPopup, signOut } from "firebase/auth";
import { auth, firestore, googleAuthProvider } from "../lib/firebase";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../lib/context";
import { doc, getDoc, writeBatch } from "firebase/firestore";
import Image from "next/image";
import debounce from "lodash.debounce";
import bearPic from "../public/bear.jpeg";
import googleLogo from "../public/google-logo.jpeg";

export default function EnterPage({}) {
  const { user, username } = useContext(UserContext);

  return (
    <main>
      {user ? (
        !username ? (
          <UserNameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
}

function SignInButton() {
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch {
      console.warn("SignIn Closed by user");
    }
  };

  return (
    <>
      <button className="btn-google" onClick={signInWithGoogle}>
        <Image width={25} height={25} src={googleLogo} alt="Google logo" />
        <span>Sign in with Google</span>
      </button>
      <Image
        width={1200}
        height={700}
        src={bearPic}
        placeholder="blur"
        alt="bear picture"
      />
    </>
  );
}

function SignOutButton() {
  return <button onClick={() => signOut(auth)}>Sign out</button>;
}

function UserNameForm() {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = doc(firestore, `usernames/${username}`);
        const docSnap = await getDoc(ref);
        console.log("Firestore read executed");
        setIsValid(!docSnap.exists());
        setLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue, checkUsername]);

  const onChange = (e) => {
    const val = e.target.value.toLowerCase();
    const regex = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (regex.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const userDoc = doc(firestore, `users/${user.uid}`);
    const usernameDoc = doc(firestore, `usernames/${formValue}`);

    const batch = writeBatch(firestore);
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    });
    batch.set(usernameDoc, { uid: user.uid });

    await batch.commit();
  };

  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input
            name="username"
            placeholder="username"
            value={formValue}
            onChange={onChange}
          ></input>

          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
          ></UsernameMessage>

          <button type="submit" className="btn-green" disabled={!isValid}>
            Choose
          </button>

          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  );

  function UsernameMessage({ username, isValid, loading }) {
    if (loading) {
      return <p>Checking...</p>;
    } else if (isValid) {
      return <p className="text-success">{username} is available!</p>;
    } else if (username && !isValid) {
      return <p className="text-danger">That username is taken!</p>;
    } else {
      return <p></p>;
    }
  }
}
