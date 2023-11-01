<script lang="ts">
  import { ArduinoHueReader } from "./script";

  const reader = new ArduinoHueReader(console.log);
</script>

<main>
  <div />
  <button on:click={reader.connect}> Connect </button>
  <button on:click={reader.disconnect}> Disconnect </button>
</main>
