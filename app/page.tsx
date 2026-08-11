"use client";

import { useEffect, useState } from "react";

const digits = Array.from({ length: 10 }, (_, i) => i);

const SYMBOL = "1HZ100V";
const TICK_LIMIT = 1000;

export default function Home() {
  const [market, setMarket] = useState("");

  const [digitPercentages, setDigitPercentages] = useState<number[]>(
    Array(10).fill(0)
  );

  const [lastDigit, setLastDigit] = useState<number | null>(null);

  const [connectionStatus, setConnectionStatus] =
    useState("CONNECTING");

  const [ticksAnalyzed, setTicksAnalyzed] = useState(0);

  useEffect(() => {
    const ws = new WebSocket(
      "wss://api.derivws.com/trading/v1/options/ws/public"
    );

    ws.onopen = () => {
      setConnectionStatus("LIVE");

      ws.send(
        JSON.stringify({
          ticks_history: SYMBOL,
          count: TICK_LIMIT,
          end: "latest",
          style: "ticks",
          subscribe: 1,
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.msg_type === "history" && data.history?.prices) {
          const prices = data.history.prices.map(Number);

          updateDigitDistribution(prices);

          setTicksAnalyzed(
            Math.min(prices.length, TICK_LIMIT)
          );

          if (prices.length > 0) {
            const latestPrice =
              prices[prices.length - 1];

            setLastDigit(
              getLastDigit(latestPrice)
            );
          }
        }

        if (
          data.msg_type === "tick" &&
          data.tick?.quote !== undefined
        ) {
          const quote = Number(data.tick.quote);

          setLastDigit(getLastDigit(quote));
        }
      } catch (error) {
        console.error("Data error:", error);
      }
    };

    ws.onerror = () => {
      setConnectionStatus("ERROR");
    };

    ws.onclose = () => {
      setConnectionStatus("DISCONNECTED");
    };

    return () => {
      ws.close();
    };
  }, []);

  function getLastDigit(price: number): number {
    const priceString = price.toString();

    const decimalPart =
      priceString.split(".")[1] || "";

    if (decimalPart.length === 0) {
      return Math.abs(Math.floor(price)) % 10;
    }

    return Number(
      decimalPart[decimalPart.length - 1]
    );
  }

  function updateDigitDistribution(
    prices: number[]
  ) {
    if (!prices.length) return;

    const counts = Array(10).fill(0);

    prices.forEach((price) => {
      const digit = getLastDigit(
        Number(price)
      );

      if (digit >= 0 && digit <= 9) {
        counts[digit]++;
      }
    });

    const total = prices.length;

    const percentages = counts.map(
      (count) =>
        Number(
          ((count / total) * 100).toFixed(1)
        )
    );

    setDigitPercentages(percentages);
  }

  return (
    <main className="dashboard">

      {/* HEADER */}

      <header className="hero">

        <h1>Deriv Analyzer</h1>

        <p className="author">
          by Mwas Josayah
        </p>

        <p className="subtitle">
          Smart Market Analysis
        </p>

      </header>


      {/* MARKET TYPE */}

      <section className="card market-card">

        <h2>Market Type</h2>

        <div className="market-buttons">

          <button
            className={
              market === "over-under"
                ? "active"
                : ""
            }
            onClick={() =>
              setMarket("over-under")
            }
          >
            OVER / UNDER
          </button>

          <button
            className={
              market === "even-odd"
                ? "active"
                : ""
            }
            onClick={() =>
              setMarket("even-odd")
            }
          >
            EVEN / ODD
          </button>

          <button
            className={
              market === "differs-matches"
                ? "active"
                : ""
            }
            onClick={() =>
              setMarket("differs-matches")
            }
          >
            DIFFERS / MATCHES
          </button>

        </div>

      </section>


      {/* DIGIT DISTRIBUTION */}

      <section className="card digit-card">

        <div className="section-heading">

          <div>

            <h2>
              Digit Distribution
            </h2>

            <p>
              Live distribution of the last digits
            </p>

          </div>

          <span className="live-indicator">

            <span className="live-dot"></span>

            {connectionStatus}

          </span>

        </div>


        {/* TICK ANALYSIS */}

        <div className="tick-summary">

          <div className="tick-label">
            Analysis Sample
          </div>

          <div className="tick-number">
            {ticksAnalyzed.toLocaleString()}
          </div>

         
