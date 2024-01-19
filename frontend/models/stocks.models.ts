
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


export interface AllStocksResponse extends APIResponse {
    data: stock[]
}
