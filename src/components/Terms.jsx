import "../css/styles.css";
export default function Terms() {
  return (
    <section className="terms">
      <h1 className="terms__title">Términos y Condiciones</h1>
      <p className="terms__intro">
        Bienvenido a nuestra tienda. Al utilizar este sitio web, aceptas los siguientes términos y condiciones:
      </p>
      <ol className="terms__list">
        <li className="terms__item">Los precios y disponibilidad de productos pueden cambiar sin previo aviso.</li>
        <li className="terms__item">El uso de este sitio implica la aceptación de nuestras políticas de privacidad.</li>
        <li className="terms__item">Plazo de devolución, Aceptamos devoluciones dentro de los 30 días posteriores a la entrega del producto.</li>
        <li className="terms__item">No nos hacemos responsables por errores tipográficos o técnicos.</li>
      </ol>
      <p className="terms__footer">
        Para más información, contáctanos a través de nuestro formulario de contacto.
      </p>
    </section>
  );
}
