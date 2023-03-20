import React from "react";
import { SimpleGrid, Stack } from "@mantine/core";
import { MidiData } from "midi-file";
import Track from "./Track";
import { Description } from "../utility";

type Props = {
  data: MidiData;
  setData(data: MidiData): void;
};

export default function Editor({ data, setData }: Props) {
  return (
    <Stack spacing={6}>
      <Description label="Format">SMF{data.header.format}</Description>
      <Description label="Number of tracks">
        {data.header.numTracks}
      </Description>
      {data.header.ticksPerFrame !== undefined ? (
        <>
          <Description label="Division">
            {data.header.ticksPerFrame} ticks / frame
          </Description>
          <Description label="Frames per second">
            {data.header.framesPerSecond}
          </Description>
        </>
      ) : (
        <>
          <Description label="Division">
            {data.header.ticksPerBeat} ticks / beat
          </Description>
        </>
      )}
      <Description label="Tracks" />
      <SimpleGrid cols={2}>
        {data.tracks.map((track, index) => (
          <Track
            key={index}
            n={index + 1}
            track={track}
            setTrack={(track) =>
              setData({
                ...data,
                tracks: data.tracks.map((t, i) => (i === index ? track : t)),
              })
            }
          />
        ))}
      </SimpleGrid>
    </Stack>
  );
}
