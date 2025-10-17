import CryptoPieChart from "./CryptoPieChart";
import type { CryptoData } from "./WatchList";

interface PieData {
  name: string;
  percentage: number;
  color: string;
  last_updated: string;
}

interface PortfolioChartProps {
  tokens: CryptoData[];
}

export const PortfolioChart = ({ tokens }: PortfolioChartProps) => {
  const colors = [
    "#16a34a",
    "#7c3aed",
    "#f97316",
    "#06b6d4",
    "#ef4444",
    "#22c55e",
    "#3b82f6",
  ];

  const pieData: PieData[] = tokens
    .filter((t) => t.holdings > 0)
    .map((token, index, arr) => {
      const total = arr.reduce(
        (sum, t) => sum + t.current_price * t.holdings,
        0
      );
      return {
        name: `${token.name} (${token.symbol.toUpperCase()})`,
        percentage: ((token.current_price * token.holdings) / total) * 100,
        color: colors[index % colors.length],
        last_updated: token.last_updated || new Date().toISOString(),
      };
    });

  return pieData.length > 0 ? (
    <CryptoPieChart data={pieData} />
  ) : (
    <div className="text-gray-500 text-sm">No holdings yet.</div>
  );
};
