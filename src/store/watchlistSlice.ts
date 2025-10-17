import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CryptoData } from "../components/WatchList";

interface WatchlistState {
  tokens: CryptoData[];
}

const initialState: WatchlistState = {
  tokens: JSON.parse(localStorage.getItem("WatchList") || "[]"),
};

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState, 
  reducers: {
    setWatchlist(state, action: PayloadAction<CryptoData[]>) {
      state.tokens = action.payload;
      localStorage.setItem("WatchList", JSON.stringify(state.tokens));
    },
    updateHoldings(
      state,
      action: PayloadAction<{ id: string; holdings: number }>
    ) {
      const { id, holdings } = action.payload;
      const token = state.tokens.find((t) => t.id === id);
      if (token) token.holdings = holdings;
      localStorage.setItem("WatchList", JSON.stringify(state.tokens));
    },
    removeToken(state, action: PayloadAction<string>) {
      state.tokens = state.tokens.filter((t) => t.id !== action.payload);
      localStorage.setItem("WatchList", JSON.stringify(state.tokens));
    },
    addTokens(state, action: PayloadAction<CryptoData[]>) {
      const newTokens = action.payload.filter(
        (t) => !state.tokens.some((st) => st.id === t.id)
      );
      state.tokens.push(...newTokens);
      localStorage.setItem("WatchList", JSON.stringify(state.tokens));
    },
    updatePrices(state, action: PayloadAction<CryptoData[]>) {
      action.payload.forEach((updated) => {
        const token = state.tokens.find((t) => t.id === updated.id);
        if (token) {
          Object.assign(token, {
            ...updated,
            holdings: token.holdings, // keep holdings intact
          });
        }
      });
      localStorage.setItem("WatchList", JSON.stringify(state.tokens));
    },
  },
});

export const {
  setWatchlist,
  updateHoldings,
  removeToken,
  addTokens,
  updatePrices,
} = watchlistSlice.actions;

export default watchlistSlice.reducer;
