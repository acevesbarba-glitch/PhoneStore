import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Phones from "./pages/Phones";
import PhonePage from "./pages/PhonePage";
import CartPage from "./pages/CartPage";
import Returns from "./pages/Returns";
import NotFound from "./pages/NotFound";
import Terms from "./components/Terms/Terms"; 
import ContactInfo from './components/Contact/ContactInfo';
function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<Navigate to="/phones" />} />
          <Route path="/phones" element={<Phones />} />
          <Route path="/phone/:id" element={<PhonePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/terms" element={<Terms />} /> 
          <Route path="/contact" element={<ContactInfo />} /> 
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
export default App;