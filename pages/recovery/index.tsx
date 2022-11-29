import { useState } from "react";
import axios, { AxiosError } from "axios";
import { recovery } from "repositories/auth";
import styles from "../../styles/Login.module.css";
import { IBaseError } from "errors";

export default function Recovery() {

  const [email, setEmail] = useState<string>('');

  const [error, setError] = useState<string>('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault();
      await recovery(email);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError
        console.log(axiosError)
        if (axiosError.response) {
          const errorResponse = axiosError.response.data as IBaseError
          setError(errorResponse.message);
        }
      } else {
        setError('Erro inesperado, tente novamente!')
      }
    }
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {error.length > 0 && <h3>{error}</h3>}
        <form onSubmit={handleSubmit}>
          <input
            required
            placeholder="Email"
            type="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
          />
          <button type="submit">Enviar</button>
        </form>
      </main>

    </div>
  );
}
