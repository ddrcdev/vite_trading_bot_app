import React, { useState } from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, selectedoption, theme) {
  return {
    fontWeight:
      selectedoption.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const BotSelect = ({ botNames, selectedOption, handleBotOptionChange }) => {
  const theme = useTheme();

  return (
    <FormControl sx={{ m: 1, width: 300}}>
      <InputLabel id="demo-multiple-chip-label">Bots</InputLabel>
      <Select
        labelId="demo-multiple-chip-label"
        id="demo-multiple-chip"
        multiple
        value={selectedOption}
        onChange={handleBotOptionChange}
        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {botNames.map((name) => (
          <MenuItem
            key={name}
            value={name}
            style={getStyles(name, selectedOption, theme)}
          >
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default BotSelect;
