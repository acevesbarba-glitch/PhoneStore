import React, { useState, useMemo } from "react";
import PhoneCard from "../PhoneCard/PhoneCard";
import Filters from "../Filters/Filters.jsx";
import "../../css/PhoneList.css";

export default function PhoneList({ phones = [] }) {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [showFilters, setShowFilters] = useState(true);

  const uniqueBrands = useMemo(
    () => [...new Set(phones.map((p) => p.brand))].sort(),
    [phones]
  );

  const uniqueYears = useMemo(
    () => [...new Set(phones.map((p) => p.year))].sort((a, b) => b - a),
    [phones]
  );

  const filteredPhones = useMemo(() => {
    return phones.filter((p) => {
      const brandOK = selectedBrand ? p.brand === selectedBrand : true;
      const yearOK = selectedYear ? p.year === Number(selectedYear) : true;
      return brandOK && yearOK;
    });
  }, [phones, selectedBrand, selectedYear]);

  const resetFilters = () => {
    setSelectedBrand("");
    setSelectedYear("");
  };

  return (
    <div className="phone-list-container">
      <Filters
        uniqueBrands={uniqueBrands}
        uniqueYears={uniqueYears}
        selectedBrand={selectedBrand}
        selectedYear={selectedYear}
        onBrandChange={setSelectedBrand}
        onYearChange={setSelectedYear}
        onReset={resetFilters}
        showFilters={showFilters}
        toggleFilters={() => setShowFilters((v) => !v)}
      />

      <div className="phone-list">
        {filteredPhones.length > 0 ? (
          filteredPhones.map((p) => <PhoneCard key={p.id} phone={p} />)
        ) : (
          <p className="phone-list__no-results">
            No hay teléfonos para los filtros seleccionados.
          </p>
        )}
      </div>
    </div>
  );
}
