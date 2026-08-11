"use client";

import { useState } from "react";

const digits = Array.from({ length: 10 }, (_, i) => i);

export default function Home() {
  const [market, setMarket] = useState("");

  return (
    <main className="dashboard">
      <header className="hero">
        <h1>Deriv Analyzer</h1>
        <p className="author">by Mwas Josayah</p>
        <p className="subtitle">Smart Market Analysis</p>
      </header>

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

      <section className="card digit-card">
        <div className="section-heading">
          <div>
            <h2>Digit Distribution</h2>
            <p>Live distribution of the last digits</p>
          </div>

          <span className="live-status">
            <span className="live-dot"></span>
            LIVE
          </span>
        </div>

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

        <div className="distribution-info">
          <span>Expected distribution</span>
          <strong>10% per digit</strong>
        </div>
      </section>

      <section className="card">
        <h2>Analysis</h2>

        {market ? (
          <p>
            {market === "over-under" && "Over / Under market selected."}
            {market === "even-odd" && "Even / Odd market selected."}
            {market === "differs-matches" &&
              "Differs / Matches market selected."}
          </p>
        ) : (
          <p>Select a market and contract to begin analysis.</p>
        )}
      </section>

      <section className="card prediction-card">
        <h2>Prediction</h2>

        <div className="prediction-value">--</div>

        <p>
          Confidence: <strong>--%</strong>
        </p>
      </section>
    </main>
  );
}
