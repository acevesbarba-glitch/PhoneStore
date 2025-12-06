
import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const DATA_DIR     = path.resolve(__dirname, "../src/data");
const COUNTER_FILE = path.join(DATA_DIR, "order_counter.json");
const ORDERS_FILE  = path.join(DATA_DIR, "orders.json");

const ORDER_STATUS = {
  GENERATED: "GENERATED",
  PARTIAL_RETURN: "PARTIAL_RETURN",
  RETURNED: "RETURNED"
};

function ensureStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(COUNTER_FILE)) {
    fs.writeFileSync(COUNTER_FILE, JSON.stringify({ lastOrderId: 0 }, null, 2));
  }
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2));
  }
}

function loadOrders() {
  ensureStorage();
  const raw = fs.readFileSync(ORDERS_FILE, "utf-8") || "[]";
  return JSON.parse(raw);
}

function saveOrders(orders) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

function writePerOrderFile(order) {
  const perOrderFile = path.join(DATA_DIR, `order_${order.orderId}.json`);
  fs.writeFileSync(perOrderFile, JSON.stringify(order, null, 2));
}

function getNextOrderId() {
  const raw = fs.readFileSync(COUNTER_FILE, "utf-8");
  const counter = JSON.parse(raw || "{}");
  const next = Number(counter.lastOrderId || 0) + 1;
  counter.lastOrderId = next;
  fs.writeFileSync(COUNTER_FILE, JSON.stringify(counter, null, 2));
  return next;
}

function validateOrderPayload(body) {
  const errors = [];
  if (!Array.isArray(body.items) || body.items.length === 0) {
    errors.push("items es requerido y debe contener al menos un elemento.");
  }
  if (typeof body.total !== "number") {
    errors.push("total debe ser numérico.");
  }
  if (typeof body.totalQuantity !== "number") {
    errors.push("totalQuantity debe ser numérico.");
  }
  return errors;
}

function recalcTotals(order) {
  const qty = (order.items || []).reduce(
    (acc, it) => acc + (Number(it.quantity) || 0),
    0
  );
  const subtotal = (order.items || []).reduce(
    (acc, it) => acc + (Number(it.subtotal_mxn) || 0),
    0
  );
  order.totalQuantity = qty;
  order.totalAmount_mxn = subtotal;
}

function ensureStatusConsistency(order) {
  const itemsCount = (order.items || []).length;
  if (itemsCount === 0) {
    order.status = ORDER_STATUS.RETURNED;
  }
}

app.post("/api/checkout", (req, res) => {
  try {
    ensureStorage();

    const errors = validateOrderPayload(req.body);
    if (errors.length) {
      return res.status(400).json({ success: false, errors });
    }

    const orderId = getNextOrderId();

    const items = (req.body.items || []).map((it) => {
      const price = Number(it.price_mxn) || 0;
      const qty = Number(it.quantity) || 0;
      return {
        id: it.id,
        name: it.name,
        price_mxn: price,
        quantity: qty,
        subtotal_mxn: price * qty,
        description: it.description ?? undefined,
      };
    });

    const order = {
      orderId,
      createdAt: new Date().toISOString(),
      currency: "MXN",
      totalQuantity: Number(req.body.totalQuantity) || 0,
      totalAmount_mxn: Number(req.body.total) || 0,
      items,
      customer: req.body.customer || null,
      status: ORDER_STATUS.GENERATED,
    };

    recalcTotals(order);
    ensureStatusConsistency(order);

    const history = loadOrders();
    history.push(order);
    saveOrders(history);
    writePerOrderFile(order);

    return res.json({ success: true, orderId, order });
  } catch (err) {
    console.error("Error guardando pedido:", err);
    return res
      .status(500)
      .json({ success: false, error: "No se pudo generar/guardar la orden." });
  }
});

app.get("/api/orders", (_req, res) => {
  try {
    ensureStorage();
    const orders = loadOrders();
    return res.json({ success: true, orders });
  } catch (err) {
    console.error("Error leyendo pedidos:", err);
    return res
      .status(500)
      .json({ success: false, error: "No se pudo leer el archivo de órdenes." });
  }
});

app.post("/api/orders/find", (req, res) => {
  try {
    ensureStorage();
    const { orderId, email } = req.body;

    if (!Number.isInteger(orderId)) {
      return res
        .status(400)
        .json({ success: false, message: "orderId debe ser un número entero." });
    }

    const orders = loadOrders();
    const order = orders.find((o) => Number(o.orderId) === Number(orderId));

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "No se encontró el pedido." });
    }

    const savedEmail = order.customer?.email;
    if (
      savedEmail &&
      email &&
      savedEmail.toLowerCase() !== String(email).toLowerCase()
    ) {
      return res
        .status(403)
        .json({ success: false, message: "El correo no coincide con el del pedido." });
    }

    return res.json({ success: true, order });
  } catch (err) {
    console.error("Error buscando pedido:", err);
    return res
      .status(500)
      .json({ success: false, message: "Error interno al buscar el pedido." });
  }
});

app.post("/api/returns", (req, res) => {
  try {
    ensureStorage();
    const { orderId, email, selectedIds = [] } = req.body;

    if (!Number.isInteger(orderId)) {
      return res
        .status(400)
        .json({ success: false, message: "orderId debe ser numérico." });
    }

    const orders = loadOrders();
    const idx = orders.findIndex((o) => Number(o.orderId) === Number(orderId));
    if (idx === -1) {
      return res
        .status(404)
        .json({ success: false, message: "No se encontró el pedido." });
    }

    const order = orders[idx];

    const savedEmail = order.customer?.email;
    if (
      savedEmail &&
      email &&
      savedEmail.toLowerCase() !== String(email).toLowerCase()
    ) {
      return res
        .status(403)
        .json({ success: false, message: "El correo no coincide con el del pedido." });
    }

    const idsSet = new Set((selectedIds || []).map((x) => Number(x)));
    const isFullReturn = !selectedIds || selectedIds.length === 0;

    if (isFullReturn || order.items.every((it) => idsSet.has(Number(it.id)))) {
      order.items = [];
      ensureStatusConsistency(order);
      recalcTotals(order);
      orders[idx] = order;
      saveOrders(orders);
      writePerOrderFile(order);

      return res.json({
        success: true,
        type: "full",
        message: "Devolución completa realizada.",
        updatedOrder: null,
      });
    }

    const remaining = order.items.filter((it) => !idsSet.has(Number(it.id)));
    order.items = remaining;
    order.status = ORDER_STATUS.PARTIAL_RETURN;
    ensureStatusConsistency(order);
    recalcTotals(order);
    orders[idx] = order;
    saveOrders(orders);
    writePerOrderFile(order);

    return res.json({
      success: true,
      type: "partial",
      message: "Devolución parcial realizada.",
      updatedOrder: order,
    });
  } catch (err) {
    console.error("Error procesando devolución:", err);
    return res
      .status(500)
      .json({ success: false, message: "Error interno al procesar la devolución." });
  }
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  ensureStorage();
  console.log(`API escuchando en http://localhost:${PORT}`);
  console.log(`Pedidos e histórico se guardan en: ${DATA_DIR}`);
})