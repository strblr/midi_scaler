import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import App from "./components/App";
import { themeOverride } from "./session/theme";

dayjs.extend(relativeTime);
dayjs.extend(duration);

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
