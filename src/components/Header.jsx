// src/components/Header/Header.jsx
import { Link } from "react-router-dom";
import { useCartContext } from "../context/CartContext";
import "../css/styles.css";
export default function Header() {
  
  const ctx = useCartContext() || {};
  const itemsSource = ctx.cartItems ?? ctx.cart;                      
  const items = Array.isArray(itemsSource) ? itemsSource : [];        
  const itemCount = items.reduce((sum, it) => sum + (Number(it?.quantity) || 0), 0);
  return (
    <header className="header">
      <h1 className="header__logo">Tienda Virtual</h1>
      <nav className="header__nav">
        <Link className="header__link" to="/phones">Telefonos</Link>
        <Link className="header__link header__link--cart" to="/cart">
          Carrito{" "}
          {/* Muestra el contador solo si hay elementos */}
          {itemCount > 0 && <span className="cart-badge">({itemCount})</span>}
        </Link>
        <Link className="header__link" to="/Returns">Devoluciones</Link>
        <Link className="header__link" to="/terms">Terminos y condiciones</Link>
        <Link className="header__link" to="/contact">Contacto</Link>
      </nav>
    </header>
  );
}