// src/components/CartItem/CartItem.jsx
import React from 'react';
import { useCartContext } from '../../context/CartContext';
import "../../css/CartItem.css";

export default function CartItem({ item }) {
  const { removeItem, updateQuantity } = useCartContext();

  // Saneamos valores (mínimo cantidad = 1)
  const price_mxn =
    typeof item === 'object' && typeof item.price_mxn === 'number' ? item.price_mxn : 0;
  const rawQty =
    typeof item === 'object' && typeof item.quantity === 'number'
      ? item.quantity
      : 1;
  const quantity = Math.max(1, rawQty);
  const subtotal = price_mxn * quantity;

  const currency = (n) => `$ ${Number(n).toLocaleString("en-US")}`;

  const handleRemove = () => {
    if (typeof removeItem === 'function') removeItem(item.id);
  };

  const handleQuantityChange = (event) => {
    const parsed = parseInt(event.target.value, 10);
    const newQuantity = Number.isFinite(parsed) ? Math.max(1, parsed) : 1;
    updateQuantity(item.id, newQuantity);
  };

  return (
    <div className="cart-item">
      {/* Parte Superior: IMAGEN (wrapper + img interno) */}
      <div className="cart-item__image">
        <img src={item.image} alt={item.name} />
      </div>

      {/* Parte Inferior: DETALLES Y CONTROLES */}
      <div className="cart-item__content">
        <h3 className="cart-item__name">{item.name}</h3>

        <div className="cart-item__info-grid">
          <p>Precio unitario:</p>
          <span className="value">{currency(price_mxn)}</span>

          <p>Cantidad:</p>
          <div className="cart-item__quantity-controls">
            <input
              type="number"
              id={`quantity-${item.id}`}
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
              className="cart-item__input"
            />
          </div>

          <p>Subtotal:</p>
          <span className="value">{currency(subtotal)}</span>
        </div>

        {/* Botón de eliminar – estilo previo */}
        <button
          className="cart-item__remove-button-bottom"
          onClick={handleRemove}
          type="button"
          aria-label={`Eliminar ${item.name} del carrito`}
        >
          ❌   Eliminar
        </button>
      </div>
    </div>
  );
}
