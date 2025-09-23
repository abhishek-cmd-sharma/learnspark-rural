import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Note: Firestore initialization is handled conditionally in the app
// initFirestoreData is available for manual initialization when needed

createRoot(document.getElementById("root")!).render(<App />);
