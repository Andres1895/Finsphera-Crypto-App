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
          className="bg-white dark:bg-zinc-950/50 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 hover:border-gray-300 dark:hover:border-zinc-700 transition-colors"
        >
          <h3 className="text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2">{stat.title}</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</p>
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
