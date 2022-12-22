import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { LoadingIndicator, useUser } from "../interface";
import styles from "../../styles/Home.module.css";
import { getUsers, updateUser } from "repositories/users";

import { DataGrid, GridColDef, GridLocaleText } from "@mui/x-data-grid";
import { Button, IconButton, Slider, Switch } from "@mui/material";
import { Edit } from "@mui/icons-material";
import UserDialog from "pages/interface/components/UserDialog";



export default function Users() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  async function getAllUsers(token: string) {
    const result = await getUsers(token!);
    setUsers(result);
  }

  const handleSwitch = async (id: string) => {
    const changedUsers = [...users];
    const index = changedUsers.findIndex(user => user.id === id);
    changedUsers[index].active = !changedUsers[index].active;
    const token = localStorage.getItem("token");
    if (token) {
      await updateUser(token, { id, active: changedUsers[index].active });
    }
    setUsers(changedUsers);
  };

  const columns: GridColDef[] = [
    {
      field: "active",
      headerName: "Ativo",
      renderCell: (params) => (
        <Switch
          key={params.row.id}
          checked={params.value}
          onClick={() => handleSwitch(params.row.id)}
          color="primary"
        />
      ),
      minWidth: 100
    },
    { field: "name", headerName: "Nome", minWidth: 200 },
    { field: "email", headerName: "Email", minWidth: 250 },
    { 
      field: "role", 
      headerName: "Nivel de Acesso", 
      minWidth: 150,
      renderCell: (params) => params.row.role === "admin" ? 'Administrador' : 'Usuario',
    },
    {
      field: "id",
      headerName: "Editar",
      headerAlign: "center",
      renderCell: (params) => (
        <IconButton onClick={() => {
          handleOpenUserDialog(params.row)
        }}>
          <Edit />
        </IconButton>
      ),
      minWidth: 100,
      align: "center"
    },
  ];

  const [userDialog, setUserDialog] = useState<boolean>(false);

  const handleOpenUserDialog = (user?: any) => {
    setSelectedUser(user);
    setUserDialog(true);
  };

  const handleCloseUserDialog = () => {
    setUserDialog(false);
    const token = localStorage.getItem("token");
    getAllUsers(token!);
  };

  useEffect(() => {
    if (router && !user && !isLoading) {
      router.push("/login");
    } else {
      const token = localStorage.getItem("token");
      getAllUsers(token!);
    }
  }, [user, router, isLoading]);

  if (!user) {
    return <LoadingIndicator />;
  }

  return (
    <div className={styles.body}>
      <UserDialog open={userDialog} handleClose={handleCloseUserDialog} user={selectedUser} />
      <div className={styles.container}>
        <main className={styles.main}>
          <>
            <h1>Users</h1>
            <div style={{ height: 400, width: "70%" }}>
              <DataGrid
                rows={users}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                autoHeight
                disableColumnSelector
                disableSelectionOnClick
              />
            </div>
          </>
        </main>
      </div>
    </div>
  );
}
