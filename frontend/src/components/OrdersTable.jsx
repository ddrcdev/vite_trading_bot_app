import React, { useState,useEffect } from 'react';
import { Grid } from '@mui/material';
import { DataGrid, GridToolbarQuickFilter, GridToolbar } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { Portal } from '@mui/base/Portal';
import '../App.css'

function MyCustomToolbar(props) {
  return (
    <React.Fragment>
      <Portal container={() => document.getElementById('filter-panel')}>
        <GridToolbarQuickFilter />
      </Portal>
      <GridToolbar {...props} />
    </React.Fragment>
  );
}

const OrdersTable = ({ operations }) => {
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (!Array.isArray(operations) || operations.length === 0 || typeof operations[0] !== 'object' || Object.keys(operations[0]).length === 0) {
      setColumns([]);
      return; // Retorna un array vacío si operations no es un array, está vacío o el primer elemento no es un objeto o está vacío
    }
    const keys = Object.keys(operations[0]);
    setColumns(keys);
  }, [operations]);

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item>
          <Box id="filter-panel" />
        </Grid>
        <Grid item style={{ height: 400, width: '100%' }}>
          {operations.length > 0 && (
            <DataGrid
              rows={operations.map((operation,trade_id) => ({ ...operation, id: trade_id }))} // Agregar un id único basado en el índice
              columns={columns.map((column) => ({
                field: column,
                headerName: column,
                flex: 1, // O cualquier otro ancho deseado
              }))}
              slots={{
                toolbar: MyCustomToolbar,
              }}
            />
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default OrdersTable;