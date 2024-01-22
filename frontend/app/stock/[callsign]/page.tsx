"use client"
import Footer from "@/components/footer-component";
import Header from "@/components/header-component";
import { APIMarketNewsResponse, MarketNewsData } from "@/models/market-news.model";
import { APIStockQuoteResponse, StockProfileResponse, StockQuote, stockProfile} from "@/models/stocks.models";
import { isEmpty } from "@/utils/helpers";
import { useEffect, useState } from "react";


export default function StockPage({ params }: { params: {callsign: string } }){

    const [ stock, setStock] = useState<stockProfile | null>(null)
    const [ companyMarketNews, setCompanyMarketNews ] = useState<MarketNewsData[] | null>(null)
    const [ stockQuote, setStockQuote ] = useState<StockQuote | null >(null)

    useEffect( ()=>{
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL!}/stocks/${params.callsign}/profile` )
        .then(res => res.json())
        .then((data:StockProfileResponse) => {
            if(!isEmpty(data.error)){
                console.log(data.error)
            } else {
                setStock(data.data)
            }
        })
        .catch((err) =>{
            console.error(err)
        })


        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL!}/stocks/${params.callsign}/news`)
        .then(res => res.json())
        .then((data:APIMarketNewsResponse) => {
            if(!isEmpty(data.error)){
                console.log(data.error)
            } else {
                setCompanyMarketNews(data.data)
            }
        })
        .catch((err) =>{
            console.error(err)
        })

        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL!}/stocks/${params.callsign}/quote`)
        .then(res => res.json())
        .then((data:APIStockQuoteResponse) => {
            if(!isEmpty(data.error)){
                console.log(data.error)
            } else {
                setStockQuote(data.data)
            }
        })
        .catch((err) =>{
            console.error(err)
        })

    }, [] )


    if(stock == null || companyMarketNews == null || stockQuote == null){

        return (
            <>
                <Header />
                <main className='min-h-screen w-full px-12 pt-24 md:px-36 text-white'>
                    <section>
                        <h1></h1>
                    </section>
                </main>
                <Footer />
            </>
        )

    } else {

        return (
            <>
                <Header />
                <main className='min-h-screen w-full px-12 pt-24 md:px-36 text-white'>
                    <section className="mb-8">
                        <div className="flex gap-8 items-center mb-8">
                            <img className="h-[80px]" src={stock.logo} />
                            <span >
                                <h1 className="text-6xl text-green font-black mb-1">{stock.name}</h1>
                                <small>{stock.country} | {stock.exchange}</small>    
                            </span>
                        </div>
                        <div className="flex gap-8 flex-col md:flex-row">
                            <div className="bg-green border-2 w-full md:w-1/2 border-green p-4 rounded-xl text-black">
                                <div>
                                    <h5 className="font-black ml-1 mb-3">Ticker: {stock.ticker }</h5>
                                    <span className="flex items-end gap-2 mb-4">
                                        <h1 className="text-8xl">{stockQuote?.c ?? '0.00'}</h1>
                                        <small className=" text-lg font-black mb-2">{stock.currency}</small>
                                    </span>
                                    <span className="flex gap-3 flex-wrap">
                                        <span>Previous Close Price: <span className="font-bold">{stockQuote.pc}</span></span>
                                        <span>Open Price: <span className="font-bold">{stockQuote.o}</span></span>
                                        <span>Percent Change: <span className="font-bold">{stockQuote.dp}% ({stockQuote.d})</span></span>
                                        <span>High: <span className="font-bold">{stockQuote.h}</span></span>
                                        <span>Low: <span className="font-bold">{stockQuote.l}</span></span>
                                    </span>
                                </div>
                            </div>
                            <div className="border-2 w-full md:w-1/2 p-4 rounded-xl text-white">
                                <h2 className="font-bold mb-2">Company Details</h2>
                                <div className="flex flex-col gap-2">
                                    <span  className="text-xl" >Website: <a className="font-black text-green underline underline-offset-4" href={stock.weburl}>{stock.weburl}</a></span>
                                    <span  className="text-xl" >Country: <span className="font-bold  text-green">{stock.country}</span></span>
                                    <span  className="text-xl" >Industry: <span className="font-bold text-green">{stock.finnhubIndustry}</span> </span>
                                    <span  className="text-xl" >IPO Date: <span className="font-bold text-green">{stock.ipo}</span></span>
                                    <span  className="text-xl" >Market Capitalization: <span className="font-bold text-green">{stock.marketCapitalization.toLocaleString()} ({stock.currency} in thousands)</span> </span>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section>
                        <div className="flex w-full justify-between items-center mb-4">
                            <h1 className='font-extrabold text-green text-4xl'>Market News</h1>
                        </div>
                        <div className="max-h-[50vh] overflow-auto mb-16">
                            {
                                companyMarketNews.map((newsObj, idx) => {
                                    return (
                                        <a href={newsObj.url} key={idx} className="flex gap-4 p-4 border-2 border-gray-700 hover:border-green duration-150 border-b-transparent last:border-b-gray-700"> 
                                            <div className="w-[150px] flex items-center justify-center overflow-hidden">
                                                <img className=" h-full w-full object-cover" src={newsObj.image} />
                                            </div>
                                            <div className="w-[calc(100%-30px-1rem)] p-2">
                                                <h1 className="text-green text-xl font-bold">{newsObj.headline}</h1>
                                                <p>{newsObj.summary}</p>
                                                <small><span className="text-green">{newsObj.source.toLocaleUpperCase()}</span> | {newsObj.category.toLocaleUpperCase()}</small>
                                                
                                            </div>

                                        </a>
                                    )
                            })
                        }
                        </div>

                    </section>
                </main>
                <Footer />
            </>
        )
    }
}