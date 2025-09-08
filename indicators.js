import { device } from "./gpu.js";
import { indicatorMesh } from "./mesh.js";
import { indicatorBuffer } from "./buffers.js";
import { indicatorPipeline } from "./renderPipeline.js";
const { mat4 } = wgpuMatrix;

let indicatorCount = 2;
const moveSpeed = 0.001;

const baseTransforms = [
    mat4.translation([-2, 0, 0]),
    mat4.translation([2, 0, 2])
]

const indicatorTransforms = [null, null, null, null, null, null];

export function updateIndicators(currentTime) {
    const t1 = mat4.translation([0, Math.sin(currentTime * moveSpeed) + 2, 0]);
    const t2 = mat4.translation([0, Math.sin(currentTime * moveSpeed) * 2 + 4, 0]);
    for (let i = 0; i < indicatorCount; i++) {
        let idx = i * 3;
        indicatorTransforms[idx] = baseTransforms[i];
        indicatorTransforms[idx + 1] = mat4.multiply(baseTransforms[i], t1);
        indicatorTransforms[idx + 2] = mat4.multiply(baseTransforms[i], t2);
    }
    
    writeToBuffer();
}

export function drawIndicators(encoder) {
    indicatorPipeline.run(encoder, indicatorMesh, indicatorCount * 3);
}

function writeToBuffer() {
    const l = indicatorCount * 3;
    for (let i = 0; i < l; i++) {
        device.queue.writeBuffer(indicatorBuffer, i * 64, indicatorTransforms[i]);
    }
}
