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
