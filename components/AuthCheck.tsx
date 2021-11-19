import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";

export default function AuthCheck(props) {
  const { username } = useContext(UserContext);

  if (username) {
    return props.children;
  }
  if (props.fallback) {
    return props.fallback;
  }
  return <Link href="/enter">You must be signed in</Link>;
}
