import Link from "next/link";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { login } from "repositories/auth";
import styles from "../../styles/Login.module.css";
import { IBaseError } from "errors";
import { LoadingIndicator, useUser } from "pages/interface";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const { user, isLoading, fetchUser } = useUser();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault();
      const { id, token } = await login(email, password);
      localStorage.setItem("id", id);
      localStorage.setItem("token", token);
      await fetchUser();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        console.log(axiosError);
        if (axiosError.response) {
          const errorResponse = axiosError.response.data as IBaseError;
          setError(errorResponse.message);
        }
      } else {
        setError("Erro inesperado, tente novamente!");
      }
    }
  }

  useEffect(() => {
    if (router && user && !isLoading) {
      router.push("/");
    }
  }, [user, router, isLoading]);

  if (isLoading) {
    return <LoadingIndicator/>
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {error.length > 0 && <h3>{error}</h3>}
        <form onSubmit={(e) => handleSubmit(e)}>
          <input
            required
            placeholder="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            required
            placeholder="Senha"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <div className={styles.forgot}>
            <Link href="/recovery">Esqueceu sua senha?</Link>
          </div>
          <button type="submit">Entrar</button>
        </form>
      </main>
    </div>
  );
}
