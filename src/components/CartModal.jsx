import React from "react";
import "../css/styles.css";
export default function CartModal({
  onClose,
  customer,
  handleChange,
  handleConfirmPurchase,
  total,
  totalQuantity,
  currency
}) {
  return (
    <div className="cart__modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="checkoutModalTitle">
      <div className="cart__modal-card">
        <div className="cart__modal-header">
          <h3 id="checkoutModalTitle">Confirmar compra</h3>
          <button className="btn btn--icon btn--close" aria-label="Cerrar" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="cart__modal-body">
          <p className="cart__modal-subtitle">Completa tus datos para finalizar la orden.</p>

          <div className="cart__form-grid">
            <label className="cart__form-field">
              <span>Nombre completo</span>
              <input
                type="text"
                name="name"
                value={customer.name}
                onChange={handleChange}
                placeholder="Ej.: Juan Perez Garcia"
              />
            </label>

            <label className="cart__form-field">
              <span>Correo electrónico</span>
              <input
                type="email"
                name="email"
                value={customer.email}
                onChange={handleChange}
                placeholder="tucorreo@correo.com"
              />
            </label>

            <label className="cart__form-field">
              <span>Dirección</span>
              <input
                type="text"
                name="address"
                value={customer.address}
                onChange={handleChange}
                placeholder="Calle, número, colonia, ciudad"
              />
            </label>

            <label className="cart__form-field">
              <span>Método de pago</span>
              <select name="paymentMethod" value={customer.paymentMethod} onChange={handleChange}>
                <option value="">Selecciona método</option>
                <option value="Tarjeta">Tarjeta</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Efectivo">Efectivo</option>
              </select>
            </label>
          </div>

          <div className="cart__modal-summary">
            <div>Artículos: <strong>{totalQuantity}</strong></div>
            <div>Total: <strong>{currency(total)}</strong></div>
          </div>
        </div>

        <div className="cart__modal-footer">
          <button className="btn btn--secondary" onClick={onClose}>Cancelar</button>
          <button className="btn btn--primary" onClick={handleConfirmPurchase}>Confirmar Compra</button>
        </div>
      </div>
    </div>
  );
}
