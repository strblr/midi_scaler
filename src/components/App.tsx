import React from "react";
import {
  Alert,
  Button,
  Center,
  Container,
  List,
  Loader,
  Stack,
  Title,
} from "@mantine/core";
import { useSetState } from "@mantine/hooks";
import { IconExclamationCircle } from "@tabler/icons-react";
import { MidiData } from "midi-file";
import FileUpload from "./FileUpload";
import Editor from "./Editor";
import { Description, downloadMidi, readMidi } from "../utility";

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
    error: false,
  });
  return (
    <Container py="md">
      <Stack spacing="2rem">
        <Title order={1} align="center">
          MIDI Scaler
        </Title>
        <Alert title="Tutorial" icon={<IconExclamationCircle />}>
          <List type="ordered">
            <List.Item>
              <strong>Upload</strong> a MIDI file from your computer
            </List.Item>
            <List.Item>
              On the top-right corner of each track, click on the 3 dots to open
              the menu
            </List.Item>
            <List.Item>
              Choose from the available options to transform that track
            </List.Item>
            <List.Item>
              Apply any number of transformations to any track you want
            </List.Item>
            <List.Item>Download the result file</List.Item>
          </List>
        </Alert>
        <FileUpload
          onDrop={async (file) => {
            setState({
              file: file,
              data: null,
              loading: true,
              error: false,
            });
            try {
              setState({
                data: await readMidi(file),
                loading: false,
              });
            } catch (e) {
              setState({
                loading: false,
                error: true,
              });
            }
          }}
        />
        {file && <Description label="File">{file.name}</Description>}
        {loading ? (
          <Center>
            <Loader size="lg" />
          </Center>
        ) : error ? (
          <Alert
            color="red"
            title="Parse error"
            icon={<IconExclamationCircle />}
          >
            Something went wrong during the parsing of the MIDI file. Please try
            again or check to make sure the file is a valid MIDI file.
          </Alert>
        ) : data ? (
          <>
            <Editor data={data} setData={(data) => setState({ data })} />
            <Button
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
