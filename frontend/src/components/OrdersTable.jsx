import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const OrdersTable = ({ operations }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
          <TableHead>
          <TableRow>
            {Array.isArray(operations) && Object.keys(operations[0]).map((key) => (
              <TableCell key={key}>{key}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(operations) && operations.map((operation, index) => (
            <TableRow key={index}>
              {Object.keys(operation).map((key) => (
                <TableCell key={key}>{operation[key]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrdersTable;
