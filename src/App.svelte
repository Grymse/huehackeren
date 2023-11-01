<script lang="ts">
  import { ArduinoHueReader } from "./script";

  const reader = new ArduinoHueReader(console.log);
</script>

<main>
  <button on:click={reader.connect}> Connect </button>
</main>
