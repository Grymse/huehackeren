import type SerialPort from "serialport";
import { writable, type Writable } from "svelte/store";

export class ArduinoHueReader {
  port: Writable<SerialPort | undefined> = writable<SerialPort | undefined>(
    undefined
  );
  concatentatedData: string = "";

  async connect(onData: (data: string | undefined) => void) {
    // Prompt user to select any serial port
    const port = await navigator.serial.requestPort();
    this.port.set(port);

    // Open the port with the specified baud rate
    await port.open({ baudRate: 115200 });

    // Define the text decoder
    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
    const reader = textDecoder.readable.getReader();

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
    if (this.port) {
      await this.port.close();
      this.port.set(undefined);
    }
  }
}
/* 

function errMessage(err) {
  console.log("\x1b[31m", "#####################################");
  console.log("\x1b[31m", err);
  console.log("\x1b[31m", "#####################################", "\x1b[0m");
}
function errOneLine(err) {
  console.log("\x1b[31m", err, "\x1b[0m");
}

function errBar() {
  console.log("\x1b[31m", "#####################################", "\x1b[0m");
}


function start(path) {
  const port = new SerialPort(path, { baudRate: 115200 });
  port.on("error", portError);
  const parser = new Readline();
  port.pipe(parser);

  parser.on("data", (line) => {
    if (line.substring(0, 7) === "http://") {
      const input = line.split("|");
      const data = JSON.parse(input[1]);
      if (data.hue !== undefined) {
        if (data.hue < 0) {
          data.hue += 65536;
        }
      }
      sendData(input[0], data);
      if (!errorState) log(`> ${input[0]}::${JSON.stringify(data)}`);
    } else {
      console.log("\x1b[36m", `> ${line}`, "\x1b[0m");
    }
  });
}

function triggerErrorState() {
  errorState = true;
  clearTimeout(triggerErrorState.timeout);
  triggerErrorState.timeout = setTimeout(() => {
    errorState = false;
  }, 2000);
}

 */
