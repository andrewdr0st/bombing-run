import { device } from "./gpu.js";

export let sceneBuffer;
export let indicatorBuffer;

const MAT4x4_BYTE_SIZE = 64;

export function setupBuffers() {
    sceneBuffer = device.createBuffer({
        size: MAT4x4_BYTE_SIZE,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    indicatorBuffer = device.createBuffer({
        size: MAT4x4_BYTE_SIZE,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
}