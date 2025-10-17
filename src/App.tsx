import "./App.css";
import { HeroSection } from "./components/HeroSection";
import { NavBar } from "./components/Navbar";
import { WatchList } from "./components/WatchList";

function App() {
 
  return (
    <div className="bg-[#212124] min-h-screen text-white">
      <NavBar />
      <HeroSection />
      <WatchList />
    </div>
  );
}

export default App;
