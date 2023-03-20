import { MidiData, parseMidi, writeMidi } from "midi-file";
import { DEMO_URL } from "../session/constants";

export async function loadDemo() {
  const result = await fetch(DEMO_URL);
  return new File(
    [await result.blob()],
    DEMO_URL.split("/").pop() ?? "demo.mid"
  );
}

export function readMidi(file: File) {
  return new Promise<MidiData>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function () {
      try {
        const seq = new Uint8Array(reader.result as ArrayBuffer);
        resolve(parseMidi(seq));
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export function downloadMidi(fileName: string, data: MidiData) {
  const seq = new Uint8Array(writeMidi(data));
  const blob = new Blob([seq], { type: "audio/midi" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
