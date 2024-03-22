import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import FactoryIcon from '@mui/icons-material/Factory';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStatsOutlined';
import { Link } from 'react-router-dom'; 
import '../index.css';
import '../App.css';

export default function AppBarMenu() {
  const [open, setOpen] = React.useState(false);

  const handleToggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar className= 'appBar' position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleToggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Trading Bots BNB
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={open}
        onClose={handleToggleDrawer}
        sx={{
          width: '25%',
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: '15%',
            backgroundColor: '#333',
            color: '#fff',
            boxSizing: 'border-box',
            maxHeight: '100%'
          },
        }}
      >
        <List>
          <ListItem
            button
            component={Link}
            to="/home"
            className='listItem'
          >
            <FactoryIcon className='icon' />
            <ListItemText primary="Home" />
          </ListItem>
          <Divider />
          <ListItem
            button
            component={Link}
            to="/strategies"
            className='listItem'
          >
            <SmartToyOutlinedIcon className='icon' />
            <ListItemText primary="Strategies" />
          </ListItem>
          <Divider />
          <ListItem
            button
            component={Link}
            to="/analytics"
            className='listItem'
          >
            <QueryStatsOutlinedIcon className='icon' />
            <ListItemText primary="Analytics" />
          </ListItem>
          <Divider />
          <Divider />
          <ListItem
            button
            component={Link}
            to="/test"
            className='listItem'
          >
            <QueryStatsOutlinedIcon className='icon' />
            <ListItemText primary="Test" />
          </ListItem>
          <Divider />
        </List>
      </Drawer>
    </Box>
  );
}
