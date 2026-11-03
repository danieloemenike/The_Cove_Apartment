import Menu from "./_components/Menu";
import Hero from "./_components/Hero";
import Footer from "./_components/Footer";
import { getPublicMenu } from "@/lib/menus/public";

export const dynamic = "force-dynamic";

export default async function Home() {
    const categories = await getPublicMenu();

    return (
        <main className="min-h-screen bg-ink text-cream">
            <Hero path="/theCoveBanner.jpg" title="As unique as your imagination." lounge="Apartment & Lounge"/>
            <Menu categories={categories} />
            <Footer />
        </main>
    );
}
