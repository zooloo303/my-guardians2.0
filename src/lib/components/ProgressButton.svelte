<script>
  let { onclick, children } = $props();
  
  let progress = $state(0);
  let intervalId = $state(null);
  let isPressed = $state(false);

  const DURATION = 1000; // 2 seconds to complete
  const INTERVAL = 25; // Update every 50ms

  function startProgress() {
    isPressed = true;
    progress = 0;
    intervalId = setInterval(() => {
      progress += (INTERVAL / DURATION) * 100;
      if (progress >= 100) {
        completeProgress();
      }
    }, INTERVAL);
  }

  function stopProgress() {
    isPressed = false;
    clearInterval(intervalId);
    progress = 0;
  }

  function completeProgress() {
    clearInterval(intervalId);
    progress = 100;
    isPressed = false;
    onclick();
  }
</script>

<button
  onmousedown={startProgress}
  onmouseup={stopProgress}
  onmouseleave={stopProgress}
  class:pressed={isPressed}
>
  <div class="progress-bar" style="width: {progress}%"></div>
  <span class="button-text">
    {@render children()}
  </span>
</button>

<style>
  button {
    position: relative;
    overflow: hidden;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: #3498db;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  button:hover {
    background-color: #2980b9;
  }

  button.pressed {
    background-color: #2980b9;
  }

  .progress-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.3);
    transition: width 0.05s linear;
  }

  .button-text {
    position: relative;
    z-index: 1;
  }
</style>

