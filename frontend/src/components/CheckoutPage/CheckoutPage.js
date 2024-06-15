import React, { useContext, useState, useEffect} from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import { Formik, Form } from "formik";
import { useHistory } from "react-router-dom";

import AddressForm from "./Forms/AddressForm";
import PaymentForm from "./Forms/PaymentForm";
import ReviewOrder from "./ReviewOrder";
import CheckoutSuccess from "./CheckoutSuccess";

import api from "../../services/api";
import toastError from "../../errors/toastError";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/Auth/AuthContext";
import { socketConnection } from "../../services/socket";
import { useDate } from "../../hooks/useDate";

import validationSchema from "./FormModel/validationSchema";
import checkoutFormModel from "./FormModel/checkoutFormModel";
import formInitialValues from "./FormModel/formInitialValues";

import useStyles from "./styles";


export default function CheckoutPage(props) {
  const steps = ["Dados", "Personalizar", "Revisar"];
  const { formId, formField } = checkoutFormModel;
  const planovalor = props.Invoice.value;
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(1);
  const [datePayment, setDatePayment] = useState(null);
  const [paylink, setpaylink] = useState(null);
  const [linkpay, setlinkpay] = useState(null);

  const [invoiceId, setInvoiceId] = useState(props.Invoice.id);
  const [typepay, setTypepay] = useState(props.typepay);
  const { user } = useContext(AuthContext);
  const history = useHistory();
  const { dateToClient } = useDate();
  const corsURL = process.env.REACT_APP_BACKEND_CORS_URL; 
  const assaskey = process.env.ASAAS_KEY; 

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    const socket = socketConnection({ companyId });

    socket.on(`company-${companyId}-payment`, (data) => {

      if (data.action === "CONFIRMED") {
        toast.success(`Sua licença foi renovada até ${dateToClient(data.company.dueDate)}!`);
        setTimeout(() => {
          history.push("/");
        }, 4000);
      }
    });
  }, [history]);
 
  const currentValidationSchema = validationSchema[activeStep];
  const isLastStep = activeStep === steps.length - 1;
  console.log(corsURL);
  async function _submitForm(values, actions) {
    try {
      const plan = JSON.parse(values.plan);
      const newValues = {
        firstName: values.firstName,
        lastName: values.lastName,
        address2: values.address2,
        city: values.city,
        state: values.state,
        zipcode: values.zipcode,
        country: values.country,
        useAddressForPaymentDetails: values.useAddressForPaymentDetails,
        nameOnCard: values.nameOnCard,
        cardNumber: values.cardNumber,
        cvv: values.cvv,
        plan: values.plan,
        price: plan.price,
        users: plan.users,
        connections: plan.connections,
        invoiceId: invoiceId,
      };
      const { data } = await api.post("/subscription", newValues);
      setDatePayment(data);
      actions.setSubmitting(false);
      setActiveStep(activeStep + 1);
      toast.success("Assinatura realizada com sucesso! Aguardando o pagamento.");
    } catch (err) {
      toastError(err);
    }
  }

  async function _handleSubmit(values, actions) {

    if (isLastStep) {
      // VERIFICA SE O PAGAMENTO É FEITO EM CARTÃO E SE O USUARIO JÁ POSSUI UMA CADASTRO NO ASSAS
      if (typepay === 'card') {
        if (user.customer_id === null) {
          try {
            // NAO TEM CADASTRO, CRIANDO UM
            const options = {
              method: 'POST',
              headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                access_token: assaskey
              },
              body: JSON.stringify({ name: user.name, cpfCnpj: '21620615037' })
            };
            // FETCH

            const rescadastro = await fetch(`${corsURL}/https://sandbox.asaas.com/api/v3/customers`, options);
            const data = await rescadastro.json();
            const customer_id = data.id;
            // VERIFICA SE FOI FEITO COM SUCESSO
            if (rescadastro.status == 200) {
              // SALVA O COSTUMER_ID NO BANCO
              const requestOptions = {
                method: 'POST',
                headers: {
                  'Accept': 'application/json, text/plain, */*',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  "user_id": user.id,
                  "code": customer_id,
                })
              };
              //FETCH
              const result = await fetch(`${process.env.REACT_APP_BACKEND_URL}/setCustomer`, requestOptions);
              const responseBody = await result.json();

              if (result.status == 200) {
                // PEGA DATA DE HOJE E ADICIONA 30 DIAS
                const today = new Date();
                const dueDate = new Date(today.setDate(today.getDate() + 30));
                // CRIA PAGAMENTO
                const options = {
                  method: 'POST',
                  headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    access_token: assaskey
                  },
                  body: JSON.stringify({
                    billingType: 'CREDIT_CARD',
                    customer: customer_id,
                    value: planovalor,
                    dueDate: dueDate.toISOString().split('T')[0] // Formata a data de vencimento para 'yyyy-mm-dd'
                  })
                };

                const create_paymento = await fetch(`${corsURL}/https://sandbox.asaas.com/api/v3/payments`, options);
                const payment_data = await create_paymento.json();
                console.log(payment_data);
                // DEFINE QUE O BOTÃO DEVE FATURA DEVE APARECER
                setpaylink(true);
                // DEFINE O LINK DO PAGAMENTO
                setlinkpay(payment_data.invoiceUrl);
                // ABRE O PAGAMENTO
                window.open(payment_data.invoiceUrl, '_blank'); // '_blank' abre a URL em uma nova guia
                /// MENSAGEM
                toast.success("Sua fatura já está diponível !");

              }
            }

          } catch (err) {
            console.error(err);
          }
        } else {
          const options = {
            method: 'GET',
            headers: {
              accept: 'application/json',
              access_token: assaskey
            }
          };
          
          fetch(`${corsURL}/https://sandbox.asaas.com/api/v3/payments?customer=${user.customer_id}`, options)
            .then(response => response.json())
            .then(data => {
              const payments = data.data; // Array de pagamentos
              if (payments.length > 0) {
                const lastPayment = payments[payments.length - 1]; // Último pagamento da lista
                if (lastPayment.status === 'PENDING') {
                  const linkcpay = lastPayment.invoiceUrl;
                  setpaylink(true);
                // DEFINE O LINK DO PAGAMENTO
                setlinkpay(linkcpay);
                // ABRE O PAGAMENTO
                window.open(linkcpay, '_blank'); // '_blank' abre a URL em uma nova guia
                /// MENSAGEM
                toast.success("Sua fatura já está diponível !");
                } 
              } 
            })
            .catch(err => console.error('Erro ao buscar pagamentos:', err));
          }
      } else {
        _submitForm(values, actions);
      }
    } else {
      setActiveStep(activeStep + 1);
      actions.setTouched({});
      actions.setSubmitting(false);
    }
  }

  function _handleBack() {
    setActiveStep(activeStep - 1);
  }
  async function _handleOpenLink() {

    window.open(linkpay, '_blank'); // '_blank' abre a URL em uma nova guia

  }
  function _renderStepContent(step, setFieldValue, setActiveStep, values) {
    switch (step) {
      case 0:
        return (
          <AddressForm
            formField={formField}
            values={values}
            setFieldValue={setFieldValue}
          />
        );
      case 1:
        return (
          <PaymentForm
            formField={formField}
            setFieldValue={setFieldValue}
            setActiveStep={setActiveStep}
            activeStep={step}
            invoiceId={invoiceId}
            values={values}
          />
        );
      case 2:
        return <ReviewOrder />;
      default:
        return <div>Not Found</div>;
    }
  }

  return (
    <React.Fragment>
      <Typography component="h1" variant="h4" align="center">
        Falta pouco! 
      </Typography>
      <Stepper activeStep={activeStep} className={classes.stepper}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <React.Fragment>
        {activeStep === steps.length ? (
          <CheckoutSuccess pix={datePayment} />
        ) : (
          <Formik
            initialValues={{
              ...user,
              ...formInitialValues,
            }}
            validationSchema={currentValidationSchema}
            onSubmit={_handleSubmit}
          >
            {({ isSubmitting, setFieldValue, values }) => (
              <Form id={formId}>
                {_renderStepContent(
                  activeStep,
                  setFieldValue,
                  setActiveStep,
                  values
                )}

                <div className={classes.buttons}>
                  {activeStep !== 1 && (
                    <Button onClick={_handleBack} className={classes.button}>
                      VOLTAR
                    </Button>
                  )}
                  <div className={classes.wrapper}>
                    {activeStep !== 1 && !paylink && (
                      <Button
                        disabled={isSubmitting}
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={classes.button}
                      >
                        {isLastStep ? "PAGAR" : "PRÓXIMO"}
                      </Button>
                    )}
                    {isSubmitting && (
                      <CircularProgress
                        size={24}
                        className={classes.buttonProgress}
                      />
                    )}
                    {paylink && isLastStep && (
                      <Button
                        onClick={_handleOpenLink}
                        variant="contained"
                        color="primary"
                        className={classes.button}
                      >
                        VER FATURA
                      </Button>
                    )}

                  </div>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </React.Fragment>
    </React.Fragment>
  );
}
