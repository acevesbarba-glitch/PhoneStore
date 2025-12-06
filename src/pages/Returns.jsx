import { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { phones } from "../data/phones.js";
import "../css/Returns.css";
import ReturnProcess from "../components/Returns/ReturnProcess";
const formatMXN = (n) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);
function AlertModal({ open, title, message, type = "info", onClose }) {
  if (!open) return null;
  const titleClass = `modal__title modal__title--${type}`;
  return createPortal(
    (
      <div
        className="modal__backdrop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal__card">
          <h3 id="modal-title" className={titleClass}>{title}</h3>
          <p className="modal__message">{message}</p>
          <button className="modal__button" onClick={onClose}>Aceptar</button>
        </div>
      </div>
    ),
    document.body
  );
}
export default function Returns() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState(() => new Set());
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState("info"); 
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const idNumber = parseInt(orderId, 10);
    if (Number.isNaN(idNumber)) {
      const msg = "El número de pedido debe ser un número válido.";
      setMessage(msg);
      setAlertType("error");
      setAlertTitle("Error al buscar pedido");
      setAlertMsg(msg);
      setAlertOpen(true);
      setOrder(null);
      return;
    }
    try {
      const resp = await fetch("http://localhost:3001/api/orders/find", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: idNumber, email }),
      });
      let data = null;
      try {
        data = await resp.json();
      } catch {
        print("Error");
      }
      if (!resp.ok || !data?.success) {
        const msg = data?.message || `Error (${resp.status}) al buscar el pedido.`;
        setOrder(null);
        setSelected(new Set());
        setMessage(msg);
        setAlertType("error");
        setAlertTitle("Búsqueda de pedido");
        setAlertMsg(msg);
        setAlertOpen(true);
        return;
      }
      setOrder(data.order);
      setSelected(new Set());
    } catch (err) {
      console.error(err);
      const msg = "Error de red al buscar el pedido.";
      setMessage(msg);
      setAlertType("error");
      setAlertTitle("Búsqueda de pedido");
      setAlertMsg(msg);
      setAlertOpen(true);
    }
  };
  const enrichedItems = useMemo(() => {
    if (!order) return [];
    return order.items.map((item) => {
      const phone = phones.find((p) => p.id === item.id);
      return {
        ...item,
        brand: phone?.brand,
        image: phone?.image || "/placeholder.png",
      };
    });
  }, [order]);
  const orderTotals = useMemo(() => {
    if (!order) return { qty: 0, subtotal: 0, grand: 0 };
    const qty = order.totalQuantity;
    const subtotal = order.totalAmount_mxn;
    const grand = subtotal;
    return { qty, subtotal, grand };
  }, [order]);
  const selectionTotals = useMemo(() => {
    if (!order) return { qty: 0, subtotal: 0, grand: 0 };
    if (selected.size === 0) return null;
    const filtered = enrichedItems.filter((i) => selected.has(i.id));
    const qty = filtered.reduce((acc, i) => acc + (i.quantity ?? 0), 0);
    const subtotal = filtered.reduce((acc, i) => acc + (i.subtotal_mxn ?? 0), 0);
    const grand = subtotal;
    return { qty, subtotal, grand };
  }, [order, enrichedItems, selected]);
  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  return (
    <div className="returns-page">
      <AlertModal
        open={alertOpen}
        type={alertType}
        title={alertTitle}
        message={alertMsg}
        onClose={() => setAlertOpen(false)}
      />
      <section className="returns__search-panel">
        <h1>Inicia tu devolución</h1>
        <p>Ingresa tu número de pedido y tu correo para encontrar tu compra.</p>
        <form onSubmit={handleSubmit} className="returns__form">
          <div className="returns__form-row">
            <label htmlFor="orderId">Número de pedido</label>
            <input
              id="orderId"
              type="number"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Ej. 1"
              required
            />
          </div>
          <div className="returns__form-row">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@hotmail.com"
              required
            />
          </div>
          <button type="submit" className="btn btn--primary">Buscar pedido</button>
        </form>
        {message && <p className="returns__msg">{message}</p>}
      </section>
      {order && (
        <section className="content">
          <div className="cards">
            {enrichedItems.map((item) => (
              <div key={item.id} className="card">
                <div className="card__img-wrap">
                  <img src={item.image} alt={item.name} className="card__img" />
                </div>
                <div className="card__body">
                  <h4 className="card__title">{item.name}</h4>
                  {item.brand && <p className="card__brand">{item.brand}</p>}
                  {item.description && <p className="card__desc">{item.description}</p>}

                  <div className="card__row">
                    <span className="card__label">Precio unitario:</span>
                    <span className="card__value">{formatMXN(item.price_mxn)}</span>
                  </div>
                  <div className="card__row">
                    <span className="card__label">Cantidad:</span>
                    <span className="card__value">{item.quantity}</span>
                  </div>
                  <div className="card__row">
                    <span className="card__label">Subtotal:</span>
                    <span className="card__value">{formatMXN(item.subtotal_mxn)}</span>
                  </div>
                  <div className="card__row-select">
                    <label className="card__checkbox">
                      <input
                        type="checkbox"
                        checked={selected.has(item.id)}
                        onChange={() => toggleSelect(item.id)}
                      />
                      Seleccionar para devolución
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <aside className="summary">
            <h3>Desglose del pedido</h3>
            <div className="summary__row">
              <span>Artículos</span>
              <span>{orderTotals.qty}</span>
            </div>
            <div className="summary__row">
              <span>Total</span>
              <span>{formatMXN(orderTotals.grand)}</span>
            </div>
            {selectionTotals && (
              <>
                <hr className="summary__divider" />
                <h4>Seleccionados para devolución</h4>
                <div className="summary__row">
                  <span>Artículos</span>
                  <span>{selectionTotals.qty}</span>
                </div>
                <div className="summary__row">
                  <span>Total</span>
                  <span>{formatMXN(selectionTotals.grand)}</span>
                </div>
              </>
            )}
            <ReturnProcess
              orderId={order.orderId}
              email={email}
              selectedIds={Array.from(selected)}
              className="btn btn--danger"
              onSuccess={({ type, updatedOrder, message: msg }) => {
                setMessage(msg);
                setAlertType("success");
                setAlertTitle("Devolución realizada");
                const textoTipo = type === "full" ? "completa" : "parcial";
                setAlertMsg(`La devolución ${textoTipo} se procesó correctamente.`);
                setAlertOpen(true);

                if (type === "full") {
                  setOrder(null);
                  setSelected(new Set());
                } else {
                  setOrder(updatedOrder);
                  setSelected(new Set());
                }
              }}
              onError={(msg) => {
                setMessage(msg);
                setAlertType("error");
                setAlertTitle("Error al procesar devolución");
                setAlertMsg(msg);
                setAlertOpen(true);
              }}
            >
              Iniciar devolución
            </ReturnProcess>

            <div className="summary__order-meta">
              <p><strong>Pedido:</strong> #{order.orderId}</p>
              <p><strong>Cliente:</strong> {order.customer?.name ?? "—"}</p>
              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(order.createdAt).toLocaleString("es-MX")}
              </p>
              <p><strong>Estatus:</strong> {order.status}</p>
            </div>
          </aside>
        </section>
      )}
    </div>
  );
}