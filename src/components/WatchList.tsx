import { useState, useEffect, useRef } from "react";
import HoldingInput from "./holdingInput";

export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  sparkline_in_7d: {
    price: number[];
  };
  market_cap: number;
  total_volume: number;
  holdings?: number;
}

const Sparkline = ({
  data,
  isPositive,
}: {
  data: number[];
  isPositive: boolean;
}) => {
  const color = isPositive ? "#10b981" : "#ef4444";
  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * 100;
      const y = (1 - val) * 30 + 5;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width="120" height="40" className="inline-block">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const normalizeSparkline = (prices: number[]) => {
  if (!prices || prices.length === 0) return [];

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min;

  if (range === 0) return prices.map(() => 0.5);

  return prices.map((price) => (price - min) / range);
};

export const WatchList = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTokens, setModalTokens] = useState<CryptoData[]>([]);
  const [modalPage, setModalPage] = useState(1);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalHasMore, setModalHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [watchlist, setWatchlist] = useState<CryptoData[]>([]);
  const modalScrollRef = useRef<HTMLDivElement>(null);
  const inProgressRef = useRef(false);
  const [loaded, setLoaded] = useState(false);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [openEditId, setOpenEditId] = useState<string | null>(null);
  // Number of rows per page
  const itemsPerPage = 10;

  // Calculate current slice of watchlist
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  console.log("pag", startIndex, endIndex, watchlist.length);
  const paginatedWatchlist = watchlist.slice(startIndex, endIndex);

  // Calculate total pages dynamically
  const totalPages = Math.max(1, Math.ceil(watchlist.length / itemsPerPage));
  const totalResults = watchlist.length;

  useEffect(() => {
    setCurrentPage(1);
  }, [watchlist]);

  const fetchModalTokens = async (page: number, append: boolean = false) => {
    if (inProgressRef.current || !modalHasMore) return;

    inProgressRef.current = true;
    setModalLoading(true);

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=15&page=${page}&sparkline=true`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch tokens");
      }

      const data = await response.json();

      if (data.length < 15) {
        setModalHasMore(false);
      }

      if (data.length === 0) {
        setModalHasMore(false);
        return;
      }

      if (append) {
        setModalTokens((prev) => [...prev, ...data]);
      } else {
        setModalTokens(data);
      }
    } catch (err) {
      console.error("Error fetching modal tokens:", err);
    } finally {
      setModalLoading(false);
      inProgressRef.current = false;
    }
  };

  const handleScroll = () => {
    if (!modalScrollRef.current || !modalHasMore || inProgressRef.current)
      return;

    const { scrollTop, scrollHeight, clientHeight } = modalScrollRef.current;

    // Trigger when user is within 100px of the bottom
    if (scrollHeight - scrollTop - clientHeight < 100) {
      const nextPage = modalPage + 1;
      setModalPage(nextPage);
      fetchModalTokens(nextPage, true);
    }
  };

  // const handleAddToken = () => {
  //   setIsModalOpen(true);
  //   setModalTokens([]);
  //   setModalPage(1);
  //   setModalHasMore(true);
  //   setSearchQuery("");
  //   inProgressRef.current = false;
  //   fetchModalTokens(1, false);
  // };

  const handleAddToken = () => {
    setIsModalOpen(true);
    setModalTokens([]);
    setModalPage(1);
    setModalHasMore(true);
    setSearchQuery("");
    inProgressRef.current = false;
    fetchModalTokens(1, false);

    // Initialize selection with current watchlist token IDs
    setSelectedTokens(watchlist.map((token) => token.id));
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalTokens([]);
    setModalPage(1);
    inProgressRef.current = false;
  };

  useEffect(() => {
    const saved = localStorage.getItem("WatchList");
    if (saved) setWatchlist(JSON.parse(saved));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("WatchList", JSON.stringify(watchlist));
    }
  }, [watchlist.length, loaded]);

  const isInWatchlist = (tokenId: string) => {
    return selectedTokens.some((item) => item === tokenId);
  };
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("td")) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const filteredTokens = searchQuery
    ? modalTokens.filter(
        (token) =>
          token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : modalTokens;

  return (
    <>
      <div className="text-white  m-4">
        <div>
          <div className="flex justify-between mb-4">
            <div className="text-2xl font-semibold">Watchlist</div>
            <div className="flex gap-4">
              <button
                // onClick={handleRefresh}
                className="rounded-lg bg-[#27272a] px-4 py-2 hover:bg-[#3f3f46] transition-colors"
              >
                Refresh Prices
              </button>
              <button
                onClick={handleAddToken}
                className="bg-[#a9e851] rounded-lg px-4 py-2 text-black font-medium hover:bg-[#95d43d] transition-colors"
              >
                + Add Token
              </button>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#27272a]">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-1/5">
                    Token
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-1/6">
                    Price
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-1/6">
                    24h %
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-1/6">
                    Sparkline (7d)
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-1/6">
                    Holdings
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-1/6">
                    Value
                  </th>
                  <th className="px-5 py-4 "></th>
                </tr>
              </thead>
              <tbody>
                {paginatedWatchlist.map((crypto) => (
                  <tr
                    key={crypto.id}
                    className="hover:bg-[#27272a] transition-colors "
                  >
                    <td className="px-5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-sm flex items-center justify-center">
                          <img src={crypto.image} alt="" />
                        </div>
                        <div className="flex items-center gap-1">
                          <div
                            className=""
                            title={crypto.name.length > 9 ? crypto.name : ""}
                          >
                            {crypto.name.length > 9
                              ? crypto.name.slice(0, 9) + "..."
                              : crypto.name}
                          </div>

                          <div className="text-xs text-gray-400">
                            ({crypto.symbol.toUpperCase()})
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5  text-sm">
                      $
                      {crypto.current_price.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td
                      className={`px-5 text-sm ${
                        crypto.price_change_percentage_24h >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {crypto.price_change_percentage_24h >= 0 ? "+" : ""}
                      {crypto.price_change_percentage_24h?.toFixed(2) || "0.00"}
                      %
                    </td>
                    <td className="px-5">
                      {crypto.sparkline_in_7d?.price ? (
                        <Sparkline
                          data={normalizeSparkline(
                            crypto.sparkline_in_7d.price
                          )}
                          isPositive={crypto.price_change_percentage_24h >= 0}
                        />
                      ) : (
                        <div className="text-xs text-gray-400">No data</div>
                      )}
                    </td>
                    <td className="px-5 text-sm">
                      <HoldingInput
                        crypto={crypto}
                        watchlist={watchlist}
                        setWatchlist={setWatchlist}
                        isEditing={openEditId === crypto.id}
                        onSave={() => setOpenEditId(null)}
                      />
                    </td>

                    <td className="px-5 text-sm">
                      $
                      {crypto.holdings
                        ? (crypto.holdings * crypto.current_price).toFixed(2)
                        : 0}
                    </td>
                    <td className="relative px-5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(
                            openMenuId === crypto.id ? null : crypto.id
                          );
                        }}
                        className="p-2 text-gray-400  cursor-pointer rounded transition-all"
                      >
                        ⋯
                      </button>

                      {openMenuId === crypto.id && (
                        <div className="absolute z-40 right-11 -mt-3 w-40 bg-[#1f2937] border border-[#3f3f46] rounded-lg shadow-lg z-10">
                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              setOpenEditId(crypto.id);
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-[#2a2a2a] w-full text-left"
                          >
                            ✏️ Edit Holdings
                          </button>

                          <button
                            onClick={() => {
                              setWatchlist((prev) =>
                                prev.filter((item) => item.id !== crypto.id)
                              );
                              setOpenMenuId(null);
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-[#2a2a2a] w-full text-left"
                          >
                            🗑️ Remove
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="px-5 py-4 bg-[#27272a] border-t border-[#3f3f46] flex justify-between items-center text-sm text-gray-400">
              {/* Left side: result range */}
              <div>
                {totalResults === 0 ? (
                  "No results"
                ) : (
                  <>
                    {(currentPage - 1) * 10 + 1} —{" "}
                    {Math.min(currentPage * 10, totalResults)} of {totalResults}{" "}
                    results
                  </>
                )}
              </div>

              {/* Right side: page controls */}
              <div className="flex items-center gap-3">
                <div>
                  Page {currentPage} of {totalPages}
                </div>

                {/* Prev button */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className={`px-3 py-1.5 bg-[#1f2937] rounded transition-all ${
                    currentPage === 1
                      ? "text-gray-400 opacity-50 cursor-not-allowed"
                      : "text-gray-400 hover:bg-[#374151] hover:text-white"
                  }`}
                >
                  Prev
                </button>

                {/* Next button */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`px-3 py-1.5 bg-[#1f2937] rounded transition-all ${
                    currentPage === totalPages || totalPages === 0
                      ? "text-gray-400 opacity-50 cursor-not-allowed"
                      : "text-gray-400 hover:bg-[#374151] hover:text-white"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Add Token Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e1e1e] rounded-lg w-full max-w-md shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add Token</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-white transition-colors text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              {/* Search Input */}
              <input
                type="text"
                placeholder="Search tokens (e.g., ETH, SOL)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#2a2a2a] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a9e851] placeholder-gray-500"
              />
            </div>

            {/* Trending Section */}
            <div className="px-6 pt-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Trending
              </h3>
            </div>

            {/* Token List with Scroll */}
            <div
              ref={modalScrollRef}
              onScroll={handleScroll}
              className="px-6 pb-6 max-h-96 overflow-y-auto "
            >
              {filteredTokens.map((token) => (
                <div
                  key={token.id}
                  className={`flex items-center justify-between py-3  ${
                    isInWatchlist(token.id)
                      ? "bg-[#292d27] hover:bg-[#292d27]"
                      : "hover:bg-[#2a2a2a]"
                  }  px-3 -mx-3 rounded-lg transition-colors cursor-pointer group`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-sm flex items-center justify-center">
                      <img src={token.image} alt="" />
                    </div>

                    <div>
                      <div className="font-medium">{token.name}</div>
                      <div className="text-xs text-gray-400">
                        {token.symbol.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center">
                    {isInWatchlist(token.id) && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="#a9e851"
                        width="16"
                        height="16"
                      >
                        <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.782 1.401 8.168L12 18.896l-7.335 3.865 1.401-8.168L.132 9.211l8.2-1.193L12 .587z" />
                      </svg>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.stopPropagation();

                        setSelectedTokens((prev) => {
                          const isAlreadySelected = prev.includes(token.id);

                          if (isAlreadySelected) {
                            return prev.filter((id) => id !== token.id);
                          } else {
                            const tokenExists = modalTokens.some(
                              (t) => t.id === token.id
                            );
                            if (tokenExists) {
                              return [...prev, token.id];
                            } else {
                              return prev.filter((id) => id !== token.id);
                            }
                          }
                        });
                      }}
                      className={`w-5 h-5 rounded-full border-2 transition-colors flex items-center justify-center ${
                        isInWatchlist(token.id)
                          ? "border-[#a9e851] bg-[#a9e851]"
                          : "border-gray-600 group-hover:border-[#a9e851]"
                      }`}
                    >
                      {isInWatchlist(token.id) ? (
                        <svg
                          className="w-3 h-3 text-black"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-transparent group-hover:bg-[#a9e851] transition-colors"></div>
                      )}
                    </button>
                  </div>
                </div>
              ))}

              {modalLoading && (
                <div className="text-center py-4 text-gray-400">
                  Loading more tokens...
                </div>
              )}

              {!modalHasMore && filteredTokens.length > 0 && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No more tokens to load
                </div>
              )}

              {filteredTokens.length === 0 && !modalLoading && (
                <div className="text-center py-8 text-gray-500">
                  No tokens found
                </div>
              )}
            </div>

            <div className="px-4 bg-[#27272a] rounded-b-lg flex justify-end py-3 shadow-t-sm ">
              <button
                onClick={() => {
                  setWatchlist((prev) => {
                    // Tokens user selected from modal
                    const newlySelected = modalTokens.filter((token) =>
                      selectedTokens.includes(token.id)
                    );

                    // Merge: keep all old tokens + add any new unique ones
                    const merged = [
                      ...prev,
                      ...newlySelected.filter(
                        (t) => !prev.some((p) => p.id === t.id)
                      ),
                    ];

                    // If user deselected something (from previously added), remove it
                    const cleaned = merged.filter((token) =>
                      selectedTokens.includes(token.id)
                    );

                    return cleaned;
                  });

                  handleCloseModal();
                }}
                disabled={selectedTokens.length === 0}
                className={` py-1 text-sm px-4 rounded-lg transition-colors ${
                  selectedTokens.length === 0
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-[#a9e851] text-black hover:bg-[#95d43d]"
                }`}
              >
                Add to Watchlist
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
