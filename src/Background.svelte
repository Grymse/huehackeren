<script>
  export let isConnected = false;
</script>

<div style="position: sticky;z-index: -1;" class="ripple-background">
  <div
    style={isConnected ? "background: #84CC16;" : "background: #f43f5e;"}
    class="circle xxlarge shade1"
  />
  <div
    style={isConnected ? "background: #84CC16;" : "background: #f43f5e;"}
    class="circle xlarge shade2"
  />
  <div
    style={isConnected ? "background: #84CC16;" : "background: #f43f5e;"}
    class="circle large shade3"
  />
  <div
    style={isConnected ? "background: #84CC16;" : "background: #f43f5e;"}
    class="circle medium shade4"
  />
  <div
    style={isConnected ? "background: #84CC16;" : "background: #f43f5e;"}
    class="circle small shade5"
  />
</div>

<div
  style="position: sticky;z-index: -1; margin-left: 100%;"
  class="ripple-background"
>
  <div
    style={isConnected ? "background: #84CC16;" : "background: #f43f5e;"}
    class="circle xxlarge shade1"
  />
  <div
    style={isConnected ? "background: #84CC16;" : "background: #f43f5e;"}
    class="circle xlarge shade2"
  />
  <div
    style={isConnected ? "background: #84CC16;" : "background: #f43f5e;"}
    class="circle large shade3"
  />
  <div
    style={isConnected ? "background: #84CC16;" : "background: #f43f5e;"}
    class="circle medium shade4"
  />
  <div
    style={isConnected ? "background: #84CC16;" : "background: #f43f5e;"}
    class="circle small shade5"
  />
</div>

<style>
  .circle {
    position: absolute;
    border-radius: 50%;

    animation: ripple 35s infinite;
    box-shadow: 0px 0px 1px 0px #508fb9;
  }

  .small {
    width: 200px;
    height: 200px;
    left: -100px;
    bottom: -100px;
  }

  .medium {
    width: 400px;
    height: 400px;
    left: -200px;
    bottom: -200px;
  }

  .large {
    width: 600px;
    height: 600px;
    left: -300px;
    bottom: -300px;
  }

  .xlarge {
    width: 800px;
    height: 800px;
    left: -400px;
    bottom: -400px;
  }

  .xxlarge {
    width: 1000px;
    height: 1000px;
    left: -500px;
    bottom: -500px;
  }

  .shade1 {
    opacity: 0.025;
  }
  .shade2 {
    opacity: 0.05;
  }

  .shade3 {
    opacity: 0.075;
  }

  .shade4 {
    opacity: 0.1;
  }

  .shade5 {
    opacity: 0.125;
  }

  @keyframes ripple {
    0% {
      transform: scale(0.8);
    }

    50% {
      transform: scale(1.2);
    }

    100% {
      transform: scale(0.8);
    }
  }
</style>
