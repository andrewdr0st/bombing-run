import { canvas, setupCanvas } from "./canvasManager.js";
import { device, setupGPUDevice, updateRenderTexture } from "./gpu.js";
import { loadMeshes } from "./mesh.js";
import { createRoom, joinRoom } from "./network.js";
import { createPipelines } from "./renderPipeline.js";
import { setupRenderLayout } from "./layouts.js";
import { setupBindGroups } from "./bindGroups.js";
import { setupBuffers } from "./buffers.js";
import { setupCamera } from "./camera.js";
import { drawIndicators, updateIndicators } from "./indicators.js";
import { drawTiles, updateTiles } from "./tiles.js";
import { setupTextures } from "./textures.js";
import { createBoxes, performRaycast } from "./raycast.js";
const { mat4 } = wgpuMatrix;

let lastFrameTime = 0;

async function init() {
    setupCanvas();
    let webgpuSupport = await setupGPUDevice();
    if (!webgpuSupport) {
        return;
    }
    await Promise.all([loadMeshes(), setupTextures()]);
    setupRenderLayout();
    setupBuffers();
    setupBindGroups();
    await createPipelines();
    setupCamera();
    const params = new URLSearchParams(window.location.search);
    const joinId = params.get("join");
    if (joinId) {
        joinRoom(joinId)
    } else {
        createRoom("bomber");
    }
    createBoxes();
    updateTiles();
    requestAnimationFrame(main);
}

function main(currentTime) {
    const deltaTime = (currentTime - lastFrameTime) * 0.001;
    lastFrameTime = currentTime;

    updateIndicators(currentTime);

    updateRenderTexture();

    const encoder = device.createCommandEncoder();
    drawIndicators(encoder);
    drawTiles(encoder);
    const commandBuffer = encoder.finish();
    device.queue.submit([commandBuffer]);

    requestAnimationFrame(main);
}

document.addEventListener("click", (e) => {
    let w = canvas.width / 2;
    let h = canvas.height / 2;
    let x = (e.clientX - w) / w;
    let y = (h - e.clientY) / h;
    performRaycast(x, y);
});

init();