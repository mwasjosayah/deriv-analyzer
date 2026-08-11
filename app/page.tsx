"use client";

import { useEffect, useRef, useState } from "react";

const digits = Array.from({ length: 10 }, (_, i) => i);

const SYMBOL = "1HZ100V";

const TICK_OPTIONS = [100, 500, 1000, 2000, 5000];

export default function Home() {
  const [market, setMarket] = useState("");

  const [tickLimit, setTickLimit] = useState(1000);

  const [digitPercentages, setDigitPercentages] = useState<number[]>(
    Array(10).fill(0)
  );

  const [lastDigit, setLastDigit] = useState<number | null>(null);

  const [connectionStatus, setConnectionStatus] =
    useState("CONNECTING");

  const [ticksAnalyzed, setTicksAnalyzed] = useState(0);

  const tickBuffer = useRef<number[]>([]);

  useEffect(() => {
    tickBuffer.current = [];

    setDigitPercentages(Array(10).fill(0));
    setTicksAnalyzed(0);
    setConnectionStatus("CONNECTING");

    const ws = new WebSocket(
      "wss://api.derivws.com/trading/v1/options/ws/public"
    );

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
         * HISTORICAL TICKS
         */
        if (
          data.msg_type === "history" &&
          data.history?.prices
        ) {
          const prices =
            data.history.prices.map(Number);

          tickBuffer.current =
            prices.slice(-tickLimit);

          updateDigitDistribution(
            tickBuffer.current
          );

          setTicksAnalyzed(
            tickBuffer.current.length
          );

          if (tickBuffer.current.length > 0) {
            const latestPrice =
              tickBuffer.current[
                tickBuffer.current.length - 1
              ];

            setLastDigit(
              getLastDigit(latestPrice)
            );
          }

          return;
        }

        /*
         * LIVE TICK
         */
        if (
          data.msg_type === "tick" &&
          data.tick?.quote !== undefined
        ) {
          const quote = Number(
            data.tick.quote
          );

          const newDigit =
            getLastDigit(quote);

          /*
           * Move the red pointer to
           * the new current digit.
           */
          setLastDigit(newDigit);

          /*
           * Add new tick.
           */
          tickBuffer.current.push(quote);

          /*
           * Keep only selected number
           * of ticks.
           */
          if (
            tickBuffer.current.length >
            tickLimit
          ) {
            tickBuffer.current.shift();
          }

          /*
           * Recalculate distribution.
           */
          updateDigitDistribution(
            tickBuffer.current
          );

          setTicksAnalyzed(
            tickBuffer.current.length
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
      setConnectionStatus("DISCONNECTED");
    };

    return () => {
      ws.close();
    };

  }, [tickLimit]);


  /*
   * GET LAST DIGIT
   */
  function getLastDigit(
    price: number
  ): number {

    const priceString =
      price.toString();

    const decimalPart =
      priceString.split(".")[1] || "";

    if (decimalPart.length === 0) {
      return (
        Math.abs(
          Math.floor(price)
        ) % 10
      );
    }

    return Number(
      decimalPart[
        decimalPart.length - 1
      ]
    );
  }


  /*
   * CALCULATE DIGIT DISTRIBUTION
   */
  function updateDigitDistribution(
    prices: number[]
  ) {
    if (!prices.length) return;

    const counts = Array(10).fill(0);

    prices.forEach((price) => {
      const digit =
        getLastDigit(Number(price));

      if (
        digit >= 0 &&
        digit <= 9
      ) {
        counts[digit]++;
      }
    });

    const total =
      prices.length;

    const percentages =
      counts.map(
        (count) =>
          Number(
            (
              (count / total) *
              100
            ).toFixed(1)
          )
      );

    setDigitPercentages(
      percentages
    );
  }


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
              Live distribution of the last digits
            </p>

          </div>

          <span className="live-indicator">

            <span className="live-dot"></span>

            {connectionStatus}

          </span>

        </div>


        {/* TICK SELECTOR */}

        <div className="tick-selector">

          <div className="tick-selector-title">
            Analysis Sample
          </div>

          <div className="tick-options">

            {TICK_OPTIONS.map(
              (option) => (

                <button
                  key={option}
                  className={
                    tickLimit === option
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    setTickLimit(option)
                  }
                >
                  {option.toLocaleString()}
                </button>

              )
            )}

          </div>

          <div className="tick-selected">

            Using{" "}
            <strong>
              {tickLimit.toLocaleString()}
            </strong>{" "}
            ticks for analysis

          </div>

        </div>


        {/* TICK SUMMARY */}

        <div className="tick-summary">

          <div className="tick-number">

            {ticksAnalyzed.toLocaleString()}

          </div>

          <div className="tick-label">

            TICKS ANALYZED

          </div>

        </div>


        {/* DIGIT CIRCLES */}

        <div className="digit-grid">

          {digits.map(
            (digit) => (

              <div
                className={
                  `digit-item ${
                    lastDigit === digit
                      ? "current-digit"
                      : ""
                  }`
                }
                key={digit}
              >

                {/* RED TRIANGLE POINTER */}

                {lastDigit === digit && (
                  <div className="tick-pointer">
                    <span></span>
                  </div>
                )}

                <div className="digit-circle">

                  <span className="digit-number">
                    {digit}
                  </span>

                  <span className="digit-percent">

                    {digitPercentages[digit].toFixed(1)}%

                  </span>

                </div>

              </div>

            )
          )}

        </div>


        {/* CURRENT TICK */}

        <div className="current-tick">

          Current Tick:{" "}

          <strong>
            {lastDigit === null
              ? "--"
              : lastDigit}
          </strong>

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


      {/* LATEST DIGIT */}

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
