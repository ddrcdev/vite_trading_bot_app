import React from 'react';
import { AppBar, Tabs, Tab } from '@mui/material';

function MarketBar({ value, handleChange }) {
  return (
    <AppBar className='appBar' position="static" color="primary">
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="secondary"
        textColor="inherit"
        variant="fullWidth"
        aria-label="full width tabs example"
      >
        <Tab label="Trading View" />
        <Tab label="MarketCap" />
      </Tabs>
    </AppBar>
  );
}

export default MarketBar;
