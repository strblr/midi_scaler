import React, { ReactNode } from "react";
import { Group, Text } from "@mantine/core";
import {
  MidiData,
  MidiEvent,
  MidiSetTempoEvent,
  parseMidi,
  writeMidi
} from "midi-file";
import { compact, isEmpty } from "lodash-es";
import { DEFAULT_BPM, DEMO_URL } from "./session/constants";

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

export async function loadDemo() {
  const result = await fetch(DEMO_URL);
  return new File(
    [await result.blob()],
    DEMO_URL.split("/").pop() ?? "demo.mid"
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
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function detectBPM(track: MidiEvent[]) {
  const tempoEvents = track.filter(
    (event) => event.type === "setTempo"
  ) as MidiSetTempoEvent[];
  if (isEmpty(tempoEvents)) return [DEFAULT_BPM];
  return tempoEvents.map(
    (event) => +(60e6 / event.microsecondsPerBeat).toFixed(2)
  );
}

export function scaleBPM(
  track: MidiEvent[],
  newBPM: number,
  keepDuration: boolean
) {
  const bpms = detectBPM(track);
  if (bpms.length > 1) throw new Error("Cannot scale track with multiple BPMs");

  // Add new tempo information to the track
  track = compact([
    newBPM !== 120 && {
      type: "setTempo",
      deltaTime: 0,
      meta: true,
      microsecondsPerBeat: 60e6 / newBPM
    },
    ...track.filter((event) => event.type !== "setTempo")
  ]);

  // Scale the track if the duration should be preserved
  if (keepDuration) {
    const bpm = bpms[0];
    const scaleFactor = newBPM / bpm;

    let idealTicksFromOrigin = 0,
      previousActualTicksFromOrigin = 0;

    track = track.map((event) => {
      const { deltaTime, ...rest } = event;
      idealTicksFromOrigin += deltaTime * scaleFactor;
      const realDelta = idealTicksFromOrigin - previousActualTicksFromOrigin;
      const newDelta = Math.round(realDelta);
      previousActualTicksFromOrigin += newDelta;
      return { ...rest, deltaTime: newDelta };
    });
  }

  return track;
}
