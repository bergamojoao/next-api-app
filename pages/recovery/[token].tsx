import { useState } from "react";
import axios, { AxiosError } from "axios";
import { recovery, recoveryByToken } from "repositories/auth";
import styles from "../../styles/Login.module.css";
import { IBaseError } from "errors";
import { useRouter } from "next/router";

export default function RecoveryByToken() {

  const [password, setPassword] = useState<string>('');

  const [error, setError] = useState<string>('');

	const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault();
			const {token} = router.query;
      await recoveryByToken(token as string, password);
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
					<h3>Digite sua nova senha</h3>
          <input
            required
            placeholder="Senha"
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
          />
          <button type="submit">Enviar</button>
        </form>
      </main>

    </div>
  );
}
