export const NavBar = () => {
  return (
    <nav className="flex justify-between p-2 px-4 ">
      <div className="flex gap-2 items-center justify-center">
        <img src="./logo.png" className="w-5 h-5"/>
        Token Portfolio
      </div>
      <button className="flex p-2 bg-[#a9e851] rounded-full items-center justify-center gap-2">
        <img src="/wallet.png" className="w-4 h-4"/>
        Connect Wallet
      </button>
    </nav>
  );
};
