import React from "react";
import { Button, Card, CardContent, CircularProgress, Grid, Typography } from "@mui/material";

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
            <Typography variant="h6" component="div">
              {brand.nombreMarca}
            </Typography>
            <Typography variant="body2" style={{ maxHeight: 100, overflowY: 'auto', textAlign: 'justify' }}>
              {brand.descripcionMarca}
            </Typography>
            <Typography>
                <img src="../../../dist/img/KTM-Logo.png" alt="" style={{width:250 }}/>
            </Typography>
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
