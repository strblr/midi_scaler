import React, { useMemo, useState } from "react";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  Paper,
  Stack,
  Switch,
  Text,
  Title
} from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { DataTable } from "mantine-datatable";
import { IconDots, IconRuler2 } from "@tabler/icons-react";
import { MidiData, MidiEvent, MidiMetaEvent } from "midi-file";
import { noteNumberToName } from "@guillaumearm/midiutils";
import { capitalize, round, startCase } from "lodash-es";
import dayjs from "dayjs";
import Scaler from "./Scaler";
import EventInfo from "./EventInfo";
import { EVENT_PAGE_SIZE } from "../session/constants";
import { Description } from "../utility/visuals";
import { getBPMs, getDuration } from "../utility/algorithms";

type Props = {
  n: number;
  data: MidiData;
  track: MidiEvent[];
  setTrack(track: MidiEvent[]): void;
};

export default function Track({ n, data, track, setTrack }: Props) {
  const [metaOnly, setMetaOnly] = useInputState(false);
  const [scalerOpen, setScalerOpen] = useState(false);
  const [page, setPage] = useState(1);

  const bpms = useMemo(() => getBPMs(track), [track]);
  const duration = useMemo(() => getDuration(data, track), [data, track]);

  const records = useMemo(
    () =>
      track
        .map((event, i) => ({ ...event, i }))
        .filter((event) => !metaOnly || (event as MidiMetaEvent<any>).meta),
    [track, metaOnly]
  );

  const pageRecords = useMemo(() => {
    const start = (page - 1) * EVENT_PAGE_SIZE;
    const end = start + EVENT_PAGE_SIZE;
    return records.slice(start, end);
  }, [page, records]);

  return (
    <Paper shadow="xs" p="md" withBorder>
      <Group position="apart">
        <Title order={4}>Track {n}</Title>
        <Button
          leftIcon={<IconRuler2 size={16} />}
          onClick={() => setScalerOpen(true)}
        >
          Scale BPM
        </Button>
      </Group>
      <Stack mt="md">
        <Stack spacing={6}>
          <Description label="BPM">
            {bpms.map((bpm) => round(bpm, 2))}
          </Description>
          {duration && (
            <Description label="Duration">
              {dayjs.duration(round(duration / 1000)).format("HH:mm:ss.SSS")}
            </Description>
          )}
        </Stack>
        <Box h={500}>
          <DataTable
            striped
            idAccessor="i"
            records={pageRecords}
            columns={[
              {
                accessor: "i",
                title: "#"
              },
              {
                accessor: "deltaTime",
                title: "Tick delta"
              },
              {
                accessor: "type",
                title: "Type",
                render: (event) => {
                  return (
                    <Group>
                      <Text>
                        {capitalize(startCase(event.type))}
                        {event.type === "controller" && (
                          <> ({event.controllerType})</>
                        )}
                        {(event.type === "noteOn" ||
                          event.type === "noteOff") && (
                          <> ({noteNumberToName(event.noteNumber)})</>
                        )}
                      </Text>
                      {(event as MidiMetaEvent<any>).meta && (
                        <Badge>Meta</Badge>
                      )}
                    </Group>
                  );
                }
              },
              {
                accessor: "index",
                title: "More",
                render: (event) => {
                  return (
                    <ActionIcon
                      onClick={() =>
                        modals.open({
                          title: "Event details",
                          children: <EventInfo event={event} />
                        })
                      }
                    >
                      <IconDots />
                    </ActionIcon>
                  );
                }
              }
            ]}
            totalRecords={records.length}
            recordsPerPage={EVENT_PAGE_SIZE}
            page={page}
            onPageChange={setPage}
          />
        </Box>
        <Stack spacing={4} align="end">
          <Switch
            labelPosition="left"
            label="Show only meta"
            checked={metaOnly}
            onChange={setMetaOnly}
          />
          <Text color="dimmed" size="sm">
            {records.length} events
          </Text>
        </Stack>
      </Stack>
      <Scaler
        open={scalerOpen}
        onClose={() => setScalerOpen(false)}
        track={track}
        setTrack={setTrack}
      />
    </Paper>
  );
}
