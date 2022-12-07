import { useRouter } from "next/router";
import { useEffect } from "react";
import styles from "../styles/Home.module.css";
import { LoadingIndicator, useUser } from "./interface";

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (router && !user && !isLoading) {
      router.push("/login");
    }
  }, [user, router, isLoading]);

  if (!user) {
    return <LoadingIndicator />;
  }

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <main className={styles.main}>
          <h1>{`Olá ${user.name}`}</h1>
        </main>
      </div>
    </div>
  );
}
