export default function Home() {
  return (
    <main className="dashboard">
      <header>
        <h1>Deriv Analyzer</h1>
        <p>by Mwas Josayah</p>
        <span>Smart Market Analysis</span>
      </header>

      <section className="market">
        <h2>Market Type</h2>

        <div className="market-buttons">
          <button>OVER / UNDER</button>
          <button>EVEN / ODD</button>
          <button>DIFFERS / MATCHES</button>
        </div>
      </section>

      <section className="card">
        <h2>Analysis</h2>
        <p>Waiting for market data...</p>
      </section>

      <section className="card">
        <h2>Prediction</h2>
        <strong>--</strong>
        <p>Confidence: --%</p>
      </section>
    </main>
  );
}
