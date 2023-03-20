import React from "react";
import { MantineThemeOverride } from "@mantine/core";
import { IconExclamationCircle } from "@tabler/icons-react";

export const themeOverride: MantineThemeOverride = {
  components: {
    Alert: {
      defaultProps: {
        icon: <IconExclamationCircle />
      }
    },
    Button: {
      defaultProps: {
        uppercase: true
      }
    },
    Menu: {
      defaultProps: {
        shadow: "md",
        withArrow: true
      }
    },
    Modal: {
      defaultProps: {
        centered: true
      }
    }
  }
};
