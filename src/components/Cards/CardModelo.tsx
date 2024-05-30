import React from "react";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';

interface ModelCardProps {
  model: {
    id: number;
    nombre: string;
    descripcion: string;
    marca: {
      nombreMarca:string;
      descripcionMarca:string;
},
  
  };
}

const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
  return (
    <Grid item xs={12} sm={6} md={4} lg={3} xl={2} style={{ marginBottom: 0 }}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Card sx={{ minHeight: 250, flexGrow: 1 }}>
          <CardContent style={{ overflow: 'hidden' }}>
          {/* <Typography>
                <img src="../../../dist/img/KTM-Logo.png" alt="" style={{width:250 }}/>
            </Typography> */}
            <Typography variant="h6" component="div">
              {model.nombre}
            </Typography>
            <Typography variant="body2" style={{ maxHeight: 100, overflowY: 'auto', textAlign: 'justify' }}>
              {model.descripcion}
            </Typography>
            <Typography variant="body2" style={{ maxHeight: 100, overflowY: 'auto', textAlign: 'justify' }}>
              {model.marca.nombreMarca}
            </Typography>
            {/* <Typography variant="body2" style={{ maxHeight: 100, overflowY: 'auto', textAlign: 'justify' }}>
              {model.marca.descripcionMarca}
            </Typography> */}
             <Grid sx={{width:"100%",height:"100%" , display:"flex", justifyContent:"center",alignItems:"center", background:"gray"}}>
                <ImageNotSupportedIcon sx={{height:"80px"}} />            
            </Grid>
          </CardContent>
          <style>
            {`
              ::-webkit-scrollbar {
                width: 8px;
                background-color: transparent;
              }

              ::-webkit-scrollbar-thumb {
                background-color: rgba(0, 0, 0, 0);
                border-radius: 4px;
              }

              ::-webkit-scrollbar-track {
                background-color: transparent;
              }
            `}
          </style>
        </Card>
      </div>
    </Grid>
  );
};

export default ModelCard;
