import { device } from "./gpu.js";
import { tileMesh } from "./mesh.js";
import { tileBuffer } from "./buffers.js";
import { mainPipeline } from "./renderPipeline.js";
const { mat4 } = wgpuMatrix;

const tileCount = 1;

export function updateTiles() {
    device.queue.writeBuffer(tileBuffer, 0, mat4.identity());
}

export function drawTiles(encoder) {
    mainPipeline.run(encoder, tileMesh, tileCount);
}