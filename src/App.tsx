import React from 'react';
import { Container, Typography } from '@mui/material';
import Autocomplete from './components/autocomplete';

const App: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        GitHub Autocomplete
      </Typography>
      <Autocomplete />
    </Container>
  );
};

export default App;