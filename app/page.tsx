"use client";

import { useEffect, useState } from "react";

const digits = Array.from({ length: 10 }, (_, i) => i);

const SYMBOL = "1HZ100V";

const TICK_OPTIONS = [100, 500, 1000, 2000, 5000];

export default function Home() {
  const [market, setMarket] = useState("");

  const [tickLimit, setTickLimit] = useState(500);

  const [digitPercentages, setDigitPercentages] =
    useState<number[]>(Array(10).fill(0));

  const [lastDigit, setLastDigit] =
    useState<number | null>(null);

  const [connectionStatus, setConnectionStatus] =
    useState("CONNECTING");

  const [ticksAnalyzed, setTicksAnalyzed] =
    useState(0);

  /*
   * =========================
   * GET LAST DIGIT
   * =========================
   */

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

  /*
   * =========================
   * UPDATE DISTRIBUTION
   * =========================
   */

  function updateDigitDistribution(
    prices: number[]
  ) {
    if (!prices.length) return;

    const counts = Array(10).fill(0);

    prices.forEach((price) => {
      const digit = getLastDigit(Number(price));

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
    setTicksAnalyzed(total);
  }

  /*
   * =========================
   * DIGIT RANKING
   * =========================
   */

  function getDigitRankClass(
    digit: number
  ): string {
    const ranked = digitPercentages
      .map((percentage, index) => ({
        digit: index,
        percentage,
      }))
      .sort(
        (a, b) =>
          b.percentage - a.percentage
      );

    const highest = ranked[0]?.digit;
    const secondHighest = ranked[1]?.digit;
    const thirdHighest = ranked[2]?.digit;

    const lowest =
      ranked[ranked.length - 1]?.digit;

    const secondLowest =
      ranked[ranked.length - 2]?.digit;

    const thirdLowest =
      ranked[ranked.length - 3]?.digit;

    if (digit === highest) {
      return "rank-highest";
    }

    if (digit === secondHighest) {
      return "rank-second-highest";
    }

    if (digit === thirdHighest) {
      return "rank-third-highest";
    }

    if (digit === lowest) {
      return "rank-lowest";
    }

    if (digit === secondLowest) {
      return "rank-second-lowest";
    }

    if (digit === thirdLowest) {
      return "rank-third-lowest";
    }

    return "rank-normal";
  }

  /*
   * =========================
   * WEBSOCKET
   * =========================
   */

  useEffect(() => {
    setConnectionStatus("CONNECTING");
    setDigitPercentages(Array(10).fill(0));
    setTicksAnalyzed(0);
    setLastDigit(null);

    const ws = new WebSocket(
      "wss://api.derivws.com/trading/v1/options/ws/public"
    );

    let currentPrices: number[] = [];

    ws.onopen = () => {
      setConnectionStatus("LIVE");

      ws.send(
        JSON.stringify({
          ticks_history: SYMBOL,
          count: tickLimit,
          end: "latest",
          style: "ticks",
          subscribe: 1,
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        /*
         * =========================
         * HISTORICAL TICKS
         * =========================
         */

        if (
          data.msg_type === "history" &&
          data.history?.prices
        ) {
          currentPrices =
            data.history.prices
              .map(Number)
              .slice(-tickLimit);

          updateDigitDistribution(
            currentPrices
          );

          if (currentPrices.length > 0) {
            const latest =
              currentPrices[
                currentPrices.length - 1
              ];

            setLastDigit(
              getLastDigit(latest)
            );
          }
        }

        /*
         * =========================
         * LIVE TICK
         * =========================
         */

        if (
          data.msg_type === "tick" &&
          data.tick?.quote !== undefined
        ) {
          const quote =
            Number(data.tick.quote);

          /*
           * Add new tick
           */

          currentPrices = [
            ...currentPrices,
            quote,
          ];

          /*
           * Keep only selected sample
           */

          if (
            currentPrices.length >
            tickLimit
          ) {
            currentPrices =
              currentPrices.slice(
                -tickLimit
              );
          }

          /*
           * Recalculate percentages
           */

          updateDigitDistribution(
            currentPrices
          );

          /*
           * Update current digit
           */

          setLastDigit(
            getLastDigit(quote)
          );
        }
      } catch (error) {
        console.error(
          "Data error:",
          error
        );
      }
    };

    ws.onerror = () => {
      setConnectionStatus("ERROR");
    };

    ws.onclose = () => {
      setConnectionStatus(
        "DISCONNECTED"
      );
    };

    return () => {
      ws.close();
    };
  }, [tickLimit]);

  /*
   * =========================
   * PAGE
   * =========================
   */

  return (
    <main className="dashboard">

      {/* HEADER */}

      <header className="hero">

        <h1>
          Deriv Analyzer
        </h1>

        <p className="author">
          by Mwas Josayah
        </p>

        <p className="subtitle">
          Smart Market Analysis
        </p>

      </header>


      {/* MARKET TYPE */}

      <section className="card market-card">

        <h2>
          Market Type
        </h2>

        <div className="market-buttons">

          <button
            className={
              market === "over-under"
                ? "active"
                : ""
            }
            onClick={() =>
              setMarket(
                "over-under"
              )
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
              setMarket(
                "even-odd"
              )
            }
          >
            EVEN / ODD
          </button>

          <button
            className={
              market ===
              "differs-matches"
                ? "active"
                : ""
            }
            onClick={() =>
              setMarket(
                "differs-matches"
              )
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
              Live distribution of the
              last digits
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


          {/* TICK OPTIONS */}

          <div className="tick-buttons">

            {TICK_OPTIONS.map(
              (amount) => (

                <button
                  key={amount}
                  className={
                    tickLimit === amount
                      ? "tick-button active"
                      : "tick-button"
                  }
                  onClick={() =>
                    setTickLimit(amount)
                  }
                >
                  {amount.toLocaleString()}
                </button>

              )
            )}

          </div>


          <div className="tick-using">

            Using{" "}

            <strong>
              {tickLimit.toLocaleString()}
            </strong>{" "}

            ticks for analysis

          </div>


          <div className="tick-number">
            {ticksAnalyzed.toLocaleString()}
          </div>


          <div className="tick-label">
            TICKS ANALYZED
          </div>

        </div>


        {/* DIGIT CIRCLES */}

        <div className="digit-grid">

          {digits.map((digit) => (

            <div
              className="digit-item"
              key={digit}
            >

              {/* RED CURRENT TICK POINTER */}

              {lastDigit === digit && (
                <div className="tick-pointer">
                  <span></span>
                </div>
              )}


              {/* DIGIT CIRCLE */}

              <div
                className={
                  `digit-circle ${getDigitRankClass(
                    digit
                  )}`
                }
              >

                <span className="digit-number">
                  {digit}
                </span>

                <span className="digit-percent">
                  {digitPercentages[
                    digit
                  ].toFixed(1)}
                  %
                </span>

              </div>

            </div>

          ))}

        </div>


        {/* EXPECTED DISTRIBUTION */}

        <div className="distribution-info">

          <span>
            Expected distribution
          </span>

          <strong>
            10% per digit
          </strong>

        </div>

      </section>


      {/* LAST DIGIT */}

      <section className="card">

        <h2>
          Latest Digit
        </h2>

        <p>
          Latest detected digit:
        </p>

        <strong className="prediction-value">

          {lastDigit === null
            ? "--"
            : lastDigit}

        </strong>

      </section>


      {/* ANALYSIS */}

      <section className="card">

        <h2>
          Analysis
        </h2>

        <p>

          {market
            ? `Market selected: ${market
                .replace("-", " ")
                .toUpperCase()}`
            : "Select a market and contract to begin analysis."}

        </p>

      </section>


      {/* PREDICTION */}

      <section className="card prediction-card">

        <h2>
          Prediction
        </h2>

        <strong className="prediction-value">
          --
        </strong>

        <p>
          Confidence: --%
        </p>

      </section>

    </main>
  );
}
