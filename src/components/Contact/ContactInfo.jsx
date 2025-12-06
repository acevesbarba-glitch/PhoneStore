import "../../css/PhoneCard.css";
export default function ContactInfo() {
  return (
    <section className="contact">
      <h2 className="contact__title">Datos de Contacto</h2>
      <ul className="contact__list">
        <li className="contact__item">
          <span className="contact__label">Teléfono:</span> +52 664 123 0000
        </li>
        <li className="contact__item">
          <span className="contact__label">Correo:</span> soporte@tiendavirtual.com
        </li>
        <li className="contact__item">
          <span className="contact__label">Dirección:</span> Blvd. Insurgentes #123, Tijuana, BC
        </li>
        <li className="contact__item">
          <span className="contact__label">Horario:</span> Lunes a Viernes, 9:00 AM - 6:00 PM
        </li>
      </ul>
    </section>
  );
}
