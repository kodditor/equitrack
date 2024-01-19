import Image from "next/image";
import Link from "next/link";


export default function Header(){


    return (
        <>
            <div className="header-gradient z-20"></div>
            <nav className="w-[calc(100%-18rem)] z-50 border-2 border-gray-700 ml-[9rem] flex justify-between bg-black px-5 py-2 fixed top-5 m-auto items-center rounded-full">    
                <Image src={'/logo-white.webp'} width={100} height={30} alt="The Equitrack Logo" priority/>
                <ul className="hidden md:flex gap-4">
                    <Link href={''} className="text-white hover:text-green" ><li>All Stocks</li></Link>
                    <Link href={''} className="text-white hover:text-green" ><li>My Stocks</li></Link>
                </ul>
            </nav>
        </>
    )
}