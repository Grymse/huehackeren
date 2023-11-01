<script lang="ts">
  import { writable } from "svelte/store";
  import { ArduinoHueReader } from "./script";

  const reader = new ArduinoHueReader();
  let isConnected = false;
  reader.port.subscribe((port) => {
    isConnected = !!port;
  });

  type Message = {
    type: "log" | "error";
    message: string;
  };

  const messages = writable<Message[]>([]);

  function onData(data: string | undefined) {
    console.log(data);
    if (data === undefined) return;

    // onData defines the whole request

    const splitData = data.split("|");

    fetch(splitData[0], {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: splitData[1],
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

  .log {
    color: red;
  }
</style>
