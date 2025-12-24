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
