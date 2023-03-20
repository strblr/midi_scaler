import React from "react";
import { Group, rem, Text, useMantineTheme } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { IconFileMusic, IconUpload, IconX } from "@tabler/icons-react";

type Props = {
  onDrop: (file: File) => void;
};

export default function FileUpload({ onDrop }: Props) {
  const theme = useMantineTheme();
  return (
    <Dropzone
      multiple={false}
      onDrop={([file]) => file && onDrop(file)}
      onReject={() =>
        notifications.show({
          color: "red",
          title: "Error",
          message: "File is too large or not a valid MIDI file",
        })
      }
      maxSize={5 * 1024 ** 2}
      accept={{ "audio/midi": [".mid", ".midi"] }}
    >
      <Group
        position="center"
        spacing="xl"
        style={{ minHeight: rem(220), pointerEvents: "none" }}
      >
        <Dropzone.Accept>
          <IconUpload
            size="3.2rem"
            stroke={1.5}
            color={
              theme.colors[theme.primaryColor][
                theme.colorScheme === "dark" ? 4 : 6
              ]
            }
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX
            size="3.2rem"
            stroke={1.5}
            color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]}
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconFileMusic size="3.2rem" stroke={1.5} />
        </Dropzone.Idle>

        <div>
          <Text size="xl" inline>
            Drag MIDI file here or click to select file
          </Text>
          <Text size="sm" color="dimmed" inline mt={7}>
            .mid .midi (each file should not exceed 5mb)
          </Text>
        </div>
      </Group>
    </Dropzone>
  );
}
