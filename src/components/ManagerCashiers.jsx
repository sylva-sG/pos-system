import { useState } from "react";

function ManagerCashiers() {
  const [cashiers, setCashiers] = useState([
    {
      id: 1,
      name: "Cashier 1",
      sales: 0,
    },
    {
      id: 2,
      name: "Cashier 2",
      sales: 0,
    },
  ]);

  const [newCashier, setNewCashier] = useState("");

  const registerCashier = (e) => {
    e.preventDefault();

    if (!newCashier.trim()) {
      return;
    }

    setCashiers([
      ...cashiers,
      {
        id: Date.now(),
        name: newCashier.trim(),
        sales: 0,
      },
    ]);

    setNewCashier("");
  };

  const removeCashier = (id) => {
    setCashiers(
      cashiers.filter((cashier) => cashier.id !== id)
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
            value={newCashier}
            onChange={(e) =>
              setNewCashier(e.target.value)
            }
            placeholder="Enter cashier name"
          />

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
              key={cashier.id}
            >
              <div>
                <strong>{cashier.name}</strong>

                <p>
                  Sales: KSh{" "}
                  {cashier.sales.toLocaleString()}
                </p>
              </div>

              <button
                onClick={() =>
                  removeCashier(cashier.id)
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