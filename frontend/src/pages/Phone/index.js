import React, { useState, useContext, useEffect } from "react";
import { makeStyles, Paper, Typography, TextField, Button } from "@material-ui/core";
import InputMask from 'react-input-mask';
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";
import { i18n } from "../../translate/i18n";
import { AuthContext } from "../../context/Auth/AuthContext";
import { useHistory } from "react-router-dom";
import toastError from "../../errors/toastError";
import { toast } from "react-toastify";

const useStyles = makeStyles(theme => ({
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo semitransparente para destacar o container
    zIndex: 9998, // Coloca a camada acima de todos os outros elementos
  },
  containerWrapper: {
    position: 'relative',
    zIndex: 9999, // Coloca o MainContainer acima da camada de sobreposição
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    paddingBottom: '200px',
  },
  card: {
    padding: theme.spacing(3),
    boxShadow: theme.shadows[3],
    borderRadius: theme.spacing(1),
    maxWidth: 400,
    width: '100%',
    textAlign: 'center',
  },
  input: {
    marginBottom: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
  },
  redBox: {
    backgroundColor: "#ffcccc", // Definindo a cor de fundo vermelha
    padding: theme.spacing(2), // Adicionando um espaçamento interno
    marginBottom: theme.spacing(2), // Adicionando margem inferior para separar do conteúdo abaixo
  },
  alerticon: {
    width: '40px',
    marginRight: '20px',
  },
  configp: {
    display: 'flex',
    alignItems: 'center',
  }
}));

const Helps = () => {
  const classes = useStyles();
  const [showPhoneCard, setShowPhoneCard] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const { user } = useContext(AuthContext);
  const history = useHistory();
  const backendUrl = process.env.REACT_APP_BACKEND_URL; // Aqui estamos definindo a URL padrão como localhost, caso a variável de ambiente não esteja definida

  useEffect(() => {


    if(user.confirmedphone == "true"){
      history.push("/tickets");

    }

    // Desabilita o scroll da página ao montar o componente
    document.body.style.overflow = 'hidden';

    // Habilita o scroll da página ao desmontar o componente
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handlePhoneSubmit = () => {
    const cleanedPhoneNumber = phoneNumber.replace(/\s+/g, ''); // Remove espaços
    var request = require('request');
    var options = {
      'method': 'POST',
      'url': `${backendUrl}/codecontact`,
      'headers': {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "id": user.id,
        "name": user.name,
        "number": '55' + cleanedPhoneNumber,
        "email": user.email
      })
    };
    request(options, function (error, response,body) {
      const responseBody = JSON.parse(body);

      console.log(responseBody);
      if (error) {
        console.error('Erro ao enviar solicitação:', error);
        return;
      }
      
      if (response.statusCode === 200) {
        if(responseBody == "SEND_CODE"){
          toast.success('Código enviado com sucesso !');
          setShowPhoneCard(false);
        }

        if(responseBody == "OTHER_ACCOUNT_NUMBER"){
          toastError("Numero cadastrado em outra conta");
        }

      } else {
        if(responseBody.error == "ERR_DUPLICATED_CONTACT"){
          toastError("Esse número já está vinculado uma conta!");
        }

        if(responseBody.error == "Internal server error"){
          toastError("Esse número não é válido ou não pode ser usado");
        }
        if(responseBody.error == "Invalid number format. Only numbers is allowed."){
          toastError("O Telefone inserido está incorreto !");
        }
      }
    });
  };

  const handleCodeSubmit = () => {
    var request = require('request');
    var options = {
      'method': 'POST',
      'url': `${backendUrl}/confirmcode`,
      'headers': {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "code": code,
        "id": user.id
      })
    };
    request(options, function (error, response,body) {
      const responseBody = JSON.parse(body);

      if (error) throw new Error(error);
      console.log(responseBody.result);
      console.log(responseBody.result.status);
      if(responseBody.result.status == 200){
        toast.success(responseBody.result.message);
        history.push("/tickets");

      }else{
        toastError(responseBody.result.message);
      }

     
    });
  };

  return (
    <>
      <div className={classes.overlay}></div>
      <div className={classes.containerWrapper}>
        <MainContainer>
          {/* Box vermelha com o aviso */}
          <Paper className={classes.redBox} variant="outlined">
            <Typography className={classes.configp}>
              <img className={classes.alerticon} src="https://i.ibb.co/vPpHkJk/octicon-alert-16-1.png" alt="icon" /> O Código será enviado para o WhatsApp do número cadastrado!
            </Typography>
          </Paper>
          {/* Fim da box vermelha */}
          <div className={classes.container}>
            {showPhoneCard ? (
              <Paper className={classes.card}>
                <Typography variant="h6" gutterBottom>
                  Inserir número de telefone
                </Typography>
                <InputMask
                  mask="99 9 99999999"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                >
                  {() => <TextField
                    label="Número de telefone"
                    variant="outlined"
                    fullWidth
                    className={classes.input}
                  />}
                </InputMask>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePhoneSubmit}
                  className={classes.button}
                >
                  Solicitar Código
                </Button>
              </Paper>
            ) : (
              <Paper className={classes.card}>
                <Typography variant="h6" gutterBottom>
                 Confirmar
                </Typography>
                <TextField
                  label="Código"
                  variant="outlined"
                  fullWidth
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className={classes.input}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCodeSubmit}
                  className={classes.button}
                >
                  Enviar Código
                </Button>
              </Paper>
            )}
          </div>
        </MainContainer>
      </div>
    </>
  );
};

export default Helps;
