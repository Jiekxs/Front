import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Pedido, Usuario } from '../MainVisual/ViewAllOrders'; 

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  subheader: {
    fontSize: 16,
    marginBottom: 5,
  },
  text: {
    fontSize: 12,
    marginBottom: 3,
  },
});

const PedidosPDF: React.FC<{ pedidos: Pedido[]; usuarios: Record<string, Usuario> }> = ({ pedidos, usuarios }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.header}>Lista de Pedidos</Text>
      {pedidos.map(pedido => (
        <View key={pedido.idPedido} style={styles.section}>
          <Text style={styles.subheader}>ID del Pedido: {pedido.idPedido}</Text>
          <Text style={styles.text}>Cliente: {usuarios[pedido.idUsuario] ? `${usuarios[pedido.idUsuario].nombre} (${usuarios[pedido.idUsuario].email})` : 'Cargando...'}</Text>
          <Text style={styles.text}>Fecha del Pedido: {new Date(pedido.fechaPedido).toLocaleString()}</Text>
          <Text style={styles.text}>Estado: {pedido.estado}</Text>
          <Text style={styles.text}>Total del Pedido: ${pedido.total_pedido.toFixed(2)}</Text>
          <Text style={styles.text}>Dirección de Envío: {pedido.direccionEnvio}</Text>
          <Text style={styles.text}>Forma de Pago: {pedido.formaPago}</Text>
          <Text style={styles.text}>Fecha de Entrega: {new Date(pedido.fechaEntrega).toLocaleDateString()}</Text>
        </View>
      ))}
    </Page>
  </Document>
);

export default PedidosPDF;
