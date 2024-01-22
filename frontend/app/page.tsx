import Footer from '@/components/footer-component'
import Header from '@/components/header-component'
import StocksList from '@/components/stockslist-component'
import Image from 'next/image'


export default function Home() {

	return (
		<>
			<Header />
			<main className='min-h-screen w-full px-12 pt-24 md:px-36 text-white'>
				<section>
					<div>
						<StocksList />
					</div>
				</section>
			</main>
			<Footer />
		</>
	)
}