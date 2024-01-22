
export interface Error {
    msg: string,
    code: string
}

export interface APIResponse {
    data: any[],
    error: Error
}


export interface stock {
    currency : string,
    description: string,
    displaySymbol: string,
    figi: string,
    mic: string,
    shareClassFIGI: string,
    symbol: string,
    symbol2: string,
    type: string
}

export interface stockProfile {
    country: string,
    currency: string,
    exchange: string,
    finnhubIndustry: string,
    ipo: string,
    logo: string,
    marketCapitalization: number,
    name: string,
    phone: string,
    shareOutstanding: number,
    ticker: string,
    weburl: string
}

export interface StockQuote {
    c: number,
    d: number,
    dp: number,
    h: number,
    l: number,
    o: number,
    pc: number
}


export interface AllStocksResponse extends APIResponse {
    data: stock[]
}

export interface StockProfileResponse {
    data: stockProfile
    error: Error
}

export interface APIStockQuoteResponse {
    data: StockQuote,
    error: Error
}