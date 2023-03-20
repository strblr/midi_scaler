import React, { useMemo } from "react";
import {
  Alert,
  Button,
  Checkbox,
  Modal,
  NumberInput,
  Stack
} from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { MidiEvent } from "midi-file";
import { round } from "lodash-es";
import { Description } from "../utility/visuals";
import { getBPMs, scaleTempo } from "../utility/algorithms";

type Props = {
  open: boolean;
  onClose(): void;
  track: MidiEvent[];
  setTrack(track: MidiEvent[]): void;
};

export default function Scaler({ open, onClose, track, setTrack }: Props) {
  const [newBPM, setNewBPM] = useInputState(120);
  const [keepDuration, setKeepDuration] = useInputState(true);
  const bpms = useMemo(() => getBPMs(track), [track]);
  const scaleFactor = newBPM / bpms[0];
  return (
    <Modal title="Scale BPM" opened={open} onClose={onClose}>
      {bpms.length > 1 ? (
        <Alert color="red" title="Multiple BPMs detected">
          The current track has {bpms.length} BPMs. For now, scaling only works
          on tracks with a unique BPM.
        </Alert>
      ) : (
        <Stack spacing="xs">
          <Description label="Current BPM">{round(bpms[0], 2)}</Description>
          <Description label="Scale factor">{scaleFactor}</Description>
          <NumberInput
            label="New BPM"
            precision={2}
            step={0.01}
            defaultValue={newBPM}
            onChange={(value) => setNewBPM(value || 0)}
          />
          <Checkbox
            label="Preserve duration"
            checked={keepDuration}
            onChange={setKeepDuration}
            description="A naive scaling also scales the duration. Keep this checked if you want to preserve the duration of the track, which is probably why you're here in the first place."
          />
          <Button
            onClick={() => {
              setTrack(scaleTempo(track, scaleFactor, keepDuration));
              onClose();
            }}
          >
            Scale
          </Button>
        </Stack>
      )}
    </Modal>
  );
}
