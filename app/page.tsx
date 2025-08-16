import Menu from "./_components/Menu";
import Hero from "./_components/Hero";

export default function Home() {
    return (
        <section className='bg-gradient-to-r to-black via-black from-sky-900/20 '>
         <Hero path="/theCoveBanner.jpg" title="...As Unique as your imagination..." lounge="Apartment & Lounge"/>
            <Menu />
        </section>
    );
}
