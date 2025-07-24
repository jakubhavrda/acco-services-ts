interface AdminProps {
  user: JSON;
  isAdmin: boolean;
}

const Admin = ({ user, isAdmin }: AdminProps) => {
  if (!isAdmin) {
    return <div className="error">Access Denied: You are not an admin.</div>;
  }

  return (
    <div className="admin">
      <h1>Admin Dashboard</h1>
      <p>
        Welcome to the admin dashboard. Here you can manage users, settings, and
        more.
      </p>
      <p>{JSON.stringify(user)}</p>
      {/* Additional admin functionalities can be added here */}
    </div>
  );
};
export default Admin;

// Dont worry about it rn!
