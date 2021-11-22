export default function UserProfile({ user }) {
  return (
    <div className="box-center">
      <img
        src={user.photoURL || "/hacker.jpeg"}
        className="card-img-center"
        alt="user photo"
      />
      <p>
        <i>@{user.username}</i>
      </p>
      <h1>{user.displayName || "Anonymous User"}</h1>
    </div>
  );
}
