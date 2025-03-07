import Footer from "./Components/Footer/Fotter";
import Header from "./Components/Header/Header";
import MainPage from "./Pages/MainPage";


function App() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
    <Header />
    <main className="flex-grow">
      <MainPage />
    </main>
    <Footer />
  </div>
  );
}

export default App;