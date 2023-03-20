import React, { useMemo, useState } from "react";
import {
  ActionIcon,
  Badge,
  Box,
  Group,
  Menu,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { DataTable } from "mantine-datatable";
import { IconDots, IconRuler2 } from "@tabler/icons-react";
import { MidiEvent, MidiMetaEvent } from "midi-file";
import { capitalize, startCase } from "lodash-es";

type Props = {
  n: number;
  track: MidiEvent[];
  setTrack(track: MidiEvent[]): void;
};

export default function Track({ n, track, setTrack }: Props) {
  const PAGE_SIZE = 20;
  const [page, setPage] = useState(1);

  const records = useMemo(
    () => track.map((event, i) => ({ ...event, i })),
    [track]
  );

  const currentRecords = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return records.slice(start, end);
  }, [page, records]);

  return (
    <Paper shadow="xs" p="md" withBorder>
      <Group position="apart" mb="md">
        <Title order={4}>Track {n}</Title>
        <Menu withArrow shadow="md" position="bottom-end">
          <Menu.Target>
            <ActionIcon>
              <IconDots />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item icon={<IconRuler2 size={14} />}>Scale BPM</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
      <Box h={500}>
        <DataTable
          striped
          idAccessor="i"
          records={currentRecords}
          columns={[
            {
              accessor: "i",
              title: "#",
            },
            {
              accessor: "deltaTime",
              title: "Tick delta",
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
                    </Text>
                    {(event as MidiMetaEvent<any>).meta && <Badge>Meta</Badge>}
                  </Group>
                );
              },
            },
            {
              accessor: "index",
              title: "More",
              render: () => {
                return (
                  <ActionIcon>
                    <IconDots />
                  </ActionIcon>
                );
              },
            },
          ]}
          totalRecords={track.length}
          recordsPerPage={PAGE_SIZE}
          page={page}
          onPageChange={setPage}
        />
      </Box>
      <Group position="right" mt={4}>
        <Text color="dimmed" size="sm">
          {track.length} events
        </Text>
      </Group>
    </Paper>
  );
}
