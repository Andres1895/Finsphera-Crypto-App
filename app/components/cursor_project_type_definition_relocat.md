# Project type definitions relocation
_Exported on 12/24/2025 at 14:39:38 CST from Cursor (2.2.43)_

---

**User**

@app/components/error.tsx:5-8  Move types in the project under lib/types.ts 

---

**Cursor**

I'll help you centralize types in the project under `lib/types.ts`. Let me first examine the current types across your components and then move them to a central location.

Now I'll create a centralized types file and move all type definitions from across your project to `lib/types.ts`. Let me create the types file and update all the components:

```typescript
// Binance API Types
export interface Ticker24hr {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

export interface Kline {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
  quoteAssetVolume: string;
  numberOfTrades: number;
  takerBuyBaseAssetVolume: string;
  takerBuyQuoteAssetVolume: string;
  ignore: string;
}

// Component Props Types
export interface ErrorProps {
  message: string;
  title?: string;
}

export interface PriceChartProps {
  symbol: string;
  initialKlines: Kline[];
}

export interface SidebarProps {
  currentPath?: string;
}

export interface StatsCardsProps {
  ticker: Ticker24hr;
}

export interface TableProps {
  data: Ticker24hr[];
}

```

Now I'll update all the files to use the centralized types:

```typescriptreact
"use client";

import { motion } from "framer-motion";
import { ErrorProps } from "../lib/types";

export default function Error({ message, title = "Error" }: ErrorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-zinc-950/50 border border-red-800 rounded-2xl p-6 text-center"
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="flex justify-center"
      >
        <div className="text-5xl mb-4">⚠️</div>
      </motion.div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-zinc-400 mb-4">{message}</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.location.reload()}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
      >
        Retry Connection
      </motion.button>
    </motion.div>
  );
}

```

