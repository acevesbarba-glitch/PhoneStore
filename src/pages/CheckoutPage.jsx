import { useCartContext } from "../context/CartContext";
export default function CheckoutPage() {
  const { cartItems } = useCartContext();
  const total = cartItems.reduce(
    (acc, it) => acc + (Number(it.price_mxn) || 0) * (Number(it.quantity) || 0),
    0
  );
  return (
    <section className="checkout-page">
      <h2>Resumen de tu compra</h2>
      <ul>
        {cartItems.map((item) => (
          <li key={item.id}>
            {item.name} x {item.quantity} = ${item.price_mxn * item.quantity}
          </li>
        ))}
      </ul>
      <h3>Total: ${total}</h3>
      <button className="btn btn-primary">Confirmar Compra</button>
    </section>
  );
}