function ManagerSales({ sales = [] }) {
  const totalSales = sales.reduce(
    (total, sale) => total + sale.total,
    0
  );

  return (
    <main className="manager-content">
      <div className="manager-page-heading">
        <div>
          <p className="manager-page-kicker">
            SALES MANAGEMENT
          </p>

          <h2>Sales Made</h2>

          <p>
            View sales completed by cashiers.
          </p>
        </div>

        <div className="inventory-summary">
          <strong>
            KSh {totalSales.toLocaleString()}
          </strong>

          <span>Total Sales</span>
        </div>
      </div>

      <section className="manager-section">
        {sales.length === 0 ? (
          <p>No sales have been recorded yet.</p>
        ) : (
          sales.map((sale, index) => (
            <div className="sale-record" key={index}>
              <div>
                <h3>Sale #{index + 1}</h3>

                <p>
                  Cashier: {sale.cashier || "Unknown"}
                </p>

                <p>
                  Date:{" "}
                  {new Date(
                    sale.completedAt
                  ).toLocaleString()}
                </p>
              </div>

              <div>
                <strong>
                  KSh {sale.total.toLocaleString()}
                </strong>

                <p>
                  {sale.itemCount} item(s)
                </p>
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}

export default ManagerSales;