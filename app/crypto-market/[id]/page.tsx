import { Suspense } from "react";
import Sidebar from "../../components/sidebar";
import Loader from "../../components/loader";
import { getTicker24hr, getKlines } from "../../lib/binanceAPI";
import type { Ticker24hr } from "../../lib/types";
import PriceChart from "../../components/price-chart";
import StatsCards from "../../components/stats-cards";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CryptoDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  console.log(resolvedParams);
  const symbol = resolvedParams.id.toUpperCase();
  
  const [tickerData, klinesData] = await Promise.all([
    getTicker24hr(symbol) as Promise<Ticker24hr>,
    getKlines(symbol, "1h", undefined, undefined, 24),
  ]);

  const priceChangePercent = parseFloat(tickerData.priceChangePercent);
  const isPositive = priceChangePercent >= 0;
  const baseCurrency = symbol.replace("USDT", "");
  const currentPrice = parseFloat(tickerData.lastPrice);



  return (
    <div className="flex min-h-screen bg-[#0c0e13] font-sans">
      <Sidebar currentPath="/crypto-market" />
      
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-6 px-16 flex flex-col lg:flex-row items-start justify-between gap-4">
            <div className="flex items-center justify-center gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
                  {symbol}
                  <span className="text-lg text-zinc-500">{baseCurrency}</span>
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-2xl font-bold text-white">
                    ${currentPrice.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium ${
                      isPositive
                        ? "bg-green-500/10 text-green-500"
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {isPositive ? "▲" : "▼"} {Math.abs(priceChangePercent).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

          </div>

            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 space-y-6">
                <Suspense fallback={<Loader />}>
                  <PriceChart symbol={symbol} initialKlines={klinesData} />
                </Suspense>

                <Suspense fallback={<Loader />}>
                  <StatsCards ticker={tickerData}/>
                </Suspense>

                <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-white mb-4">
                    About {symbol}
                  </h2>
                  <p className="text-zinc-400 leading-relaxed">
                    {baseCurrency === "BTC" && (
                      <>
                        Bitcoin is a decentralized digital currency created in 2009 by an unknown
                        person or group of people using the name Satoshi Nakamoto.
                        Transactions are verified by network nodes through cryptography and
                        recorded in a public distributed ledger called a blockchain.
                        <br /><br />
                        Bitcoin is unique in that there are a finite number of them: 21 million.
                      </>
                    )}
                    {baseCurrency === "ETH" && (
                      <>
                        Ethereum is a decentralized, open-source blockchain with smart contract functionality.
                        Ether (ETH) is the native cryptocurrency of the platform. It is the second-largest
                        cryptocurrency by market capitalization after Bitcoin.
                      </>
                    )}
                    {baseCurrency !== "BTC" && baseCurrency !== "ETH" && (
                      <>
                        {symbol} ({baseCurrency}) is a cryptocurrency that operates on a decentralized
                        blockchain network. It offers various features for digital transactions and
                        decentralized applications.
                      </>
                    )}
                  </p>
                </div>
              </div>

            </div>
        </div>
      </main>
    </div>
  );
}

