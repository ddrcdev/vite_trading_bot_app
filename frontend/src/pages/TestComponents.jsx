// TestComponents.jsx

import React, { useState } from 'react';
import Button from '@mui/material/Button';

const Test = () => {
  const [data, setData] = useState(['Hola']);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/getops'); // Hacer una solicitud a la API REST en el servidor backend
      const dataFromDB = await response.json();
      console.log(dataFromDB[0]);
      setData(dataFromDB[0]);
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };

  return (
    <div>
      <h1>Datos desde PostgreSQL</h1>
      <Button variant="contained" onClick={fetchData}>Botón de MUI</Button>
      <h1>{data['table_name']}</h1>
    </div>
  );
};

export default Test;
