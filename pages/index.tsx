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
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';
import Cookies from 'js-cookie'
import axios from 'axios'
import DeleteIcon from '@mui/icons-material/Delete';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import TextField from '@mui/material/TextField';
import { useAlerts } from '../utils';
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export interface Tareas {
  id: string
  nombre: string
  descripcion: string
  estado: string
}

function PricingContent() {
  
  const [tareasPendientes, setTareasPendientes] = React.useState<Array<Tareas>>([])
  const [tareasFinalizadas, setTareasFinalizadas] = React.useState<Array<Tareas>>([])
  const [initForm, setInitForm] = React.useState<Tareas>({
    id: '',
    nombre: '',
    descripcion: '',
    estado: ''
  })
  const [form, setForm] = React.useState<Tareas>(initForm)

  const [loading, setLoading] = React.useState<boolean>(false)

  const { Alerta } = useAlerts()

  const peticionTareas = async () => {
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
      // console.log(result.data.data.filas)
      const listaTareas = result.data.data.filas
      setTareasPendientes(listaTareas.filter((tarea: Tareas) => tarea.estado === 'PENDIENTE'))
      setTareasFinalizadas(listaTareas.filter((tarea: Tareas) => tarea.estado === 'FINALIZADO'))
    } catch (error) {
      // console.log(error)
      Alerta({ mensaje: 'Ocurrió un error al recuperar los datos', variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const creacionTareas = async (tarea:Tareas) => {
    // console.log('creacion de tareas')
    try {
      const direccion: string = 'http://localhost:3000/api/tareas'
      const body = {
        nombre: tarea.nombre,
        descripcion: tarea.descripcion
      }
      const token = Cookies.get('jwttoken')
      const result = await axios({
        method: 'post',
        url: direccion,
        data: body,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      // console.log(result.data)
      Alerta({ mensaje: 'Tarea creada correctamente', variant: 'success' })
      handleClose()
      peticionTareas()
    } catch (error) {
      if (error instanceof Error) {
        Alerta({ mensaje: 'Ocurrió un error al realizar la acción', variant: 'error' })
        // console.log(error.message)
      }
    }
  }

  const cambiarEstado = async (tarea:Tareas) => {
    const estado = tarea.estado === 'PENDIENTE' ? 'FINALIZADO' : 'PENDIENTE'
    // console.log('tarea desde cambiar estado',tarea)
    tarea.estado = estado
    actualizacionHandler(tarea)
  }

  const eliminarTarea = async (tarea:Tareas) => {
    tarea.estado = 'ELIMINADO'
    // console.log('tarea desde eliminar',tarea)
    actualizacionHandler(tarea)
  }

  const editarTareas = async (tarea: Tareas) => {
    // console.log('edicion   de tareas')
    actualizacionHandler(tarea)
  }

  const actualizacionHandler = async (tarea: Tareas) => {
    try {
      const direccion: string = `http://localhost:3000/api/tareas/${tarea.id}`
      const body = {
        nombre: tarea.nombre,
        descripcion: tarea.descripcion,
        estado: tarea.estado
      }
      const token = Cookies.get('jwttoken')
      const result = await axios({
        method: 'patch',
        url: direccion,
        data: body,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      // console.log(result.data)
      Alerta({ mensaje: 'Acción realizada correctamente', variant: 'success' })
      peticionTareas()
    } catch (error) {
      if (error instanceof Error) {
        Alerta({ mensaje: 'Ocurrió un error al realizar la acción', variant: 'error' })
        // console.log(error.message)
      }
    }
  }

  const abrirActualizacion = async (tarea: Tareas) => {
    handleClickOpen()
    setForm(tarea)
  }

  const borrarCookie = () => {
    Cookies.remove('jwttoken')
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // const data = new FormData(event.currentTarget)
    // const nombre: string = data.get('nombre') + '' || ''
    // const descripcion: string = data.get('descripcion') + '' || ''
    // console.log(nombre, descripcion)
    
    if (form.id === '') {
      creacionTareas(form)
    } else {
      editarTareas(form)
    }
    // console.log('imprimiendo variable form', form)
  }

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setForm(initForm)
    setOpen(false);
  };

  const handleChangeInput = (e:any) => {
    setForm({...form, [`${e.name}`]:e.value})
  }

  React.useEffect(() => {
    peticionTareas()
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
          <Button variant="outlined" sx={{ my: 1, mx: 1.5 }} onClick={handleClickOpen}>
            Crear Tarea
          </Button>
          <Button href="/account/login" variant="contained" sx={{ my: 1, mx: 1.5 }} onClick={borrarCookie}>
            Cerrar Sesión
          </Button>
        </Toolbar>
      </AppBar>

      { /* formulario */}
      <div>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{form.id ? 'EDITAR TAREA' : 'CREAR NUEVA TAREA'}</DialogTitle>
          <DialogContent>
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
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="nombre"
              label="Nombre de la tarea"
              name="nombre"
              autoFocus
              value={form.nombre}
              onChange={(e) => handleChangeInput(e.currentTarget)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="descripcion"
              label="Descripción"
              type="text"
              id="descripcion"
              value={form.descripcion}
              onChange={(e) => handleChangeInput(e.currentTarget)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {form.id ? 'EDITAR TAREA' : 'GUARDAR TAREA'}
            </Button>
          </Box>
        </Box>
      </Container>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
          </DialogActions>
        </Dialog>
      </div>

      {/* Hero unit */}
      <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
        {tareasPendientes.length > 0 ?
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Tareas Pendientes
          </Typography>: null}
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
                      <Grid>
                        <Box onClick={() => cambiarEstado(tarea)}>
                          <CheckBoxOutlineBlankIcon />
                        </Box>
                        <Box onClick={() => eliminarTarea(tarea)}>
                          <DeleteIcon/>
                        </Box>
                      </Grid>
                    </>
                  }
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
                      onClick={() => abrirActualizacion(tarea)}
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
      {tareasFinalizadas.length > 0 ?
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Tareas Finalizadas
          </Typography>: null}
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
                  action={
                    <Grid>
                        <Box onClick={() => cambiarEstado(tarea)}>
                          <CheckBoxIcon />
                        </Box>
                        <Box onClick={() => eliminarTarea(tarea)}>
                          <DeleteIcon/>
                        </Box>
                      </Grid>
                  }
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
