import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { IUser } from 'models/user';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Formik } from 'formik';
import { updateUser } from 'repositories/users';

interface UserDialogProps extends DialogProps {
  handleClose: any;
  user?: any;
}

export default function UserDialog({ open, user, handleClose }: UserDialogProps) {


  return (
    <Dialog open={open} onClose={handleClose} fullWidth={true}>
      <Formik
        initialValues={
          {
            name: user?.name,
            email: user?.email,
            role: user?.role,
          }
        }
        onSubmit={async (values, { setSubmitting }) => {
          if (user) {
            const token = localStorage.getItem("token");
            await updateUser(token!, {
              id: user!.id,
              ...values,
            });
            setSubmitting(false);
          }
          handleClose();
        }}>
        {({
          values,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => <form onSubmit={handleSubmit}>
            <DialogTitle>Usuario</DialogTitle>
            <DialogContent>
              <TextField
                required
                autoFocus
                margin="dense"
                name="name"
                label="Nome"
                fullWidth
                variant="standard"
                id="name"
                value={values.name}
                onChange={handleChange}
              />
              <TextField
                required
                margin="dense"
                label="Email"
                type="email"
                fullWidth
                variant="standard"
                id="email"
                value={values.email}
                onChange={handleChange}
              />
              <FormControl sx={{ marginTop: '15px' }}>
                <InputLabel id="role-label">Nivel de acesso</InputLabel>
                <Select
                  required
                  labelId="role-label"
                  id="role"
                  value={values.role}
                  onChange={(e) => setFieldValue("role", e.target.value)}
                >
                  <MenuItem value={"user"}>Usuario</MenuItem>
                  <MenuItem value={"admin"}>Administrador</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="error">Cancelar</Button>
              <Button type='submit' onClick={handleClose}>Salvar</Button>
            </DialogActions>
          </form>}
      </Formik>
    </Dialog>
  );
}