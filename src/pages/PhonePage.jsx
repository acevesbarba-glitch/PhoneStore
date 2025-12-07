import CartItem from "../components/CartItem.jsx";
import { useCartContext } from "../context/CartContext";
import "../css/styles.css";
export default function CartPage() {
  const { cartItems, clearCart } = useCartContext();
  const currency = (n) => `$ ${Number(n).toLocaleString("en-US")}`;
  const total = cartItems.reduce(
    (acc, it) => acc + (Number(it.price) || 0) * (Number(it.quantity) || 0),
    0
  );
  const handleClearCart = () => {
    const ok = window.confirm("¿Seguro que deseas vaciar todo el carrito?");
    if (ok) clearCart();
  };
  return (
    <section className="cart">
      <h2>Artículos en tu Carrito ({cartItems.length} tipos de artículo)</h2>
      <div className="cart__actions">
        <button
          className="btn btn--danger"
          onClick={handleClearCart}
          disabled={cartItems.length === 0}
          aria-disabled={cartItems.length === 0}
          type="button"
        >
          Vaciar carrito
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
        <button
          className="btn btn--danger"
          onClick={handleClearCart}
          disabled={cartItems.length === 0}
          aria-disabled={cartItems.length === 0}
          type="button"
        >
          Vaciar carrito
        </button>
      </div>
    </section>
  );
}