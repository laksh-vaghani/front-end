"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [qrCodeData, setQrCodeData] = useState<any>(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQrCodeData = async () => {
      try {
        const response = await axios.get("http://localhost:1257/qr-code");
        setQrCodeData(response.data);
      } catch (err:any) {
        setError(err.message || "Something went wrong");
      }
    };

    fetchQrCodeData();
  }, []);

  return (
    <center>
    <div className={styles.container}>
      {qrCodeData?<>
      <h1>QR code Page</h1>
      <img src={qrCodeData.qrCodeImage} alt="" />
      <h2>Your Code is {qrCodeData.code}</h2>
      </>:<>Loading...</>}
    </div>
    </center>
  );
}
