import React from "react";
import {
  Alert,
  Anchor,
  Button,
  Center,
  Container,
  List,
  Loader,
  Stack,
  Text,
  ThemeIcon,
  Title
} from "@mantine/core";
import { useSetState } from "@mantine/hooks";
import { IconBrandGithub } from "@tabler/icons-react";
import { MidiData } from "midi-file";
import FileUpload from "./FileUpload";
import Editor from "./Editor";
import { downloadMidi, readMidi } from "../utility";

type AppState = {
  file: File | null;
  data: MidiData | null;
  loading: boolean;
  error: boolean;
};

function App() {
  const [{ file, data, loading, error }, setState] = useSetState<AppState>({
    file: null,
    data: null,
    loading: false,
    error: false
  });
  return (
    <Container py="md">
      <Anchor
        href="https://github.com/strblr/midi_scaler"
        pos="absolute"
        display="block"
        top="1rem"
        right="1rem"
      >
        <ThemeIcon variant="light">
          <IconBrandGithub />
        </ThemeIcon>
      </Anchor>
      <Stack spacing="2rem">
        <Title order={1} align="center">
          MIDI Scaler
        </Title>
        <Title order={3} align="center">
          Recorded some MIDI without setting a proper project tempo, didn't you?
        </Title>
        <Alert title="Tutorial">
          <List type="ordered">
            <List.Item>
              <b>Upload</b> a MIDI file from your computer
            </List.Item>
            <List.Item>
              On the top-right corner of each track,{" "}
              <b>
                click on the <i>Scale BPM</i> button
              </b>{" "}
              to scale the track
            </List.Item>
            <List.Item>
              Apply any transformation to any track you want
            </List.Item>
            <List.Item>
              <b>Export</b> the final result
            </List.Item>
          </List>
          <Text inherit mt="xs">
            Note: The app works currently best on SMF0 MIDI files. A futur
            update will add full support for SMF1 and SMF2 files.
          </Text>
        </Alert>
        <FileUpload
          onDrop={async (file) => {
            setState({
              file: file,
              data: null,
              loading: true,
              error: false
            });
            try {
              setState({
                data: await readMidi(file),
                loading: false
              });
            } catch (e) {
              setState({
                loading: false,
                error: true
              });
            }
          }}
        />
        {file && <Title order={3}>{file.name}</Title>}
        {loading ? (
          <Center>
            <Loader size="lg" />
          </Center>
        ) : error ? (
          <Alert color="red" title="Parse error">
            Something went wrong during the parsing of the MIDI file. Please try
            again or check to make sure the file is a valid MIDI file.
          </Alert>
        ) : data ? (
          <>
            <Editor data={data} setData={(data) => setState({ data })} />
            <Button
              size="xl"
              onClick={() => downloadMidi(file?.name ?? "export.mid", data)}
            >
              Export
            </Button>
          </>
        ) : null}
      </Stack>
    </Container>
  );
}

export default App;
