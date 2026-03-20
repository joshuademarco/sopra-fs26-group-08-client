"use client";

 // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering

export default function Home() {
  return (
    <main className="center" style={{ 
      minHeight: "100svh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
    }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "36px",
        alignItems: "center"
      }}>
      <h1 style={{
        fontSize: "clamp(3rem, 10vw, 8rem)",
        lineHeight: 1,
        letterSpacing: "0.04em",
        textAlign: "center",
      }}>Group 08</h1>
      <h3>We are ready!</h3>
      </div>
    </main>
  );
}
