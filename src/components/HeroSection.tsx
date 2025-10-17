import { useSelector } from "react-redux";
import { PortfolioSummary } from "./PortfolioSummary";
import { PortfolioChart } from "./PortfolioChart";
import type { RootState } from "../store/store";

export const HeroSection = () => {
  const tokens = useSelector((state: RootState) => state.watchlist.tokens);

  return (
    <div className="flex flex-col md:flex-row justify-between bg-[#27272a] m-4 p-4 rounded-lg gap-4">
      <div className="w-full mb-2 md:mb-0 md:w-1/2">
        <PortfolioSummary tokens={tokens} />
      </div>

      <div className="w-full md:w-1/2 flex flex-col justify-between gap-2">
        <div className="text-gray-400 font-medium text-lg text-left">Portfolio Total</div>
        <PortfolioChart tokens={tokens} />
      </div>
    </div>
  );
};
