import { device } from "./gpu.js";
import { vertexList, indexList } from "./mesh.js";

export let vertexBuffer;
export let indexBuffer;

export let sceneBuffer;
export let indicatorBuffer;

const MAT4x4_BYTE_SIZE = 64;

export function setupBuffers() {
    const vertices = new Float32Array(vertexList);
    const indices = new Uint32Array(indexList);
    vertexBuffer = device.createBuffer({
        size: vertices.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    });
    indexBuffer = device.createBuffer({
        size: indices.byteLength,
        usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
    });
    device.queue.writeBuffer(vertexBuffer, 0, vertices);
    device.queue.writeBuffer(indexBuffer, 0, indices);

    sceneBuffer = device.createBuffer({
        size: MAT4x4_BYTE_SIZE,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    indicatorBuffer = device.createBuffer({
        size: MAT4x4_BYTE_SIZE,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
}