
import CustomerGContain from "../Components/CustomerG/CustomerGContatin";
import Footer from "../Components/Footer/Fotter";
import Header from "../Components/Header/Header";

const CustomerG = () => {
    return (
        <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <main className="flex-grow">
         <CustomerGContain/>
         
        </main>
        <Footer />
      </div>
      );
    }
    
  
  export default CustomerG;
  