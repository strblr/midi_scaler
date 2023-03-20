import React, { ReactNode } from "react";
import { Group, Text } from "@mantine/core";
import { MidiData, parseMidi, writeMidi } from "midi-file";

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

export function readMidi(file: File) {
  return new Promise<MidiData>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function () {
      try {
        const seq = new Uint8Array(reader.result as ArrayBuffer);
        resolve(parseMidi(seq));
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export function downloadMidi(fileName: string, data: MidiData) {
  const seq = new Uint8Array(writeMidi(data));
  const blob = new Blob([seq], { type: "audio/midi" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}
