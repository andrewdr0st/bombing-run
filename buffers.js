import { device } from "./gpu.js";
import { vertexList, indexList, smallVertexList, smallIndexList } from "./mesh.js";

export let vertexBuffer;
export let indexBuffer;
export let smallVertexBuffer;
export let smallIndexBuffer;

export let sceneBuffer;
export let indicatorBuffer;
export let tileBuffer;

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

    const svertices = new Float32Array(smallVertexList);
    const sindices = new Uint32Array(smallIndexList);
    smallVertexBuffer = device.createBuffer({
        size: svertices.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    });
    smallIndexBuffer = device.createBuffer({
        size: sindices.byteLength,
        usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
    });
    device.queue.writeBuffer(smallVertexBuffer, 0, svertices);
    device.queue.writeBuffer(smallIndexBuffer, 0, sindices);

    sceneBuffer = device.createBuffer({
        size: MAT4x4_BYTE_SIZE,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    indicatorBuffer = device.createBuffer({
        size: MAT4x4_BYTE_SIZE * 12,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    tileBuffer = device.createBuffer({
        size: MAT4x4_BYTE_SIZE * 18,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
}