import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { LoadingIndicator, useUser } from "../interface";
import styles from "../../styles/Home.module.css";
import { getUsers } from "repositories/users";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import { Edit } from "@mui/icons-material";

const columns: GridColDef[] = [
  { field: "name", headerName: "Nome", minWidth: 200 },
  { field: "email", headerName: "Email", minWidth: 250 },
  { field: "role", headerName: "Funcao", minWidth: 150 },
  {
    field: "id",
    headerName: "Editar",
    renderCell: (params) => (
      <IconButton onClick={()=> console.log(params.row.id)}>
        <Edit/>
      </IconButton>
    ),
    minWidth: 150
  },
];

export default function Users() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  const [users, setUsers] = useState<any[]>([]);

  async function getAllUsers(token: string) {
    const result = await getUsers(token!);
    setUsers(result);
  }

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
      <div className={styles.container}>
        <main className={styles.main}>
          <>
            <h1>Users</h1>
            <div style={{ height: 400, width: "70%" }}>
              <DataGrid
                rows={users}
                columns={columns}
                pageSize={5}
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
