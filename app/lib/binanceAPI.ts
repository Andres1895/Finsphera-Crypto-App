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
