        export const fetchCryptoData = async () => {
        try {
            // Fetch market data with sparkline
            const response  = await fetch(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd`
            );

            if (!response.ok) {
            throw new Error("Failed to fetch data from CoinGecko API");
            }

            const data = await response.json();
            return data;
        } catch (err) {
            console.log({ err });
        }
        };