```typescriptreact
"use client";

import { getKlines } from "../lib/binanceAPI";
import { Kline, PriceChartProps } from "../lib/types";
import { useState, useEffect } from "react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import Loader from "./loader";

const TIMEFRAMES = {
  "1D": { interval: "1h", limit: 24 },
  "7D": { interval: "4h", limit: 42 },
  "30D": { interval: "1d", limit: 30 },
  "1Y": { interval: "1w", limit: 52 },
};

export default function PriceChart({ symbol, initialKlines }: PriceChartProps) {
  const [timeframe, setTimeframe] = useState<keyof typeof TIMEFRAMES>("1D");
  const [klines, setKlines] = useState(initialKlines);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const config = TIMEFRAMES[timeframe];
      const data = await getKlines(symbol, config.interval, undefined, undefined, config.limit);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setKlines(data);
      setLoading(false);
    };
    fetchData();
  }, [timeframe, symbol]);

  const priceChange = klines.length > 1
    ? ((parseFloat(klines[klines.length - 1].close) - parseFloat(klines[0].open)) / parseFloat(klines[0].open)) * 100
    : 0;

  const chartData = klines.map((k) => ({
    price: parseFloat(k.close),
    time: new Date(k.closeTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  }));

  return (
    <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Price History</h2>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-zinc-500">Last updated: Just now</p>
            {!loading && (
              <span className={`text-sm font-medium ${priceChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(2)}%
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2 bg-zinc-900 p-1 rounded-lg">
          {Object.keys(TIMEFRAMES).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf as keyof typeof TIMEFRAMES)}
              disabled={loading}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-50 ${
                timeframe === tf ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="relative w-full h-[400px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm z-10">
            <Loader />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={priceChange >= 0 ? "green" : "red"} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={priceChange >= 0 ? "green" : "red"} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="time" 
                stroke="#71717a" 
                tick={{ fill: "#71717a", fontSize: 12 }}
                tickLine={false}
                domain={['auto', 'auto']}
                interval={2}
              />
              <YAxis 
                stroke="#71717a" 
                tick={{ fill: "#71717a", fontSize: 12 }}
                tickLine={false}
                domain={['auto', 'auto']}
                interval={0}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke={priceChange >= 0 ? "green" : "red"}
                strokeWidth={2}
                dot={false}
                fill="url(#colorPrice)"
              />
              <Tooltip
                content={({ payload }) => (
                  payload?.[0] ? (
                    <div className="bg-black border border-zinc-800 rounded-lg p-2">
                      <p className="text-white text-sm">Price: ${payload[0].payload.price.toFixed(2)}</p>
                      <p className="text-zinc-400 text-xs">{payload[0].payload.time}</p>
                    </div>
                  ) : null
                )}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

```

```typescriptreact
"use client";

import { useState } from "react";
import Link from "next/link";
import { SidebarProps } from "../lib/types";

export default function Sidebar({ currentPath }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Markets", path: "/crypto-market", icon: "💹" },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-zinc-900 text-white lg:hidden hover:bg-zinc-800 transition-colors"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      <aside
        className={`
          flex justify-between
          h-auto bg-zinc-950 border-r border-zinc-800
          transition-all duration-300 ease-in-out
          ${isOpen ? "w-60" : "w-0 lg:w-64"}
          overflow-hidden shrink-0
        `}
      >
        <div className="flex flex-col h-full w-64 mt-10">
          <div className="p-6 border-b border-zinc-800">
            <Link href="https://www.finsphera.ai/" className="flex items-center gap-2 group " target="_blank">
              <span className="text-2xl">🚀</span>
              <div>
                <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  Finsphera
                </h2>
                <p className="text-xs text-zinc-500">Crypto Market</p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 p-4 overflow-y-auto max-h-[70vh]">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const isActive = currentPath === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg
                        transition-all duration-200
                        ${
                          isActive
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                            : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                        }
                      `}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 border-t border-zinc-800">
            <div className="flex items-center gap-2 flex-col px-4 py-3 bg-zinc-900 rounded-lg">
              <p className="text-xs text-zinc-500 mb-1">Data Source</p>
              <p className="text-sm font-medium text-white">Binance API</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

```

```typescriptreact
"use client";

import { Ticker24hr, StatsCardsProps } from "../lib/types";

export default function StatsCards({ ticker }: StatsCardsProps) {
  const formatPrice = (price: string) => 
    `$${parseFloat(price).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const priceChange = parseFloat(ticker.priceChangePercent);
  const lowPriceChange = ((parseFloat(ticker.lowPrice) - parseFloat(ticker.openPrice)) / parseFloat(ticker.openPrice)) * 100;

  const stats = [
    {
      title: "24h High",
      value: formatPrice(ticker.highPrice),
      change: priceChange > 0 ? `+${priceChange.toFixed(1)}%` : `${priceChange.toFixed(1)}%`,
      isPositive: priceChange >= 0,
    },
    {
      title: "24h Low",
      value: formatPrice(ticker.lowPrice),
      change: `${lowPriceChange.toFixed(1)}%`,
      isPositive: lowPriceChange >= 0,
    },
    {
      title: "24h Volume",
      value: `${ticker.count.toLocaleString()} trades`,
    },
    {
      title: "Price Change",
      value: `${priceChange.toFixed(1)}%`,
      change: priceChange > 0 ? `+${priceChange.toFixed(1)}%` : `${priceChange.toFixed(1)}%`,
      isPositive: priceChange >= 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-colors"
        >
          <h3 className="text-sm font-medium text-zinc-400 mb-2">{stat.title}</h3>
          <p className="text-2xl font-bold text-white mb-2">{stat.value}</p>
          {stat.change && (
            <p className={`text-sm font-medium ${stat.isPositive ? "text-green-500" : "text-red-500"}`}>
              {stat.change}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

```

```typescriptreact
"use client";

import { Ticker24hr, TableProps } from "../lib/types";
import { useState, useMemo } from "react";
import Link from "next/link";

export default function Table({ data }: TableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const filteredData = useMemo(() => {
    const filtered = data.filter((item) =>
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      if (sortDirection === "asc") {
        return a.symbol.localeCompare(b.symbol);
      } else {
        return b.symbol.localeCompare(a.symbol);
      }
    });
  }, [data, searchTerm, sortDirection]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleSort = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    setCurrentPage(1); 
  };

  const formatNumber = (num: string | number): string => {
    const value = typeof num === "string" ? parseFloat(num) : num;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className="w-full">

      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-white">Market Assets</h2>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <input
              className="w-full sm:w-96 pl-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors"
              type="text"
              placeholder="Search Crypto"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
            <button
              onClick={handleSort}
              className="flex items-center gap-2 px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-colors"
              title={`Sort ${sortDirection === "asc" ? "Descending" : "Ascending"}`}
            >
              <span className="text-sm font-medium text-zinc-300">
                {sortDirection === "asc" ? "A-Z" : "Z-A"}
              </span>
              <span className="text-zinc-400">
                {sortDirection === "asc" ? "▲" : "▼"}
              </span>
            </button>
        </div>
      </div>
      <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full max-w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Asset
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Price (USDT)
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  24h Change
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  24h Volume
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Market Cap
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  More Info
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="text-lg font-medium text-zinc-400">
                        No crypto found
                      </div>
                  </td>
                </tr>
              ) : (
                currentData.map((item) => {
                const priceChangePercent = parseFloat(item.priceChangePercent);
                const isPositive = priceChangePercent >= 0;
                const cryptoName = item.symbol.replace("USDT", "");

                return (
                  <tr
                    key={item.symbol}
                    className="hover:bg-zinc-900/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">

                        <div>
                          <div className="font-semibold text-white">
                            {cryptoName}
                          </div>
                          <div className="text-sm text-zinc-500">
                            {item.symbol}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">
                        ${parseFloat(item.lastPrice).toLocaleString()}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium ${
                          isPositive
                            ? "bg-green-500/10 text-green-500"
                            : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {isPositive ? "▲" : "▼"} {Math.abs(priceChangePercent).toFixed(1)}%
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-zinc-300">
                        {formatNumber(item.quoteVolume)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-zinc-300">
                        {formatNumber(parseFloat(item.quoteVolume) * 1.5)}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link href={`/crypto-market/${item.symbol}`}>
                        <button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors">
                          Info
                        </button>
                      </Link>
                    </td>
                  </tr>
                );
              })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-zinc-800 flex items-center justify-between">
          <div className="text-sm text-zinc-400">
            {startIndex + 1}-{Math.min(endIndex, filteredData.length)} of{" "}
            {filteredData.length} assets
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1 ||filteredData.length === 0}
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-zinc-800 rounded-lg hover:bg-zinc-900"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages || filteredData.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-zinc-800 rounded-lg"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

```

```typescript
import { Ticker24hr, Kline } from './types';

const BASE_URL = 'https://data-api.binance.vision/api/v3';

export async function getTicker24hr(symbol?: string): Promise<Ticker24hr | Ticker24hr[]> {
  const url = symbol
    ? `${BASE_URL}/ticker/24hr?symbol=${symbol}`
    : `${BASE_URL}/ticker/24hr`;
  
  const response = await fetch(url).then(res => res.json());
  return response;
}

export async function getKlines(
  symbol: string,
  interval: string,
  startTime?: number,
  endTime?: number,
  limit?: number
): Promise<Kline[]> {
  const params = new URLSearchParams({
    symbol,
    interval,
  });
  
  if (startTime) params.append('startTime', startTime.toString());
  if (endTime) params.append('endTime', endTime.toString());
  if (limit) params.append('limit', limit.toString());
  
  const response = await fetch(`${BASE_URL}/klines?${params.toString()}`).then(res => res.json());
  
  return response.map((kline: unknown[]): Kline => ({
    openTime: Number(kline[0]),
    open: String(kline[1]),
    high: String(kline[2]),
    low: String(kline[3]),
    close: String(kline[4]),
    volume: String(kline[5]),
    closeTime: Number(kline[6]),
    quoteAssetVolume: String(kline[7]),
    numberOfTrades: Number(kline[8]),
    takerBuyBaseAssetVolume: String(kline[9]),
    takerBuyQuoteAssetVolume: String(kline[10]),
    ignore: String(kline[11]),
  }));
}

```

Now let me check the page files to see if they need any updates:

I need to update the page files to import types from the centralized location:

```typescriptreact
import { Suspense } from "react";
import Sidebar from "../../components/sidebar";
import Loader from "../../components/loader";
import { getTicker24hr, getKlines } from "../../lib/binanceAPI";
import { Ticker24hr } from "../../lib/types";
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


```

```typescriptreact
import { Suspense } from "react";
import Loader from "../components/loader";
import Sidebar from "../components/sidebar";
import Table from "../components/table";
import Error from "../components/error";
import { getTicker24hr } from "../lib/binanceAPI";
import { Ticker24hr } from "../lib/types";

export default async function CryptoMarket() {
  const data = await getTicker24hr() as Ticker24hr[];  
  return (
    <div className="flex min-h-screen bg-[#0c0e13] font-sans">
      <Sidebar currentPath="/crypto-market" />
      <main className="flex-1 p-6 md:p-8 lg:p-12 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <div className=" flex flex-col gap-2 items-center justify-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Market Overview
            </h1>
            <p className="text-zinc-400">
              Real-time cryptocurrency data from Binance Free API
            </p>
          </div>
          <Suspense fallback={<Loader />}>
            <Table data={data} />
          </Suspense>
          
          <div className="mt-8">
            <Error 
              message="We couldn't connect to the server. Please check your internet connection and try again." 
              title="Failed to Load Data"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

```

Now let me check for any linter errors in all the modified files:

I need to fix the linter warnings by using `type` imports for type-only imports:

```typescriptreact
"use client";

import { getKlines } from "../lib/binanceAPI";
import type { PriceChartProps } from "../lib/types";
import { useState, useEffect } from "react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import Loader from "./loader";

const TIMEFRAMES = {
  "1D": { interval: "1h", limit: 24 },
  "7D": { interval: "4h", limit: 42 },
  "30D": { interval: "1d", limit: 30 },
  "1Y": { interval: "1w", limit: 52 },
};

export default function PriceChart({ symbol, initialKlines }: PriceChartProps) {
  const [timeframe, setTimeframe] = useState<keyof typeof TIMEFRAMES>("1D");
  const [klines, setKlines] = useState(initialKlines);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const config = TIMEFRAMES[timeframe];
      const data = await getKlines(symbol, config.interval, undefined, undefined, config.limit);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setKlines(data);
      setLoading(false);
    };
    fetchData();
  }, [timeframe, symbol]);

  const priceChange = klines.length > 1
    ? ((parseFloat(klines[klines.length - 1].close) - parseFloat(klines[0].open)) / parseFloat(klines[0].open)) * 100
    : 0;

  const chartData = klines.map((k) => ({
    price: parseFloat(k.close),
    time: new Date(k.closeTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  }));

  return (
    <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Price History</h2>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-zinc-500">Last updated: Just now</p>
            {!loading && (
              <span className={`text-sm font-medium ${priceChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(2)}%
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2 bg-zinc-900 p-1 rounded-lg">
          {Object.keys(TIMEFRAMES).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf as keyof typeof TIMEFRAMES)}
              disabled={loading}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-50 ${
                timeframe === tf ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="relative w-full h-[400px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm z-10">
            <Loader />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={priceChange >= 0 ? "green" : "red"} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={priceChange >= 0 ? "green" : "red"} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="time" 
                stroke="#71717a" 
                tick={{ fill: "#71717a", fontSize: 12 }}
                tickLine={false}
                domain={['auto', 'auto']}
                interval={2}
              />
              <YAxis 
                stroke="#71717a" 
                tick={{ fill: "#71717a", fontSize: 12 }}
                tickLine={false}
                domain={['auto', 'auto']}
                interval={0}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke={priceChange >= 0 ? "green" : "red"}
                strokeWidth={2}
                dot={false}
                fill="url(#colorPrice)"
              />
              <Tooltip
                content={({ payload }) => (
                  payload?.[0] ? (
                    <div className="bg-black border border-zinc-800 rounded-lg p-2">
                      <p className="text-white text-sm">Price: ${payload[0].payload.price.toFixed(2)}</p>
                      <p className="text-zinc-400 text-xs">{payload[0].payload.time}</p>
                    </div>
                  ) : null
                )}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

```

```typescriptreact
"use client";

import type { StatsCardsProps } from "../lib/types";

export default function StatsCards({ ticker }: StatsCardsProps) {
  const formatPrice = (price: string) => 
    `$${parseFloat(price).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const priceChange = parseFloat(ticker.priceChangePercent);
  const lowPriceChange = ((parseFloat(ticker.lowPrice) - parseFloat(ticker.openPrice)) / parseFloat(ticker.openPrice)) * 100;

  const stats = [
    {
      title: "24h High",
      value: formatPrice(ticker.highPrice),
      change: priceChange > 0 ? `+${priceChange.toFixed(1)}%` : `${priceChange.toFixed(1)}%`,
      isPositive: priceChange >= 0,
    },
    {
      title: "24h Low",
      value: formatPrice(ticker.lowPrice),
      change: `${lowPriceChange.toFixed(1)}%`,
      isPositive: lowPriceChange >= 0,
    },
    {
      title: "24h Volume",
      value: `${ticker.count.toLocaleString()} trades`,
    },
    {
      title: "Price Change",
      value: `${priceChange.toFixed(1)}%`,
      change: priceChange > 0 ? `+${priceChange.toFixed(1)}%` : `${priceChange.toFixed(1)}%`,
      isPositive: priceChange >= 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-colors"
        >
          <h3 className="text-sm font-medium text-zinc-400 mb-2">{stat.title}</h3>
          <p className="text-2xl font-bold text-white mb-2">{stat.value}</p>
          {stat.change && (
            <p className={`text-sm font-medium ${stat.isPositive ? "text-green-500" : "text-red-500"}`}>
              {stat.change}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

```

```typescriptreact
"use client";

import type { TableProps } from "../lib/types";
import { useState, useMemo } from "react";
import Link from "next/link";

export default function Table({ data }: TableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const filteredData = useMemo(() => {
    const filtered = data.filter((item) =>
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      if (sortDirection === "asc") {
        return a.symbol.localeCompare(b.symbol);
      } else {
        return b.symbol.localeCompare(a.symbol);
      }
    });
  }, [data, searchTerm, sortDirection]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleSort = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    setCurrentPage(1); 
  };

  const formatNumber = (num: string | number): string => {
    const value = typeof num === "string" ? parseFloat(num) : num;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className="w-full">

      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-white">Market Assets</h2>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <input
              className="w-full sm:w-96 pl-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors"
              type="text"
              placeholder="Search Crypto"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
            <button
              onClick={handleSort}
              className="flex items-center gap-2 px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-colors"
              title={`Sort ${sortDirection === "asc" ? "Descending" : "Ascending"}`}
            >
              <span className="text-sm font-medium text-zinc-300">
                {sortDirection === "asc" ? "A-Z" : "Z-A"}
              </span>
              <span className="text-zinc-400">
                {sortDirection === "asc" ? "▲" : "▼"}
              </span>
            </button>
        </div>
      </div>
      <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full max-w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Asset
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Price (USDT)
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  24h Change
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  24h Volume
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Market Cap
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  More Info
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="text-lg font-medium text-zinc-400">
                        No crypto found
                      </div>
                  </td>
                </tr>
              ) : (
                currentData.map((item) => {
                const priceChangePercent = parseFloat(item.priceChangePercent);
                const isPositive = priceChangePercent >= 0;
                const cryptoName = item.symbol.replace("USDT", "");

                return (
                  <tr
                    key={item.symbol}
                    className="hover:bg-zinc-900/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">

                        <div>
                          <div className="font-semibold text-white">
                            {cryptoName}
                          </div>
                          <div className="text-sm text-zinc-500">
                            {item.symbol}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">
                        ${parseFloat(item.lastPrice).toLocaleString()}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium ${
                          isPositive
                            ? "bg-green-500/10 text-green-500"
                            : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {isPositive ? "▲" : "▼"} {Math.abs(priceChangePercent).toFixed(1)}%
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-zinc-300">
                        {formatNumber(item.quoteVolume)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-zinc-300">
                        {formatNumber(parseFloat(item.quoteVolume) * 1.5)}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link href={`/crypto-market/${item.symbol}`}>
                        <button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors">
                          Info
                        </button>
                      </Link>
                    </td>
                  </tr>
                );
              })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-zinc-800 flex items-center justify-between">
          <div className="text-sm text-zinc-400">
            {startIndex + 1}-{Math.min(endIndex, filteredData.length)} of{" "}
            {filteredData.length} assets
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1 ||filteredData.length === 0}
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-zinc-800 rounded-lg hover:bg-zinc-900"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages || filteredData.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-zinc-800 rounded-lg"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

```

Let me also update the other files for consistency with `type` imports:

```typescriptreact
"use client";

import { motion } from "framer-motion";
import type { ErrorProps } from "../lib/types";

export default function Error({ message, title = "Error" }: ErrorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-zinc-950/50 border border-red-800 rounded-2xl p-6 text-center"
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="flex justify-center"
      >
        <div className="text-5xl mb-4">⚠️</div>
      </motion.div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-zinc-400 mb-4">{message}</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.location.reload()}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
      >
        Retry Connection
      </motion.button>
    </motion.div>
  );
}

```

```typescriptreact
"use client";

import { useState } from "react";
import Link from "next/link";
import type { SidebarProps } from "../lib/types";

export default function Sidebar({ currentPath }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Markets", path: "/crypto-market", icon: "💹" },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-zinc-900 text-white lg:hidden hover:bg-zinc-800 transition-colors"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      <aside
        className={`
          flex justify-between
          h-auto bg-zinc-950 border-r border-zinc-800
          transition-all duration-300 ease-in-out
          ${isOpen ? "w-60" : "w-0 lg:w-64"}
          overflow-hidden shrink-0
        `}
      >
        <div className="flex flex-col h-full w-64 mt-10">
          <div className="p-6 border-b border-zinc-800">
            <Link href="https://www.finsphera.ai/" className="flex items-center gap-2 group " target="_blank">
              <span className="text-2xl">🚀</span>
              <div>
                <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  Finsphera
                </h2>
                <p className="text-xs text-zinc-500">Crypto Market</p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 p-4 overflow-y-auto max-h-[70vh]">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const isActive = currentPath === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg
                        transition-all duration-200
                        ${
                          isActive
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                            : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                        }
                      `}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 border-t border-zinc-800">
            <div className="flex items-center gap-2 flex-col px-4 py-3 bg-zinc-900 rounded-lg">
              <p className="text-xs text-zinc-500 mb-1">Data Source</p>
              <p className="text-sm font-medium text-white">Binance API</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

```

```typescript
import type { Ticker24hr, Kline } from './types';

const BASE_URL = 'https://data-api.binance.vision/api/v3';

export async function getTicker24hr(symbol?: string): Promise<Ticker24hr | Ticker24hr[]> {
  const url = symbol
    ? `${BASE_URL}/ticker/24hr?symbol=${symbol}`
    : `${BASE_URL}/ticker/24hr`;
  
  const response = await fetch(url).then(res => res.json());
  return response;
}

export async function getKlines(
  symbol: string,
  interval: string,
  startTime?: number,
  endTime?: number,
  limit?: number
): Promise<Kline[]> {
  const params = new URLSearchParams({
    symbol,
    interval,
  });
  
  if (startTime) params.append('startTime', startTime.toString());
  if (endTime) params.append('endTime', endTime.toString());
  if (limit) params.append('limit', limit.toString());
  
  const response = await fetch(`${BASE_URL}/klines?${params.toString()}`).then(res => res.json());
  
  return response.map((kline: unknown[]): Kline => ({
    openTime: Number(kline[0]),
    open: String(kline[1]),
    high: String(kline[2]),
    low: String(kline[3]),
    close: String(kline[4]),
    volume: String(kline[5]),
    closeTime: Number(kline[6]),
    quoteAssetVolume: String(kline[7]),
    numberOfTrades: Number(kline[8]),
    takerBuyBaseAssetVolume: String(kline[9]),
    takerBuyQuoteAssetVolume: String(kline[10]),
    ignore: String(kline[11]),
  }));
}

```

```typescriptreact
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


```

```typescriptreact
import { Suspense } from "react";
import Loader from "../components/loader";
import Sidebar from "../components/sidebar";
import Table from "../components/table";
import Error from "../components/error";
import { getTicker24hr } from "../lib/binanceAPI";
import type { Ticker24hr } from "../lib/types";

export default async function CryptoMarket() {
  const data = await getTicker24hr() as Ticker24hr[];  
  return (
    <div className="flex min-h-screen bg-[#0c0e13] font-sans">
      <Sidebar currentPath="/crypto-market" />
      <main className="flex-1 p-6 md:p-8 lg:p-12 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <div className=" flex flex-col gap-2 items-center justify-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Market Overview
            </h1>
            <p className="text-zinc-400">
              Real-time cryptocurrency data from Binance Free API
            </p>
          </div>
          <Suspense fallback={<Loader />}>
            <Table data={data} />
          </Suspense>
          
          <div className="mt-8">
            <Error 
              message="We couldn't connect to the server. Please check your internet connection and try again." 
              title="Failed to Load Data"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

```

Now let me check for linter errors one more time:

Perfect! I've successfully centralized all types in your project under `app/lib/types.ts`. Here's what I did:

## Summary of Changes:

### 1. **Created `app/lib/types.ts`** - Centralized type definitions:
   - **Binance API Types**: `Ticker24hr`, `Kline`
   - **Component Props Types**: `ErrorProps`, `PriceChartProps`, `SidebarProps`, `StatsCardsProps`, `TableProps`

### 2. **Updated all component files** to import types from the central location:
   - `error.tsx` - now imports `ErrorProps` type
   - `price-chart.tsx` - now imports `PriceChartProps` type
   - `sidebar.tsx` - now imports `SidebarProps` type  
   - `stats-cards.tsx` - now imports `StatsCardsProps` type
   - `table.tsx` - now imports `TableProps` type

### 3. **Updated `binanceAPI.ts`** - removed type definitions, now imports `Ticker24hr` and `Kline` from `types.ts`

### 4. **Updated page files**:
   - `crypto-market/page.tsx` - imports `Ticker24hr` from types
   - `crypto-market/[id]/page.tsx` - imports `Ticker24hr` from types

All imports use the `type` keyword for type-only imports, which is a TypeScript best practice and ensures clean linting with no warnings. ✨

