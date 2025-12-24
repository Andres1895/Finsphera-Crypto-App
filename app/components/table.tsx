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
