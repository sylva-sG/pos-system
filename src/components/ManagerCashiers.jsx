import { useState } from "react";

function ManagerCashiers({ users = [], setUsers }) {
  const [newName, setNewName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  const cashiers = users.filter(
    (user) => user.role === "cashier"
  );

  const registerCashier = (e) => {
    e.preventDefault();

    const name = newName.trim();
    const username = newUsername.trim();
    const password = newPassword.trim();

    if (!name || !username || !password) {
      setError("Please fill in all cashier details.");
      return;
    }

    const usernameExists = users.some(
      (user) =>
        user.username.toLowerCase() ===
        username.toLowerCase()
    );

    if (usernameExists) {
      setError("That username is already in use.");
      return;
    }

    const newUser = {
      username,
      password,
      role: "cashier",
      name,
    };

    setUsers((currentUsers) => [
      ...currentUsers,
      newUser,
    ]);

    setNewName("");
    setNewUsername("");
    setNewPassword("");
    setError("");
  };

  const removeCashier = (username) => {
    setUsers((currentUsers) =>
      currentUsers.filter(
        (user) => user.username !== username
      )
    );
  };

  return (
    <main className="manager-content">
      <h2>Cashier Management</h2>

      <section className="manager-section">
        <h3>Register New Cashier</h3>

        <form
          className="cashier-form"
          onSubmit={registerCashier}
        >
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Cashier name"
          />

          <input
            type="text"
            value={newUsername}
            onChange={(e) =>
              setNewUsername(e.target.value)
            }
            placeholder="Username"
          />

          <input
            type="password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(e.target.value)
            }
            placeholder="Password"
          />

          {error && (
            <p className="login-error">{error}</p>
          )}

          <button type="submit">
            Register Cashier
          </button>
        </form>
      </section>

      <section className="manager-section">
        <h3>Registered Cashiers</h3>

        <div className="cashier-list">
          {cashiers.map((cashier) => (
            <div
              className="cashier-row"
              key={cashier.username}
            >
              <div>
                <strong>{cashier.name}</strong>

                <p>
                  Username: {cashier.username}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  removeCashier(cashier.username)
                }
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default ManagerCashiers;