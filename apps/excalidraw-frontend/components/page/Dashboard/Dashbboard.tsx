import Features from "./page/Features";
import Footer from "./page/Footer";
import Header from "./page/Header";
import Hero from "./page/Hero";

export default function Dashboard () {

    return <div>
        <Header />
        <main>
            <Hero />
            <Features />
        </main>
        <Footer />
    </div>
}