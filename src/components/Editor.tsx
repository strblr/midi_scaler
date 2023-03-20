import React, { useEffect } from "react";
import { Anchor, SimpleGrid, Stack } from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import { MidiData } from "midi-file";
import Track from "./Track";
import { Description } from "../utility";

type Props = {
  data: MidiData;
  setData(data: MidiData): void;
};

export default function Editor({ data, setData }: Props) {
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 70
  });
  useEffect(() => {
    setTimeout(() => scrollIntoView({ alignment: "start" }), 150);
  }, []);
  return (
    <Stack ref={targetRef} spacing={6}>
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
            {data.header.ticksPerBeat} ticks / beat (
            <Anchor href="https://en.wikipedia.org/wiki/Pulses_per_quarter_note">
              PPQN
            </Anchor>
            )
          </Description>
        </>
      )}
      <Description label="Tracks" />
      <SimpleGrid cols={2} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
        {data.tracks.map((track, index) => (
          <Track
            key={index}
            n={index + 1}
            track={track}
            setTrack={(track) =>
              setData({
                ...data,
                tracks: data.tracks.map((t, i) => (i === index ? track : t))
              })
            }
          />
        ))}
      </SimpleGrid>
    </Stack>
  );
}
