import React, { ReactNode } from "react";
import { Group, Text } from "@mantine/core";

type DescriptionProps = {
  label: ReactNode;
  children?: ReactNode;
};

export function Description({ label, children }: DescriptionProps) {
  return (
    <Group spacing={6} align="start">
      <Text fw={500}>{label}:</Text>
      <Text sx={{ flexGrow: 1 }}>{children}</Text>
    </Group>
  );
}
