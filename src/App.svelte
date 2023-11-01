<script lang="ts">
  import { writable } from "svelte/store";
  import Background from "./Background.svelte";
  import { ArduinoHueReader } from "./script";
  import { Toaster } from "svelte-french-toast";

  const reader = new ArduinoHueReader();
  let isConnected = false;
  reader.port.subscribe((port) => {
    isConnected = !!port;
  });

  type Message = {
    type: "log" | "error" | "help";
    message: string;
    timestamp: string;
  };

  let consoleElement: HTMLDivElement;

  const messages = writable<Message[]>([]);

  function onData(data: string | undefined) {
    console.log(data);
    if (data === undefined) return;

    if (data.substring(0, 7) !== "http://") {
      LOG("help", data);
      return;
    }

    const splitData = data.split("|");

    const assembledData = JSON.parse(splitData[1]);
    if (assembledData.hue !== undefined) {
      if (assembledData.hue < 0) {
        assembledData.hue += 65536;
      }
    }

    fetch(splitData[0], {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(assembledData),
    }).catch((e) => {
      LOG("error", e.message);
    });

    LOG("log", splitData[0] + " DATA: " + splitData[1]);
  }

  function LOG(type: "log" | "error" | "help", message: string) {
    const timestamp = generateTimestamp();

    messages.update((messages) => [...messages, { type, message, timestamp }]);

    setTimeout(() => {
      consoleElement.scrollTop = consoleElement.scrollHeight;
    }, 0);
  }

  function generateTimestamp() {
    const date = new Date();
    const minutes = appendZeros(date.getMinutes(), 2);
    const seconds = appendZeros(date.getSeconds(), 2);
    const milliseconds = appendZeros(date.getMilliseconds(), 3);

    return `${minutes}:${seconds}.${milliseconds}`;
  }

  function appendZeros(value: number, length: number) {
    return `${value}`.padStart(length, "0");
  }
</script>

<Toaster />
<main>
  <Background {isConnected} />
  <h1>Hue Hackeren</h1>
  <button on:click={() => reader.connect(onData)}> Connect </button>
  <button
    on:click={() => {
      location.reload();
    }}
  >
    Disconnect
  </button>

  <div
    style="display: flex; justify-content: center; align-items: center; gap: 8px;"
  >
    {#if isConnected}
      <span
        style="width: 8px; border-radius: 8px; height: 8px; background-color: lime;"
      />
      <p>CONNECTED</p>
    {:else}
      <span
        style="width: 8px; border-radius: 8px;  height: 8px; background-color: red;"
      />
      <p>NOT CONNECTED</p>
    {/if}
  </div>

  <div class="console" bind:this={consoleElement}>
    {#each $messages as message}
      <div class={"console-line " + message.type}>
        <p style="width: 85px; color: #555; margin:0">{message.timestamp}</p>
        <p style="margin:0;">{message.message}</p>
      </div>
    {/each}
  </div>
  <p>Busta Grymes productions</p>
  <p style="color: gray;">Contact the TAs if you experience any problems :D</p>
</main>

<style>
  .console {
    width: 95vw;
    max-width: 1100px;
    background-color: #1d1d1d;
    box-shadow: inset 0 0 10px #000000;
    border-radius: 16px;
    padding: 16px;
    height: calc(100vh - 400px);
    overflow-y: scroll;
    gap: 4px;
    display: flex;
    flex-direction: column;
  }

  .console-line {
    text-align: left;
    display: flex;
    margin: 0;
    padding: 0;
  }

  .log {
    color: rgb(56 189 248);
  }

  .error {
    color: rgb(248 113 113);
  }

  .help {
    color: rgb(216 180 254);
  }
</style>
