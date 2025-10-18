import { CreditCard } from "lucide-react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export const NavBar = () => {
  const { openConnectModal } = useConnectModal();
  const { isConnected, address, chain } = useAccount();
  // const { disconnect } = useDisconnect();
  // const handleLogout = () => {
  //   disconnect();
  // };
  const handleConnectWallet = () => {
    openConnectModal?.();
  };
  return (
    <nav className="flex justify-between p-2 px-4 ">
      <div className="flex gap-2 items-center justify-center">
        <img src="./logo.png" className="w-5 h-5" />
        Token Portfolio
      </div>

      {isConnected ? (
        <div className="flex p-2 bg-[#a9e851] text-[#000000] rounded-full items-center justify-center px-6 gap-2">
          <div>{address}</div>
          <div>({chain?.name})</div>
        </div>
      ) : (
        <button
          className="flex p-2 bg-[#a9e851] text-[#000000] rounded-full px-6 items-center justify-center gap-2"
          onClick={handleConnectWallet}
        >
          <CreditCard size={20} color="#000000" strokeWidth={2} />
          Connect Wallet
        </button>
      )}
    </nav>
  );
};
