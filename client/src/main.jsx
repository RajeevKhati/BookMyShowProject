import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AppProviders from "./providers/AppProviders.jsx";
import { Provider } from "react-redux";
import store from "./redux/store.js";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AppProviders>
      <App />
    </AppProviders>
  </Provider>
);
