<script lang="ts">
  import { writable } from "svelte/store";
  import { ArduinoHueReader } from "./script";

  const reader = new ArduinoHueReader();
  let isConnected = false;
  reader.port.subscribe((port) => {
    isConnected = !!port;
  });

  type Message = {
    type: "log" | "error" | "help";
    message: string;
  };

  const messages = writable<Message[]>([]);

  function onData(data: string | undefined) {
    console.log(data);
    if (data === undefined) return;

    if (data.substring(0, 7) !== "http://") {
      messages.update((messages) => [
        ...messages,
        { type: "help", message: data },
      ]);
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
      messages.update((messages) => [
        ...messages,
        { type: "error", message: e.message },
      ]);
    });

    messages.update((messages) => [
      ...messages,
      { type: "log", message: data },
    ]);
  }
</script>

<main>
  <h1>WebHue</h1>
  <button on:click={() => reader.connect(onData)}> Connect </button>
  <button
    on:click={() => {
      reader.disconnect;
      messages.set([]);
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

  <ul>
    {#each $messages as message}
      <li class={message.type}>#: {message.message}</li>
    {/each}
  </ul>
  <p>Busta Grymes productions A/S</p>
  <p style="color: gray;">Contact the TAs if you experience any problems :D</p>
</main>

<style>
  ul {
    width: 95vw;
    max-width: 1100px;
    background-color: #1d1d1d;
    box-shadow: inset 0 0 10px #000000;
    border-radius: 16px;
    padding: 16px;
    height: calc(100vh - 400px);
  }

  li {
    text-align: left;
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
