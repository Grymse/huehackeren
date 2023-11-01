<script lang="ts">
  import { ArduinoHueReader } from "./script";

  const reader = new ArduinoHueReader();

  function onData(data: string | undefined) {
    if (data === undefined) return;

    fetch("http://localhost:3000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });
  }
</script>

<main>
  <label for="" />
  <input type="text" />
  <button on:click={() => reader.connect(console.log)}> Connect </button>
  <button on:click={reader.disconnect}> Disconnect </button>
</main>
