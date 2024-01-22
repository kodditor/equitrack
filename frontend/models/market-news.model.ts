import { APIResponse } from "./stocks.models";

export interface MarketNewsData  {
    category: string,
    datetime: number,
    headline: string,
    id: number,
    image: string,
    related: string,
    source: string,
    summary:string,
    url: string
}

export interface APIMarketNewsResponse extends APIResponse {
    data: MarketNewsData[]
}