import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import App from "./components/App";
import { themeOverride } from "./session/theme";
import { ModalsProvider } from "@mantine/modals";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS theme={themeOverride}>
      <ModalsProvider>
        <Notifications position="bottom-left" />
        <App />
      </ModalsProvider>
    </MantineProvider>
  </React.StrictMode>
);
