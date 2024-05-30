import { Paper } from '@mui/material';
import { Link } from 'react-router-dom';

const PageNotFound = () => {

  const goBack = () => {
    window.history.back();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '90vh'}}>
      <Paper sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',height:'auto', width:'50vh', padding:5, borderRadius:"25px"}}>
        <h1>404 - Página no encontrada</h1>
        <p>Lo sentimos, la página que estás buscando no se encuentra.</p>
        <button onClick={goBack}>Volver a la página anterior</button>
      </Paper>
    </div>
  );

};

export default PageNotFound;
