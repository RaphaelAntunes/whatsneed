import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import useStyles from './styles';

function PaymentDetails(props) {
  const { formValues } = props;
  const classes = useStyles();
  const { plan } = formValues;
  const newPlan = JSON.parse(plan);
  console.log(newPlan);


   const renderPlansTime = (newPlan) => {
      switch (newPlan.PlansTime) {
          case 1:
              return 'MENSAL';
          case 3:
              return 'TRIMESTRAL';
          case 6:
              return 'SEMESTRAL';
          case 12:
              return 'ANUAL';
          default:
              return 'Desconhecido';
      }
  };
  const planTime = renderPlansTime(newPlan);

  const { users, connections, price } = newPlan;
  return (
    <Grid item xs={12} sm={12}>
      <Typography variant="h6" gutterBottom className={classes.title}>
        Detalhes do plano
      </Typography>
      <Typography gutterBottom>Usuários: {users}</Typography>
      <Typography gutterBottom>Whatsapps: {connections}</Typography>
      <Typography gutterBottom>Cobrança: {planTime}</Typography>
      <Typography gutterBottom>Total: R${price.toLocaleString('pt-br', {minimumFractionDigits: 2})}</Typography>
    </Grid>
  );
}

export default PaymentDetails;
