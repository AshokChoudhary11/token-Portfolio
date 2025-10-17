import { useState, useEffect, useRef } from "react";
import type { CryptoData } from "./WatchList";

interface HoldingInputProps {
  crypto: CryptoData;
  watchlist: CryptoData[];
  setWatchlist: (watchlist: CryptoData[]) => void;
  isEditing: boolean;
  onSave: () => void;
}

const HoldingInput: React.FC<HoldingInputProps> = ({
  crypto,
  watchlist,
  setWatchlist,
  isEditing,
  onSave,
}) => {
  const [value, setValue] = useState<number>(crypto.holdings || 0);
  const [savedValue, setSavedValue] = useState<number>(0);
  const [hasChanged, setHasChanged] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load saved value for this crypto once
  useEffect(() => {
    const savedList: CryptoData[] = JSON.parse(
      localStorage.getItem("WatchList") || "[]"
    );
    const savedCrypto = savedList.find((item) => item.id === crypto.id);
    const holdings = savedCrypto ? savedCrypto.holdings || 0 : 0;
    setSavedValue(holdings);
    setValue(holdings);
  }, [crypto.id]);

  // Focus input automatically when edit mode is on
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // Track if current value differs from saved value
  useEffect(() => {
    setHasChanged(value !== savedValue);
  }, [value, savedValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = parseFloat(e.target.value);
    setValue(newVal);
    const updatedList = watchlist.map((item) =>
      item.id === crypto.id ? { ...item, holdings: newVal } : item
    );
    setWatchlist(updatedList);
  };

  const handleSave = () => {
    const updatedList = watchlist.map((item) =>
      item.id === crypto.id ? { ...item, holdings: value } : item
    );

    // Save only here
    localStorage.setItem("WatchList", JSON.stringify(updatedList));
    setSavedValue(value);
    setHasChanged(false);
    onSave();
  };

  // if not editing, show value only
  if (!isEditing) {
    return <span>{savedValue || 0}</span>;
  }

  // if editing, show input + save button
  return (
    <div className="flex items-center gap-2">
      <input
        ref={inputRef}
        type="number"
        value={value}
        onChange={handleChange}
        placeholder="0.00"
        className={`w-20 px-2 py-1 rounded  text-white ${
          hasChanged ? "outline" : " "
        } focus:outline-none focus:ring-2 focus:ring-[#a9e851]`}
      />
      {hasChanged && (
        <button
          onClick={handleSave}
          className="px-3 py-1 rounded bg-[#a9e851] text-black font-medium hover:bg-[#95d43d] transition-colors"
        >
          Save
        </button>
      )}
    </div>
  );
};

export default HoldingInput;
