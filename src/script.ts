import type SerialPort from "serialport";
import { get, writable, type Writable } from "svelte/store";
import toast from "svelte-french-toast";

export class ArduinoHueReader {
  port: Writable<SerialPort | undefined> = writable<SerialPort | undefined>(
    undefined
  );
  concatentatedData: string = "";
  reader: ReadableStreamDefaultReader<string> | undefined;

  async connect(onData: (data: string | undefined) => void) {
    // Prompt user to select any serial port
    let port;
    // Open the port with the specified baud rate
    try {
      port = await navigator.serial.requestPort();
      this.port.set(port);
      await port.open({ baudRate: 115200 });
    } catch (e) {
      toast.error(
        "Failed to open serial port. Ensure that the Arduino is connected and the serial monitor is closed.",
        {
          duration: 10000,
          position: "bottom-left",
        }
      ),
        this.port.set(undefined);
      console.error(e);
      return;
    }

    // Define the text decoder
    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
    const reader = textDecoder.readable.getReader();
    this.reader = reader;

    // Read loop
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        reader.releaseLock();
        break;
      }

      // Concatenate data
      this.concatentatedData += value;

      // Split data by line
      const lines = this.concatentatedData.split("\n");

      // remove all processed lines from the concatenated data
      this.concatentatedData = lines[lines.length - 1];

      // If there are more than one line, the last line is incomplete
      // and should be concatenated with the next chunk of data
      if (lines.length > 1) {
        for (let i = 0; i < lines.length - 1; i++) {
          onData(lines[i]);
        }
      }
    }

    await readableStreamClosed;
    await port.close();
    this.port.set(undefined);
  }

  async disconnect() {
    console.log("disconnect");
    const port = get(this.port);
    try {
      if (port && !port?.closed) {
        this.reader?.cancel();
        this.reader?.closed;
        this.reader?.releaseLock();
        this.reader = undefined;
        await port.close();
      }
    } catch (e) {}
    this.port.set(undefined);
  }
}
