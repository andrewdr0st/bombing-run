import { device, setupGPUDevice, canvas } from "./gpu.js";
import { MeshLoader } from "./mesh.js";
import { createRoom, joinRoom } from "./network.js";
import { IndicatorVertexDescriptor, RenderPipeline } from "./renderPipeline.js";
import { setupRenderLayout } from "./layouts.js";
import { setupBindGroups } from "./bindGroups.js";
import { indicatorBuffer, setupBuffers } from "./buffers.js";
import { Camera } from "./camera.js";
const { mat4 } = wgpuMatrix;

let lastFrameTime = 0;
let rpass;

async function init() {
    let webgpuSupport = await setupGPUDevice();
    if (!webgpuSupport) {
        return;
    }
    let m = new MeshLoader();
    await m.parseObjFile("indicator.obj");
    m.addToList();
    setupRenderLayout();
    setupBuffers();
    setupBindGroups();
    rpass = new RenderPipeline("indicator.wgsl", IndicatorVertexDescriptor);
    await rpass.build();
    console.log(canvas.width);
    let c = new Camera(canvas.width / canvas.height);
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

    const encoder = device.createCommandEncoder();
    rpass.run(encoder);
    const commandBuffer = encoder.finish();
    device.queue.submit([commandBuffer]);

    //requestAnimationFrame(main);
}

init();