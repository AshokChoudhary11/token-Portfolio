import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { updateHoldings } from "../store/watchlistSlice";
import type { CryptoData } from "./WatchList";

interface HoldingInputProps {
  crypto: CryptoData;
  isEditing: boolean;
  onSave: () => void;
}

const HoldingInput: React.FC<HoldingInputProps> = ({
  crypto,
  isEditing,
  onSave,
}) => {
  const [value, setValue] = useState<number>(crypto.holdings || 0);
  const [savedValue, setSavedValue] = useState<number>(crypto.holdings || 0);
  const [hasChanged, setHasChanged] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    setValue(crypto.holdings || 0);
    setSavedValue(crypto.holdings || 0);
  }, [crypto.holdings]);

  useEffect(() => {
    if (isEditing && inputRef.current) inputRef.current.focus();
  }, [isEditing]);

  useEffect(() => {
    setHasChanged(value !== savedValue);
  }, [value, savedValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = parseFloat(e.target.value);
    setValue(newVal);
  };

  const handleSave = () => {
    dispatch(updateHoldings({ id: crypto.id, holdings: value }));
    setSavedValue(value);
    setHasChanged(false);
    onSave();
  };

  if (!isEditing) return <span>{savedValue || 0}</span>;

  return (
    <div className="flex items-center gap-2">
      <input
        ref={inputRef}
        type="number"
        value={value}
        onChange={handleChange}
        placeholder="0.00"
        className={`w-20 px-2 py-1 rounded text-white ${
          hasChanged ? "outline" : ""
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
