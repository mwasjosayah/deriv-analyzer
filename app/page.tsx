"use client";

import { useState } from "react";

type MarketType = "over-under" | "even-odd" | "differs-matches" | null;

export default function Home() {
  const [marketType, setMarketType] = useState<MarketType>(null);
  const [contract, setContract] = useState<string | null>(null);

  const selectMarket = (type: MarketType) => {
    setMarketType(type);
    setContract(null);
  };

  return (
    <main className="dashboard">
      <header>
        <h1>Deriv Analyzer</h1>
        <p>by Mwas Josayah</p>
        <span>Smart Market Analysis</span>
      </header>

      <section className="market">
        <h2>Market Type</h2>

        <button onClick={() => selectMarket("over-under")}>
          OVER / UNDER
        </button>

        <button onClick={() => selectMarket("even-odd")}>
          EVEN / ODD
        </button>

        <button onClick={() => selectMarket("differs-matches")}>
          DIFFERS / MATCHES
        </button>

        {marketType === "over-under" && (
          <div className="contract-options">
            <h3>Select Contract</h3>

            <button onClick={() => setContract("Over 2")}>
              Over 2
            </button>

            <button onClick={() => setContract("Under 7")}>
              Under 7
            </button>
          </div>
        )}

        {marketType === "even-odd" && (
          <div className="contract-options">
            <h3>Select Contract</h3>

            <button onClick={() => setContract("Even")}>
              Even
            </button>

            <button onClick={() => setContract("Odd")}>
              Odd
            </button>
          </div>
        )}

        {marketType === "differs-matches" && (
          <div className="contract-options">
            <h3>Select Contract</h3>

            <button onClick={() => setContract("Differs")}>
              Differs
            </button>

            <button onClick={() => setContract("Matches")}>
              Matches
            </button>
          </div>
        )}
      </section>

      <section className="card">
        <h2>Analysis</h2>

        {contract ? (
          <>
            <p>
              Selected Market: <strong>{contract}</strong>
            </p>

            <p>Waiting for live market data...</p>
          </>
        ) : (
          <p>Select a market and contract to begin analysis.</p>
        )}
      </section>

      <section className="card">
        <h2>Prediction</h2>

        <strong>--</strong>

        <p>Confidence: --%</p>
      </section>
    </main>
  );
}
