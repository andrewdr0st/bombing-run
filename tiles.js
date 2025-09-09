import { device } from "./gpu.js";
import { tileMesh } from "./mesh.js";
import { tileBuffer } from "./buffers.js";
import { mainPipeline } from "./renderPipeline.js";
const { mat4 } = wgpuMatrix;

const tileCount = 18;
const lcenter = -5;
const rcenter = 5;

export function updateTiles() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let offset = i * 3 + j;
            let xT = lcenter + (j - 1) * 2;
            let zT = lcenter + (i - 1) * 2;
            device.queue.writeBuffer(tileBuffer, offset * 64, mat4.translation([xT, 0, zT]));
        }
    }
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let offset = i * 3 + j + 9;
            let xT = rcenter + (j - 1) * 2;
            let zT = rcenter + (i - 1) * 2;
            device.queue.writeBuffer(tileBuffer, offset * 64, mat4.translation([xT, 0, zT]));
        }
    }
}

export function drawTiles(encoder) {
    mainPipeline.run(encoder, tileMesh, tileCount);
}