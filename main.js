import { canvas, aspectRatio, setupCanvas } from "./canvasManager.js";
import { device, setupGPUDevice, updateRenderTexture } from "./gpu.js";
import { loadMeshes } from "./mesh.js";
import { createRoom, joinRoom } from "./network.js";
import { createPipelines } from "./renderPipeline.js";
import { setupRenderLayout } from "./layouts.js";
import { setupBindGroups } from "./bindGroups.js";
import { indicatorBuffer, setupBuffers } from "./buffers.js";
import { Camera } from "./camera.js";
import { drawIndicators, updateIndicators } from "./indicators.js";
const { mat4 } = wgpuMatrix;

let lastFrameTime = 0;

async function init() {
    setupCanvas();
    let webgpuSupport = await setupGPUDevice();
    if (!webgpuSupport) {
        return;
    }
    await loadMeshes();
    setupRenderLayout();
    setupBuffers();
    setupBindGroups();
    await createPipelines();
    let c = new Camera(aspectRatio);
    c.position = [0, 5, 5];
    c.lookTo = [0, -1, -0.1];
    c.updateLookAt();
    c.writeData();
    device.queue.writeBuffer(indicatorBuffer, 0, mat4.identity());
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

    updateIndicators(currentTime);

    updateRenderTexture();

    const encoder = device.createCommandEncoder();
    drawIndicators(encoder);
    const commandBuffer = encoder.finish();
    device.queue.submit([commandBuffer]);

    requestAnimationFrame(main);
}

init();