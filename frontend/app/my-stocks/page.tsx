"use client"

import Footer from "@/components/footer-component"
import Header from "@/components/header-component"
import { APIStockQuoteResponse, AllStocksResponse, stock } from "@/models/stocks.models"
import { getProfileStocks, isEmpty, removeStock } from "@/utils/helpers"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

export default function MyStocksList() {

    const [ isLoading, setLoading ] = useState<boolean>(true)
    const [ stocks, setStocks ] = useState<stock[] | []>([])
    const [ stockQuotes, setStockQuotes ] = useState([])
    const [ titleFilter, setTitleFilter ] = useState("")

    const router = useRouter()

    useEffect(() =>{

        const stockTickers = getProfileStocks()

        fetch(process.env.NEXT_PUBLIC_BACKEND_URL! + '/stocks?q='+ stockTickers.join(','),
        {
            next: {
                revalidate: 3600
            }  
        })
        .then(res => res.json())
        .then( (data:AllStocksResponse) => {
            if(!isEmpty(data.error)){
                console.log(data.error)
                setLoading(false)
            } else {
                setStocks(data.data.filter((stock)=> {return stock.type == "Common Stock" }))
                setLoading(false)
            }
        })
        .catch((err) =>{
            console.error(err)
        })
    }, [])

    function sortAlphabetically(a:stock, b:stock){
        if (a.displaySymbol < b.displaySymbol) {
            return -1;
          }
          if (a.displaySymbol > b.displaySymbol) {
            return 1;
          }
          return 0;
    }


    let filteredStocks: stock[] | [] = stocks.filter( (stock)=> { return ( stock.description.toLowerCase().includes(titleFilter.toLowerCase()) || stock.displaySymbol.toLowerCase().includes(titleFilter.toLowerCase()) )} ).sort(sortAlphabetically)
                        
    function handleRemoveStock(e:any, ticker:string){ // let it slide
        e.preventDefault()
        removeStock(ticker)
        setStocks(stocks.filter((stock)=>{stock.displaySymbol != ticker}))
        router.refresh()

    }

    return (
        <>
            <Header />
			<main className='min-h-screen w-full px-6 pt-24 md:px-36 text-white'>
                <div className="flex w-full justify-between items-center mb-4">
                    <h1 className='font-extrabold text-green text-3xl md:text-4xl'>My Portfolio</h1>
                    <span className="mr-2">
                        <FontAwesomeIcon className="absolute my-3 ml-3" icon={faSearch} />
                        <input className="w-[150px] md:w-auto text-white bg-gray-900 rounded-full p-2 pl-10" onChange={(e)=>setTitleFilter(e.target.value)}/>
                    </span>
                </div>
                <div className=" max-h-[70vh] overflow-auto">

                        { isLoading && [1, 2, 3, 4, 5, 6, 7].map((item, idx) => {
                                return(
                                        <div className="w-full flex gap-2 p-2 items-center border-2 border-gray-700 border-b-[1px] hover:border-green duration-150" key={idx}>
                                            
                                            <span className=" w-1/12 flex flex-col items-center gap-2">
                                                <small className="bg-gray-600 w-1/4 h-5 rounded-full animate-pulse"></small>
                                                <small className="bg-gray-600 w-1/2 h-5 rounded-full animate-pulse"></small>
                                            
                                            </span>
                                            <span className="w-9/12 flex gap-2 flex-col">
                                                <h1 className="m-0 w-1/2 h-5 rounded-full animate-pulse bg-gray-600 font-extrabold"></h1>
                                                <h5 className="text-gray-600 w-1/4 h-5 animate-pulse rounded-full bg-gray-600" ></h5>
                                            </span>
                                            <button className=" w-2/12 h-7 rounded-full animate-pulse bg-gray-600"></button>
                                        </div>
                                )
                            })
                        }


                        { !isLoading && filteredStocks.length != 0 && filteredStocks.map((stock, idx) => {
                            return (
                                    <Link href={`/stock/${stock.displaySymbol}`} className="w-full flex gap-2 p-2 items-center border-2 border-gray-700 border-b-[1px] hover:border-green duration-150" key={idx}>
                                            <span className="w-2/12 md:w-1/12 flex flex-col items-center gap-1 md:gap-2">
                                                <small className="text-sm md:text-base rounded-full text-green">USD</small> {/* recieve stocks currency attr when we take on intl markets */}
                                                <small className="rounded-full text-md md:text-lg text-green font-black">{stock.displaySymbol}</small>
                                            </span>
                                            <span className="w-7/12 md:w-9/12 flex gap-0 md:gap-2 flex-col">
                                                <h1 className="m-0 rounded-full font-extrabold">{stock.description}</h1>
                                                <h5 className="text-gray-600 rounded-full" >{stock.type}</h5>
                                            </span>
                                            <span className="w-3/12 md:w-2/12 flex item gap-4 flex-row-reverse">
                                                <button className="rounded-full py-2 px-4 hover:bg-green hover:text-black duration-150 bg-gray-600" onClick={(e)=>{ handleRemoveStock(e, stock.displaySymbol)}}>REMOVE <span className="hidden md:block">STOCK</span></button>
                                            </span>
                                        </Link>
                            )
                        })}

                        { !isLoading && filteredStocks.length == 0 && titleFilter != "" && 
                        <>
                            <p>Oh no! There are no stocks in your profile. Add stocks to monitor them here.</p>
                        </>
                        }
                </div>
            </main>
            <Footer />
        </>
    )

}