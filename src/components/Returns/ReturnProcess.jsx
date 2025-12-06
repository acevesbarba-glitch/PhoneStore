
// src/components/Returns/ReturnProcess.jsx
import { useState } from "react";

export default function ReturnProcess({
  orderId,
  email,
  selectedIds = [],
  className = "btn btn--danger",
  children = "Iniciar devolución",
  onSuccess,
  onError,
}) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const resp = await fetch("http://localhost:3001/api/returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          email,
          selectedIds, // vacío => completa; ids => parcial
        }),
      });

      let data = null;
      try {
        data = await resp.json();
      } catch {
        // evitar crash si el backend responde con HTML (p. ej. 404)
      }

      if (!resp.ok || !data?.success) {
        onError?.(data?.message || `Error (${resp.status}) al procesar la devolución.`);
        return;
      }

      onSuccess?.({
        type: data.type,
        updatedOrder: data.updatedOrder ?? null,
        message: data.message,
      });
    } catch (err) {
      onError?.("Error de red al procesar la devolución.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button className={className} onClick={handleClick} disabled={loading}>
      {loading ? "Procesando..." : children}
    </button>
  );
}
