import { createRoot } from "react-dom/client";
import { PROJECT_DISPLAY_NAME } from "../../../project";
import { Button, Card } from "../../../packages/ui/src/index";
import "./styles.css";

function App() {
  return (
    <main className="shell">
      <Card className="founder-card">
        <p className="eyebrow">Cloudflare-native Bun monorepo</p>
        <h1>{PROJECT_DISPLAY_NAME} template</h1>
        <p>
          TanStack Start-ready web app, Expo mobile app, Hono + Effect backend, Drizzle on D1, and
          Alchemy-powered preview infrastructure.
        </p>
        <Button className="founder-button">Open report context</Button>
      </Card>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
