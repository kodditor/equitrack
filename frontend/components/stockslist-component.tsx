"use client"

import { AllStocksResponse, stock } from "@/models/stocks.models"
import { isEmpty } from "@/utils/helpers"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { Suspense, useEffect, useState } from "react"

export default function StocksList() {

    const [ isLoading, setLoading ] = useState<boolean>(true)
    const [ stocks, setStocks ] = useState<stock[] | []>([])
    const [ titleFilter, setTitleFilter ] = useState("")
    

    useEffect(() =>{
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL! + '/stocks',
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
                        

    return (
        <>
            <div className="flex w-full justify-between items-center mb-4">
                <h1 className='font-extrabold text-green text-4xl'>All Stocks</h1>
                <span className="mr-2">
                    <FontAwesomeIcon className="absolute my-3 ml-3" icon={faSearch} />
                    <input className="text-white bg-gray-900 rounded-full p-2 pl-10" onChange={(e)=>setTitleFilter(e.target.value)}/>
                </span>
            </div>
            <div className=" max-h-[50vh] overflow-auto">

                    { isLoading && [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, idx) => {
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
                                <Link href={`${location}stock/${stock.displaySymbol}`} className="w-full flex gap-2 p-2 items-center border-2 border-gray-700 border-b-[1px] hover:border-green duration-150" key={idx}>
                                        <span className=" w-1/12 flex flex-col items-center gap-2">
                                            <small className="rounded-full">{stock.currency}</small>
                                            <small className="rounded-full text-lg text-green font-black">{stock.displaySymbol}</small>
                                        
                                        </span>
                                        <span className="w-9/12 flex gap-2 flex-col">
                                            <h1 className="m-0 rounded-full font-extrabold">{stock.description}</h1>
                                            <h5 className="text-gray-600 rounded-full" >{stock.type}</h5>
                                        </span>
                                        <button className=" w-2/12 rounded-full py-2 hover:bg-green hover:text-black duration-150 bg-gray-600">VIEW STOCK</button>
                                    </Link>
                        )
                    })}

                    { !isLoading && filteredStocks.length == 0 && titleFilter != "" && 
                    <>
                        <p>No Stocks with term "{titleFilter}"</p>
                    </>
                    }
            
            </div>
        </>
    )

}