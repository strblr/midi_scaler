import React from "react";
import { MidiData, MidiEvent, MidiSetTempoEvent } from "midi-file";
import { isEmpty, round } from "lodash-es";
import { DEFAULT_BPM } from "../session/constants";

// Takes in a BPM value and returns the corresponding microseconds per beat, or vice versa

export function altTempo(value: number) {
  return 60e6 / value;
}

// Detects the BPMs of a track, or returns the default BPM if none is found

export function getBPMs(track: MidiEvent[]): number[] {
  const events = track.filter(
    (event) => event.type === "setTempo"
  ) as MidiSetTempoEvent[];
  if (isEmpty(events)) {
    return [DEFAULT_BPM];
  }
  return events.map((event) => altTempo(event.microsecondsPerBeat));
}

// Calculates the duration of a track in microseconds

export function getDuration(data: MidiData, track: MidiEvent[]) {
  const tpb = data.header.ticksPerBeat;
  if (tpb === undefined || data.header.format !== 0) {
    // Needs to be supported in the future
    return null;
  }
  let currentTempo = altTempo(DEFAULT_BPM);
  return track.reduce((duration, event) => {
    const tickDuration = currentTempo / tpb;
    if (event.type === "setTempo") {
      currentTempo = event.microsecondsPerBeat;
    }
    return duration + event.deltaTime * tickDuration;
  }, 0);
}

// Scales the tempo of the track, with or without scaling the duration

export function scaleTempo(
  track: MidiEvent[],
  scaleFactor: number,
  keepDuration: boolean
) {
  // Add explicit tempo if it's implicit
  if (track.every((event) => event.type !== "setTempo")) {
    track = [
      {
        type: "setTempo",
        deltaTime: 0,
        meta: true,
        microsecondsPerBeat: altTempo(DEFAULT_BPM)
      },
      ...track
    ];
  }

  // Scale the track tempos
  track = track.map((event) =>
    event.type !== "setTempo"
      ? event
      : {
          ...event,
          microsecondsPerBeat: round(event.microsecondsPerBeat / scaleFactor)
        }
  );

  // Scale the track if the duration should be preserved
  if (keepDuration) {
    let idealTicksFromOrigin = 0,
      previousActualTicksFromOrigin = 0;

    track = track.map((event) => {
      const { deltaTime, ...rest } = event;
      idealTicksFromOrigin += deltaTime * scaleFactor;
      const realDelta = idealTicksFromOrigin - previousActualTicksFromOrigin;
      const newDelta = round(realDelta);
      previousActualTicksFromOrigin += newDelta;
      return { ...rest, deltaTime: newDelta };
    });
  }

  return track;
}
