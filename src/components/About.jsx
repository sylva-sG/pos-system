function About({ onBack }) {
  return (
    <main className="about-page">
      <section className="about-content">
        <p className="section-kicker">
          ABOUT TECHPOINT
        </p>

        <h1>
          Simple tools for a smoother
          counter.
        </h1>

        <p className="about-description">
          TechPoint is a point-of-sale frontend
          designed for electronics and
          accessories stores.
        </p>

        <div className="about-sections">
          <section>
            <h2>What TechPoint does</h2>

            <p>
              Cashiers can browse products,
              search the catalogue, add products
              to a cart, manage quantities, hold
              sales, and complete transactions.
            </p>
          </section>

          <section>
            <h2>For store managers</h2>

            <p>
              Managers can review completed
              sales, manage products and stock,
              and register or remove cashier
              accounts.
            </p>
          </section>

          <section>
            <h2>Built for Phase 1</h2>

            <p>
              This version is built with React
              and JavaScript and uses the
              DummyJSON Products API for product
              data.
            </p>

            <p>
              Persistent accounts, sales records,
              and database functionality can be
              introduced in a later backend
              phase.
            </p>
          </section>
        </div>

        <button
          type="button"
          onClick={onBack}
        >
          ← Back to Home
        </button>
      </section>
    </main>
  );
}

export default About;
