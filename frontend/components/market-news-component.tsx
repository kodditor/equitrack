"use client"

import { APIMarketNewsResponse, MarketNewsData } from "@/models/market-news.model";
import { isEmpty } from "@/utils/helpers";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { useEffect, useState } from "react";


export default function MarketNewsList() {

    const [ isLoading, setLoading ] = useState<boolean>(true)
    const [ newsFilter, setNewsFilter ] = useState("")
    const [ news , setNews ] = useState<MarketNewsData[]|[]>([])

    useEffect(() =>{
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL! + '/market-news',
        {
            next: {
                revalidate: 3600
            }
        })
        .then(res => res.json())
        .then( (data:APIMarketNewsResponse) => {
            if(!isEmpty(data.error)){
                console.log(data.error)
                setLoading(false)
            } else {
                setNews(data.data)
                setLoading(false)
            }
        })
        .catch((err) =>{
            console.error(err)
        })
    }, [])

    let filteredNews: MarketNewsData[] | [] = news.filter( (newsObj)=> { return ( newsObj.headline.toLowerCase().includes(newsFilter.toLowerCase()) || newsObj.summary.toLowerCase().includes(newsFilter.toLowerCase()) )} )

    return (
        <>
            <div className="flex w-full justify-between items-center mb-4">
                <h1 className='font-extrabold text-green text-3xl md:text-4xl'>Market News</h1>
                <span className="mr-2">
                    <FontAwesomeIcon className="absolute my-3 ml-3" icon={faSearch} />
                    <input className="w-[150px] md:w-auto text-white bg-gray-900 rounded-full p-2 pl-10" onChange={(e)=>setNewsFilter(e.target.value)}/>
                </span>
            </div>
            <div className="max-h-[50vh] overflow-auto mb-16">
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
                    { !isLoading && filteredNews.map((newsObj, idx) => {
                       
                        return (
                            <a href={newsObj.url} key={idx} className="flex flex-col md:flex-row gap-4 p-4 border-2 border-gray-700 hover:border-green duration-150 border-b-transparent last:border-b-gray-700"> 
                                <div className="w-full md:w-[150px] flex items-center justify-center overflow-hidden">
                                    <img className=" h-full w-full object-cover" alt={`${newsObj.headline} Image`} src={newsObj.image} />
                                </div>
                                <div className="w-full md:w-[calc(100%-30px-1rem)] p-2">
                                    <h1 className="text-green text-xl font-bold">{newsObj.headline}</h1>
                                    <p className="text-md md:text-base">{newsObj.summary}</p>
                                    <small><span className="text-green">{newsObj.source.toLocaleUpperCase()}</span> | {newsObj.category.toLocaleUpperCase()}</small>
                                    
                                </div>

                            </a>
                        )
                    })

                    }
                    { !isLoading && filteredNews.length == 0 && newsFilter != "" && 
                        <>
                            <p>{`No market news with term "${newsFilter}"`}</p>
                        </>
                    }

            </div>
        </>
    )
}