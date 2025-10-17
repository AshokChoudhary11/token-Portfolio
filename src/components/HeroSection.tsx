import { useSelector } from "react-redux";
import { PortfolioSummary } from "./PortfolioSummary";
import { PortfolioChart } from "./PortfolioChart";
import type { RootState } from "../store/store";

export const HeroSection = () => {
  const tokens = useSelector((state: RootState) => state.watchlist.tokens);

  return (
    <div className="flex justify-between bg-[#27272a] m-4 p-4 py-3 rounded-lg">
      <div className="flex w-1/2">
        <PortfolioSummary tokens={tokens} />
      </div>
      <div className="flex flex-col justify-between gap-2 w-1/2">
        <div className="text-gray-400 text-lg">Portfolio Distribution</div>
        <PortfolioChart tokens={tokens} />
      </div>
    </div>
  );
};
