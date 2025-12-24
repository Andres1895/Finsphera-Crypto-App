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
