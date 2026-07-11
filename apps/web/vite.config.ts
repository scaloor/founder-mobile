import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// TanStack Start dependency is installed for the template path; this Vite shell
// keeps the initial scaffold simple and typecheckable until app routing lands.
export default defineConfig({
  plugins: [react()],
});
