import React, { useState } from 'react';

const FilterComponent = () => {
  const [filters, setFilters] = useState({
    bukrs: '',
    gjahr: '',
    belnr: '',
    blart: '',
    bldat: '',
    buzei: '',
    bschl: '',
    augdt: ''
  });

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  return (
    <div>
      <h2>Filters</h2>
      <div>
        <label htmlFor="bukrs">Bedrijfsnummer (BUKRS):</label>
        <input
          type="text"
          id="bukrs"
          name="bukrs"
          value={filters.bukrs}
          onChange={handleFilterChange}
        />
      </div>
      <div>
        <label htmlFor="gjahr">Boekjaar (GJAHR):</label>
        <input
          type="text"
          id="gjahr"
          name="gjahr"
          value={filters.gjahr}
          onChange={handleFilterChange}
        />
      </div>
      <div>
        <label htmlFor="belnr">Documentnummer van een boekhoudingsdocument (BELNR):</label>
        <input
          type="text"
          id="belnr"
          name="belnr"
          value={filters.belnr}
          onChange={handleFilterChange}
        />
      </div>
      <div>
        <label htmlFor="blart">Documentsoort (BLART):</label>
        <input
          type="text"
          id="blart"
          name="blart"
          value={filters.blart}
          onChange={handleFilterChange}
        />
      </div>
      <div>
        <label htmlFor="bldat">Documentdatum in document (BLDAT):</label>
        <input
          type="text"
          id="bldat"
          name="bldat"
          value={filters.bldat}
          onChange={handleFilterChange}
        />
      </div>
      <div>
        <label htmlFor="buzei">Nummer van boekingsregel in het boekhoudingsdocument (BUZEI):</label>
        <input
          type="text"
          id="buzei"
          name="buzei"
          value={filters.buzei}
          onChange={handleFilterChange}
        />
      </div>
      <div>
        <label htmlFor="bschl">Boekingssleutel (BSCHL):</label>
        <input
          type="text"
          id="bschl"
          name="bschl"
          value={filters.bschl}
          onChange={handleFilterChange}
        />
      </div>
      <div>
        <label htmlFor="augdt">De datum van vereffening (AUGDT):</label>
        <input
          type="text"
          id="augdt"
          name="augdt"
          value={filters.augdt}
          onChange={handleFilterChange}
        />
      </div>
    </div>
  );
};

export default FilterComponent;
