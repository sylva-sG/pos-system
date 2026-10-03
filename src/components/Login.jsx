import { useState } from "react";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please enter your username and password.");
      return;
    }

    const users = [
      {
        username: "cashier",
        password: "cashier123",
        role: "cashier",
      },
      {
        username: "manager",
        password: "manager123",
        role: "manager",
      },
    ];

    const user = users.find(
      (account) =>
        account.username === username &&
        account.password === password
    );

    if (!user) {
      setError("Invalid username or password.");
      return;
    }

    setError("");
    onLogin(user);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>TechPoint</h1>
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <label>Username</label>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />

          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          <button type="submit">
            Login
          </button>
        </form>

        <div className="demo-accounts">
          <p>Demo accounts:</p>
          <p>Cashier: cashier / cashier123</p>
          <p>Manager: manager / manager123</p>
        </div>
      </div>
    </div>
  );
}

export default Login;