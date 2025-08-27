import { setupGPUDevice } from "./gpu.js";
import { MeshLoader } from "./mesh.js";
import { createRoom, joinRoom } from "./network.js";

let lastFrameTime = 0;

async function init() {
    let webgpuSupport = await setupGPUDevice();
    if (!webgpuSupport) {
        return;
    }
    const params = new URLSearchParams(window.location.search);
    const joinId = params.get("join");
    if (joinId) {
        joinRoom(joinId)
    } else {
        createRoom("bomber");
    }
    requestAnimationFrame(main);
}

function main(currentTime) {
    const deltaTime = (currentTime - lastFrameTime) * 0.001;
    lastFrameTime = currentTime;

    requestAnimationFrame(main);
}

init();