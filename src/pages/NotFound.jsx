import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <section className="not-found">
      <h1>404 - Página no encontrada</h1>
      <p>Lo sentimos, la página que buscas no existe.</p>
      <Link to="/phones" className="btn btn--primary">
        Volver al inicio
      </Link>
    </section>
  );
}
