import AboutUsContain from "../Components/AboutUs/AboutContain";
import Footer from "../Components/Footer/Fotter";
import Header from "../Components/Header/Header";

const AboutUs = () => {
    return (
        <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <main className="flex-grow">
         <AboutUsContain/>
         
        </main>
        <Footer />
      </div>
      );
    }
    
  
  export default AboutUs;
  