import React from "react";

export default function NotFound() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <h1 style={{ fontSize: "4rem", marginBottom: "1rem" }}>404</h1>
      <p style={{ fontSize: "1.5rem", marginBottom: "2rem" }}>Page Not Found</p>
      <a href="/" style={{ color: "#0070f3", textDecoration: "underline" }}>Go Home</a>
    </div>
  );
}
