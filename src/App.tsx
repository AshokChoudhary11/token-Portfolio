import { useEffect } from "react";
import "./App.css";
import { HeroSection } from "./components/HeroSection";
import { NavBar } from "./components/Navbar";
import { WatchList } from "./components/WatchList";
import { fetchCryptoData } from "./utils/data";

function App() {
  // const [data, setData] = useState();
  useEffect(() => {
    const loadData = async () => {
      const result = await fetchCryptoData();
      console.log("result", result  );
      // setData(result);
    };

    loadData();
  }, []); 
  return (
    <div className="bg-[#212124] min-h-screen text-white">
      <NavBar />
      <HeroSection />
      <WatchList />
    </div>
  );
}

export default App;
