import React from "react";
import { Button, Card, CardContent, CircularProgress, Grid, Typography } from "@mui/material";
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
interface BrandCardProps {
  brand: {
    id: number;
    nombreMarca: string;
    descripcionMarca: string;
  };
}

const BrandCard: React.FC<BrandCardProps> = ({ brand }) => {
  return (
    
    <Grid item xs={12} sm={6} md={4} lg={3} xl={2} style={{ marginBottom: 0 }}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Card sx={{ minHeight: 250, flexGrow: 1 }}>
          <CardContent style={{ overflow: 'hidden' }}>
          <Grid style={{  minHeight: 150,maxHeight: 160, overflowY: 'auto', textAlign: 'justify' }}>
            <Typography variant="h6" component="div">
                {brand.nombreMarca}
              </Typography>
              <Typography variant="body2" style={{ minHeight: 50, maxHeight: 120, overflowY: 'auto', textAlign: 'justify' }}>
                {brand.descripcionMarca}
              </Typography>
            
          </Grid>
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

export default BrandCard;
