import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios'
import { useRouter } from "next/router"
import Cookies from 'js-cookie';
import { useAlerts } from '../../utils';

const theme = createTheme();

export default function IniciarSesion() {

  const { Alerta } = useAlerts()
  const router = useRouter();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // console.log({
    //   correoElectronico: data.get('email'),
    //   contrasena: data.get('password'),
    // });
    const email: string = data.get('email') + '' || ''
    const contrasena: string = data.get('password') + '' || ''
    try {
      const direccion = 'http://localhost:3000/auth/login'
      const result = await axios({
        method: 'post',
        url: direccion,
        data: {
          correoElectronico: email,
          contrasena: contrasena
        }
      })
      // console.log(result.data.finalizado)
      if (result.data.finalizado) {
        const token: string = result.data.data.token
        Cookies.set('jwttoken', token)
        // localStorage.setItem('jwttoken', token)
        Alerta({ mensaje: 'Iniciando sesión', variant: 'success' })
        router.push('/')
      } else {
        // throw new Error(result.data.message)
        Alerta({ mensaje: `${result.data.message}`, variant: 'error' })
      }
    } catch (error) {
      if (error instanceof Error) {
        // console.log(error.message)
        Alerta({ mensaje: `${error.message}`, variant: 'error' })
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Iniciar Sesión
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo Electrónico"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Inciar Sesión
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/account/register" variant="body2">
                  {"¿No tienes una cuenta? Registrate"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}