"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import styles from "./page.module.css";

export default function Home() {
  const [qrCodeData, setQrCodeData] = useState<any>(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("Waiting for connection...");
  const socket = io("http://localhost:1257", {
    transports: ['websocket', 'polling']
});

  useEffect(() => {
    // Fetch QR code data and join room with the code
    const fetchQrCodeData = async () => {
      try {
        const response = await fetch("http://localhost:1257/qr-code");
        const data = await response.json();
        setQrCodeData(data);

        // Join a room using the code
        if (data?.code) {
          socket.emit("join-room", data.code);
          console.log(`Joined room with code: ${data.code}`);
        }
      } catch (err:any) {
        setError(err.message || "Something went wrong");
      }
    };

    fetchQrCodeData();

    socket.on("connected", (data) => {
      console.log("Received connected event:", data);
      setStatus(data.status);
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <center>
      <div className={styles.container}>
        {status === "Connected"?<h1>Connected with Room {qrCodeData.code}</h1>:<>
        {qrCodeData ? (
          <>
            <h1>QR Code Page</h1>
            <img src={qrCodeData.qrCodeImage} alt="QR Code" />
            <h2>Your Code is {qrCodeData.code}</h2>
          </>
        ) : (
          <>Loading...</>
        )}
        </>}
        
      </div>
    </center>
  );
}
