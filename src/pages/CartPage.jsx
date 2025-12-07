import React, { useState } from "react";
import CartItem from "../components/CartItem.jsx";
import CartModal from "../components/CartModal.jsx";
import { useCartContext } from "../context/CartContext";
function CartPage() {
  const { cartItems, clearCart } = useCartContext();
  const [showModal, setShowModal] = useState(false);
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    address: "",
    paymentMethod: "",
  });
  const currency = (n) => `$ ${Number(n || 0).toLocaleString("en-US")}`;
  const total = cartItems.reduce(
    (acc, it) => acc + (Number(it.price_mxn) || 0) * (Number(it.quantity) || 0),
    0
  );
  const totalQuantity = cartItems.reduce(
    (acc, item) => acc + (Number(item.quantity) || 0),
    0
  );
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };
  const handlePurchaseClick = () => {
    if (cartItems.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }
    setShowModal(true);
  };
  const handleConfirmPurchase = async () => {
    if (
      !customer.name ||
      !customer.email ||
      !customer.address ||
      !customer.paymentMethod
    ) {
      alert("Por favor completa todos los datos.");
      return;
    }
    try {
      const response = await fetch("http://localhost:3001/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          total,
          totalQuantity,
          customer,
        }),
      });
      if (!response.ok) throw new Error("Error al procesar la compra");
      const data = await response.json();
      alert(`Compra realizada con éxito. Orden #${data.orderId}`);
      clearCart();
      setShowModal(false);
      setCustomer({ name: "", email: "", address: "", paymentMethod: "" });
    } catch (error) {
      console.error(error);
      alert("Hubo un problema al realizar la compra.");
    }
  };
  const handleClearCart = () => {
    const ok = window.confirm("¿Seguro que deseas vaciar todo el carrito?");
    if (ok) clearCart();
  };
  return (
    <section className="cart">
      <h2>Total de artículos en tu carrito: {totalQuantity}</h2>
      <div className="cart__actions">
        <button
          className="btn btn--danger"
          type="button"
          onClick={handleClearCart}
          disabled={cartItems.length === 0}
        >
          Vaciar carrito
        </button>

        <button
          className="btn btn--primary"
          type="button"
          onClick={handlePurchaseClick}
          disabled={cartItems.length === 0}
        >
          Realizar Compra
        </button>
      </div>
      <div className="cart__items">
        {cartItems.length === 0 ? (
          <p className="cart__empty">Tu carrito está vacío.</p>
        ) : (
          cartItems.map((item) => <CartItem key={item.id} item={item} />)
        )}
      </div>
      <div className="cart__total-row">
        <div className="cart__total">
          Total: <strong>{currency(total)}</strong>
        </div>
      </div>
      {showModal && (
        <CartModal
          onClose={() => setShowModal(false)}
          customer={customer}
          handleChange={handleChange}
          handleConfirmPurchase={handleConfirmPurchase}
          total={total}
          totalQuantity={totalQuantity}
          currency={currency}
        />
      )}
    </section>
  );
}
export default CartPage;