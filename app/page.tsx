import Menu from "./_components/Menu";
import Hero from "./_components/Hero";
import Link from "next/link";

export default function Home() {
    return (
        <section className='bg-gradient-to-r to-black via-black from-sky-900/20 '>
            <Hero path="/theCoveBanner.jpg" title="...As Unique as your imagination..." lounge="Apartment & Lounge"/>
            <div className="flex justify-center mt-4 pt-8 lg:pt-0">
                <Link href="#starters" className="px-4 py-2 mx-2 rounded-md bg-orange-500 text-white" style={{ touchAction: 'manipulation' }}>
                    Go to the Kitchen Menu
                </Link>
            </div>
            <Menu />
        </section>
    );
}
