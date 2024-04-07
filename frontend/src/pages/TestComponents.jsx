import React, { useState } from 'react';
import '../App.css'; // Estilos para la ventana emergente

const Test = () => {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleAccept = () => {
    // Aquí puedes agregar la lógica que desees cuando se acepta
    togglePopup();
  };

  const handleDecline = () => {
    // Aquí puedes agregar la lógica que desees cuando se declina
    togglePopup();
  };

  return (
    <div className="test-container">
      <button onClick={togglePopup}>Mostrar Ventana Emergente</button>

      {showPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Mensaje de confirmación</h2>
            <p>¿Estás seguro?</p>
            <div className="popup-buttons">
              <button onClick={handleAccept}>Aceptar</button>
              <button onClick={handleDecline}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Test;

