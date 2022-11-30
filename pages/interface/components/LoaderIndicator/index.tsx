import React from "react";
import { ThreeDots } from "react-loader-spinner";

import styles from './LoaderIndicator.module.css'

export default function LoadingIndicator() {
  return (
    <div className={styles.center}>
      <ThreeDots
        height="80"
        width="80"
        radius="9"
        color="#0d63c5"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        visible={true}
      />
    </div>
  );
}
