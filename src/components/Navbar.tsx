import { CreditCard } from "lucide-react";

export const NavBar = () => {
  return (
    <nav className="flex justify-between p-2 px-4 ">
      <div className="flex gap-2 items-center justify-center">
        <img src="./logo.png" className="w-5 h-5" />
        Token Portfolio
      </div>
      <button className="flex p-2 bg-[#a9e851] text-[#000000] rounded-full items-center justify-center gap-2">
        <CreditCard size={20} color="#000000" strokeWidth={2} />
        Connect Wallet
      </button>
    </nav>
  );
};
