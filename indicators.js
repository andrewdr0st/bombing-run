import { device } from "./gpu.js";
import { indicatorMesh } from "./mesh.js";
import { indicatorBuffer } from "./buffers.js";
import { indicatorPipeline } from "./renderPipeline.js";
const { mat4 } = wgpuMatrix;

let indicatorTransforms = [
    mat4.translation([-2, 0, 0]),
    mat4.translation([2, 0, 0])
];

export function updateIndicators() {
    device.queue.writeBuffer(indicatorBuffer, 0, indicatorTransforms[0]);
    device.queue.writeBuffer(indicatorBuffer, 64, indicatorTransforms[1]);
}

export function drawIndicators(encoder) {
    indicatorPipeline.run(encoder, indicatorMesh, 2);
}
