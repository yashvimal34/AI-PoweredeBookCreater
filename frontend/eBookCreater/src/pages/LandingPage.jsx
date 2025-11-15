import Features from "../components/landing/Features"
import Hero from "../components/landing/Hero"
import Navbar from "../components/layout/Navbar"

const LandingPage = () => {
    return (
        <div className="mb-[100vh]">
            <Navbar />
            <Hero />
            <Features />
        </div>
    )
}
export default LandingPage