import { useMemo } from "react";
import type { CryptoData } from "./WatchList";

interface PortfolioSummaryProps {
  tokens: CryptoData[];
}

export const PortfolioSummary = ({ tokens }: PortfolioSummaryProps) => {
  const { totalValue, lastUpdated } = useMemo(() => {
    const validTokens = tokens.filter((t) => t.holdings > 0);
    const total = validTokens.reduce(
      (sum, t) => sum + t.current_price * t.holdings,
      0
    );
    const last = validTokens[0]?.last_updated || new Date().toISOString();
    return { totalValue: total, lastUpdated: last };
  }, [tokens]);

  return (
    <div className="flex flex-col justify-between">
      <div>
        <div className="text-lg text-gray-400">Portfolio Total</div>
        <div className="text-4xl">${totalValue.toFixed(2)}</div>
      </div>
      <div className="text-xs text-gray-400">
        Last updated:{" "}
        {new Date(lastUpdated).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })}
      </div>
    </div>
  );
};
