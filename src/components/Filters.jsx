//Filters
import "../css/styles.css";
export default function Filters({
  uniqueBrands = [],
  uniqueYears = [],
  selectedBrand = "",
  selectedYear = "",
  onBrandChange,
  onYearChange,
  onReset,
  showFilters = true,
  toggleFilters,
}) {
  return (
    <>
      <button
        className="filters__toggle-btn"
        type="button"
        onClick={toggleFilters}
      >
        {showFilters ? "Ocultar filtros ▲" : "Mostrar filtros ▼"}
      </button>
      <div className={`filters ${showFilters ? "filters--open" : "filters--collapsed"}`}>
        <div className="filters__wrapper">
          <div className="filters__label">MARCAS</div>
          <div className="filters__buttons">
            <button
              type="button"
              className={`filters__btn ${selectedBrand === "" ? "filters__btn--active" : ""}`}
              onClick={() => onBrandChange("")}
            >
              Todas
            </button>
            {uniqueBrands.map((brand) => (
              <button
                type="button"
                key={brand}
                className={`filters__btn ${selectedBrand === brand ? "filters__btn--active" : ""}`}
                onClick={() => onBrandChange(brand)}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
        <br></br>    
        <div className="filters__wrapper">
          <div className="filters__label">AÑOS</div>
          <div className="filters__buttons">
            <button
              type="button"
              className={`filters__btn ${selectedYear === "" ? "filters__btn--active" : ""}`}
              onClick={() => onYearChange("")}
            >
              Todos
            </button>
            {uniqueYears.map((year) => (
              <button
                type="button"
                key={year}
                className={`filters__btn ${Number(selectedYear) === year ? "filters__btn--active" : ""}`}
                onClick={() => onYearChange(String(year))}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
        <br></br>  
        <div className="filters__actions">
          <button
            type="button"
            className="filters__btn"
            onClick={onReset}
          >
            Limpiar filtros
          </button>
        </div>
      </div>
    </>
  );
}