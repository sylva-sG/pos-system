function ManagerSales({ sales = [] }) {
  const totalSales = sales.reduce(
    (total, sale) => total + sale.total,
    0
  );

  const cashierNames = [
    ...new Set(
      sales.map((sale) => sale.cashier)
    ),
  ];

  return (
    <main className="manager-content">
      <div className="manager-page-heading">
        <div>
          <p className="manager-page-kicker">
            SALES MANAGEMENT
          </p>

          <h2>Sales Made</h2>

          <p>
            View sales completed by each cashier.
          </p>
        </div>

        <div className="inventory-summary">
          <strong>
            KSh {totalSales.toLocaleString()}
          </strong>

          <span>Total Sales</span>
        </div>
      </div>

      {/* Cashier summary */}
      <section className="manager-section">
        <h3>Cashier Sales Summary</h3>

        {cashierNames.length === 0 ? (
          <p>No cashier sales yet.</p>
        ) : (
          <div className="cashier-sales-summary">
            {cashierNames.map((cashier) => {
              const cashierSales = sales.filter(
                (sale) =>
                  sale.cashier === cashier
              );

              const cashierTotal =
                cashierSales.reduce(
                  (total, sale) =>
                    total + sale.total,
                  0
                );

              return (
                <div
                  className="manager-card"
                  key={cashier}
                >
                  <h3>{cashier}</h3>

                  <p>
                    Sales:{" "}
                    <strong>
                      {cashierSales.length}
                    </strong>
                  </p>

                  <p>
                    Revenue:{" "}
                    <strong>
                      KSh{" "}
                      {cashierTotal.toLocaleString()}
                    </strong>
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Individual sales */}
      <section className="manager-section">
        <h3>Completed Sales</h3>

        {sales.length === 0 ? (
          <p>No sales have been recorded yet.</p>
        ) : (
          <div>
            {sales.map((sale, index) => (
              <div
                className="sale-record"
                key={sale.id || index}
              >
                <div>
                  <h3>Sale #{index + 1}</h3>

                  <p>
                    Cashier:{" "}
                    <strong>
                      {sale.cashier ||
                        "Unknown"}
                    </strong>
                  </p>

                  <p>
                    Date:{" "}
                    {new Date(
                      sale.completedAt
                    ).toLocaleString()}
                  </p>

                  <p>
                    Items:{" "}
                    {sale.itemCount}
                  </p>
                </div>

                <div>
                  <strong>
                    KSh{" "}
                    {sale.total.toLocaleString()}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default ManagerSales;