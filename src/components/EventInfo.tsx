import React from "react";
import { Badge, Group, Stack } from "@mantine/core";
import { MidiEvent, MidiMetaEvent } from "midi-file";
import { noteNumberToName } from "@guillaumearm/midiutils";
import { capitalize, startCase } from "lodash-es";
import { Description } from "../utility";

type Props = {
  event: MidiEvent;
};

export default function EventInfo({ event }: Props) {
  const specificContent = () => {
    switch (event.type) {
      case "noteOn":
      case "noteOff":
        return (
          <>
            <Description label="Note">
              {noteNumberToName(event.noteNumber)}
            </Description>
            <Description label="Velocity">{event.velocity}</Description>
            <Description label="Channel">{event.channel}</Description>
            {event.running && (
              <Description label="Running">{String(event.running)}</Description>
            )}
          </>
        );
      case "controller":
        return (
          <>
            <Description label="Controller">{event.controllerType}</Description>
            <Description label="Value">{event.value}</Description>
            <Description label="Channel">{event.channel}</Description>
            {event.running && (
              <Description label="Running">{String(event.running)}</Description>
            )}
          </>
        );
      case "setTempo":
        return (
          <Description label="BPM">
            {+(60e6 / event.microsecondsPerBeat).toFixed(2)} (
            {event.microsecondsPerBeat} µs / beat)
          </Description>
        );
      case "text":
      case "trackName":
      case "copyrightNotice":
      case "instrumentName":
      case "lyrics":
      case "marker":
      case "cuePoint":
        return <Description label="Text">{event.text}</Description>;
      case "timeSignature":
        return (
          <>
            <Description label="Signature">
              {event.numerator} / {event.denominator}
            </Description>
            <Description label="Metronome">{event.metronome}</Description>
            <Description label="32nd notes">{event.thirtyseconds}</Description>
          </>
        );
    }
  };
  return (
    <Stack spacing={8}>
      <Description label="Type">
        <Group>
          {capitalize(startCase(event.type))}{" "}
          {(event as MidiMetaEvent<any>).meta && <Badge>Meta</Badge>}
        </Group>
      </Description>
      <Description label="Tick delta">{event.deltaTime}</Description>
      {specificContent()}
    </Stack>
  );
}
