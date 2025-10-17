import { useState, useEffect } from "react";
import CryptoPieChart from "./CryptoPieChart";

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  holdings: number;
}

export const HeroSection = () => {
  const [cryptoData, setCryptoData] = useState<
    { name: string; percentage: number; color: string }[]
  >([]);
  const [totalValue, setTotalValue] = useState<number>(0);

  // Function to calculate & update portfolio
  const updatePortfolio = () => {
    const stored = localStorage.getItem("WatchList");
    if (!stored) {
      setCryptoData([]);
      setTotalValue(0);
      return;
    }

    const parsed: CryptoData[] = JSON.parse(stored);
    const validTokens = parsed.filter((token) => token.holdings > 0);

    if (validTokens.length === 0) {
      setCryptoData([]);
      setTotalValue(0);
      return;
    }

    const total = validTokens.reduce(
      (sum, token) => sum + token.current_price * token.holdings,
      0
    );

    const colors = [
      "#16a34a",
      "#7c3aed",
      "#f97316",
      "#06b6d4",
      "#ef4444",
      "#22c55e",
      "#3b82f6",
    ];

    const formatted = validTokens.map((token, index) => ({
      name: `${token.name} (${token.symbol.toUpperCase()})`,
      percentage: ((token.current_price * token.holdings) / total) * 100,
      color: colors[index % colors.length],
    }));

    setTotalValue(total);
    setCryptoData(formatted);
  };

  // Run once on mount
  useEffect(() => {
    updatePortfolio();

    // Listen for changes to localStorage from other components or tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "WatchList") {
        updatePortfolio();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    // Cleanup listener
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Also watch for in-tab updates (when same React app updates localStorage)
  useEffect(() => {
    const interval = setInterval(() => {
      updatePortfolio();
    }, 1000); // check every second — lightweight
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-between bg-[#27272a] m-4 p-4 py-3 rounded-lg">
      <div className="flex flex-col justify-between w-1/2">
        <div className="flex flex-col gap-2">
          <div className="text-lg text-gray-400">Portfolio Total</div>
          <div className="text-4xl">${totalValue.toFixed(2)}</div>
        </div>
        <div className="text-xs text-gray-400">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
      <div className="flex flex-col justify-between gap-2 w-1/2">
        <div className="text-gray-400 text-lg">Portfolio Total</div>
        {cryptoData.length > 0 ? (
          <CryptoPieChart data={cryptoData} />
        ) : (
          <div className="text-gray-500 text-sm">No holdings yet.</div>
        )}
      </div>
    </div>
  );
};
