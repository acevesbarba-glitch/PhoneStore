import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useCartContext } from "../../context/CartContext";
import "../../css/PhoneCard.css";

const NotificationPortal = ({ phone, showNotification }) => {
  if (!showNotification) return null;
  return ReactDOM.createPortal(
    <div className="notification">
      ✅ <b>{phone.name}</b> añadido al carrito
    </div>,
    document.body
  );
};
const PhoneModal = ({ phone, onClose }) => {
  return ReactDOM.createPortal(
    <div className="phone-modal__backdrop" onClick={onClose}>
      <div
        className="phone-modal__card"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="phone-modal__header">
          <h2 className="phone-modal__title">{phone.name}</h2>
          <button className="btn btn--icon btn--close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="phone-modal__body">
          <img
            src={phone.image}
            alt={phone.name}
            className="phone-modal__image"
          />
          <p className="phone-modal__field">
            <strong>Marca:</strong> {phone.brand}
          </p>
          <p className="phone-modal__field">
            <strong>Año:</strong> {phone.year}
          </p>
          <p className="phone-modal__field">
            <strong>Precio USD:</strong> ${Number(phone.price_usd).toLocaleString("en-US")}
          </p>
          <p className="phone-modal__field">
            <strong>Precio MXN:</strong> ${Number(phone.price_mxn).toLocaleString("en-US")}
          </p>
          <p className="phone-modal__field">
            <strong>Descripción:</strong> {phone.description}
          </p>
        </div>

        <div className="phone-modal__footer">
          <button className="btn btn--secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
export default function PhoneCard({ phone }) {
  const { addToCart } = useCartContext();
  const [showNotification, setShowNotification] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const currencyMXN = (n) => `$ ${Number(n).toLocaleString("en-US")}`;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const cleanedPrice = parseFloat(String(phone.price_mxn).toString().replace(/[^\d.]/g, ""));
    const productToAdd = { ...phone, price_mxn: cleanedPrice, quantity: 1 };

    addToCart(productToAdd);
    setShowNotification(true);
  };

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => setShowNotification(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  return (
    <>
      <div className="phone-card">
        <div className="phone-card__image">
          <img src={phone.image} alt={phone.name} />
        </div>

        <h3 className="phone-card__name" title={phone.name}>
          {phone.name}
        </h3>

        <span className="phone-card__price">{currencyMXN(phone.price_mxn)}</span>

        <div className="phone-card__actions">
          <button
            className="phone-card__button phone-card__button--carrito"
            onClick={handleAddToCart}
          >
            Añadir al Carrito
          </button>

          <button
            className="phone-card__button phone-card__button--detalle"
            onClick={() => setShowModal(true)}
          >
            Ver detalles
          </button>
        </div>
      </div>

      {showModal && <PhoneModal phone={phone} onClose={() => setShowModal(false)} />}
      <NotificationPortal phone={phone} showNotification={showNotification} />
    </>
  );
}
