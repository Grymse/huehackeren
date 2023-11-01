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
  <button on:click={reader.disconnect}> Disconnect </button>

  {#if isConnected}
    <p>CONNECTED</p>
  {:else}
    <p>NOT CONNECTED</p>
  {/if}

  <ul>
    {#each $messages as message}
      <li class={message.type}>#: {message.message}</li>
    {/each}
  </ul>
</main>

<style>
  .log {
    color: black;
  }

  .error {
    color: red;
  }

  .help {
    color: green;
  }
</style>
