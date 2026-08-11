"use client";

import { useState } from "react";

const digits = Array.from({ length: 10 }, (_, i) => i);

export default function Home() {
  const [market, setMarket] = useState("");

  return (
    <main className="dashboard">

      {/* HEADER */}
      <header className="hero">
        <h1>Deriv Analyzer</h1>
        <p className="author">by Mwas Josayah</p>
        <p className="subtitle">Smart Market Analysis</p>
      </header>

      {/* MARKET TYPE */}
      <section className="card market-card">
        <h2>Market Type</h2>

        <div className="market-buttons">

          <button
            className={market === "over-under" ? "active" : ""}
            onClick={() => setMarket("over-under")}
          >
            OVER / UNDER
          </button>

          <button
            className={market === "even-odd" ? "active" : ""}
            onClick={() => setMarket("even-odd")}
          >
            EVEN / ODD
          </button>

          <button
            className={market === "differs-matches" ? "active" : ""}
            onClick={() => setMarket("differs-matches")}
          >
            DIFFERS / MATCHES
          </button>

        </div>
      </section>

      {/* DIGIT DISTRIBUTION */}
      <section className="card digit-card">

        <div className="section-heading">

          <div>
            <h2>Digit Distribution</h2>
            <p>Live distribution of the last digits</p>
          </div>

          {/* LIVE INDICATOR */}
          <span className="live-indicator">
            <span className="live-dot"></span>
            LIVE
          </span>

        </div>

        {/* DIGIT CIRCLES */}
        <div className="digit-grid">

          {digits.map((digit) => (
            <div className="digit-item" key={digit}>

              <div className="digit-circle">
                <span className="digit-number">{digit}</span>
                <span className="digit-percent">--%</span>
              </div>

            </div>
          ))}

        </div>

        {/* EXPECTED DISTRIBUTION */}
        <div className="distribution-info">
          <span>Expected distribution</span>
          <strong>10% per digit</strong>
        </div>

      </section>

      {/* ANALYSIS */}
      <section className="card">
        <h2>Analysis</h2>

        <p>
          {market
            ? "Market selected. Analysis will appear here."
            : "Select a market and contract to begin analysis."}
        </p>
      </section>

      {/* PREDICTION */}
      <section className="card prediction-card">
        <h2>Prediction</h2>

        <strong className="prediction-value">--</strong>

        <p>
          Confidence: <span>--%</span>
        </p>
      </section>

    </main>
  );
}
