import { setupGPUDevice } from "./gpu.js";
import { establishConnection } from "./network.js";

let lastFrameTime = 0;

async function init() {
    let webgpuSupport = await setupGPUDevice();
    if (!webgpuSupport) {
        return;
    }
    establishConnection();
    requestAnimationFrame(main);
}

function main(currentTime) {
    const deltaTime = (currentTime - lastFrameTime) * 0.001;
    lastFrameTime = currentTime;

    requestAnimationFrame(main);
}

init();