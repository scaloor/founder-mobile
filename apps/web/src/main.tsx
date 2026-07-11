import { createRoot } from "react-dom/client";
import { Button, Card } from "@founder-mobile/ui";
import "./styles.css";

function App() {
  return (
    <main className="shell">
      <Card>
        <p className="eyebrow">Cloudflare-native Bun monorepo</p>
        <h1>Founder Mobile template</h1>
        <p>
          TanStack Start-ready web app, Expo mobile app, Hono + Effect backend,
          Drizzle on D1, and Alchemy-powered preview infrastructure.
        </p>
        <Button>Open report context</Button>
      </Card>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
