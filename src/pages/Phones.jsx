import { phones } from "../data/phones";
import PhoneList from "../components/PhoneList/PhoneList";
import "../css/CartPage.css";
export default function Phones() {
  return (
    <div className="phones">
      <h2 className="phones__title">Teléfonos disponibles</h2>
      <PhoneList phones={phones} />
    </div>
  );
}