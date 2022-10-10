import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import StarIcon from '@mui/icons-material/StarBorder';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';
import Cookies from 'js-cookie'
import axios from 'axios'
import DeleteIcon from '@mui/icons-material/Delete';


export interface Tareas {
  id: string
  nombre: string
  descripcion: string
  estado: string
}

function PricingContent() {
  
  const [tareasPendientes, setTareasPendientes] = React.useState<Array<Tareas>>([])
  const [tareasFinalizadas, setTareasFinalizadas] = React.useState<Array<Tareas>>([])

  const [loading, setLoading] = React.useState<boolean>(false)

  const peticiónTareas = async () => {
    setLoading(true)
    const direccion = 'http://localhost:3000/api/tareas'
    try {
      const token = Cookies.get('jwttoken')
      const result = await axios({
        method: 'get',
        headers: {
          Authorization: `Bearer ${token}`
        },
        url: direccion
      })
      console.log(result.data.data.filas)
      const listaTareas = result.data.data.filas
      setTareasPendientes(listaTareas.filter((tarea: Tareas) => tarea.estado === 'PENDIENTE'))
      setTareasFinalizadas(listaTareas.filter((tarea: Tareas) => tarea.estado === 'FINALIZADO'))
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const marcarCompletado = async (tarea:Tareas) => {
    console.log('tarea desde marcar completado',tarea)
  }

  const creacionTareas = async () => {

  }

  const actualizaciónTareas = async () => {

  }

  const borrarCookie = () => {
    Cookies.remove('jwttoken')
  }

  React.useEffect(() => {
    peticiónTareas()
  }, [])

  return (
    <React.Fragment>
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
      <CssBaseline />
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ flexWrap: 'wrap' }}>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            Bienvenido al Gestor de Tareas
          </Typography>
          <Button href="/account/login" variant="outlined" sx={{ my: 1, mx: 1.5 }} onClick={borrarCookie}>
            Cerrar Sesión
          </Button>
        </Toolbar>
      </AppBar>
      {/* Hero unit */}
      <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Tareas Pendientes
        </Typography>
      </Container>
      {/* End hero unit */}
      <Container maxWidth="md" component="main">
        <Grid container spacing={5} alignItems="flex-end">
          {!loading && tareasPendientes.map((tarea:Tareas) => (
            // Enterprise card is full width at sm breakpoint
            <Grid
              item
              key={tarea.nombre}
              xs={12}
              sm={tarea.nombre === 'Enterprise' ? 12 : 6}
              md={4}
            >
              <Card>
                <CardHeader
                  title={tarea.nombre}
                  titleTypographyProps={{ align: 'center' }}
                  action={
                    <>
                      <Box onClick={() => marcarCompletado(tarea)}>
                        <StarIcon />
                      </Box>
                      <DeleteIcon/>
                    </>}
                  subheaderTypographyProps={{
                    align: 'center',
                  }}
                  sx={{
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'light'
                        ? theme.palette.grey[200]
                        : theme.palette.grey[700],
                  }}
                />
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'baseline',
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" color="text.secondary">
                      {tarea.descripcion}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  {tarea.estado === 'PENDIENTE' ? 
                    <Button
                      fullWidth
                      variant={'contained'}
                    >
                      Editar Tarea
                    </Button> : null}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      {/* Hero unit */}
      <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Tareas Finalizadas
        </Typography>
      </Container>
      {/* End hero unit */}
      <Container maxWidth="md" component="main">
        <Grid container spacing={5} alignItems="flex-end">
          {!loading && tareasFinalizadas.map((tarea) => (
            // Enterprise card is full width at sm breakpoint
            <Grid
              item
              key={tarea.nombre}
              xs={12}
              sm={tarea.nombre === 'Enterprise' ? 12 : 6}
              md={4}
            >
              <Card>
                <CardHeader
                  title={tarea.nombre}
                  titleTypographyProps={{ align: 'center' }}
                  action={<StarIcon />}
                  subheaderTypographyProps={{
                    align: 'center',
                  }}
                  sx={{
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'light'
                        ? theme.palette.grey[200]
                        : theme.palette.grey[700],
                  }}
                />
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'baseline',
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" color="text.secondary">
                      {tarea.descripcion}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  {tarea.estado === 'PENDIENTE' ? <Button
                    fullWidth
                    variant={'contained'}
                  >
                    Editar Tarea
                  </Button> : null}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </React.Fragment>
  );
}

export default function Pricing() {
  return <PricingContent />;
}
