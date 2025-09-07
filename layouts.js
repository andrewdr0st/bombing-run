import { device } from "./gpu.js";

export let sceneLayout;
export let objectsLayout;
export let renderLayout;

export function setupRenderLayout() {
    sceneLayout = device.createBindGroupLayout({
        entries: [
            {
                binding: 0,
                visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                buffer: { type: "uniform" }
            }
        ]
    });
    objectsLayout = device.createBindGroupLayout({
        entries: [
            {
                binding: 0,
                visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                buffer: { type: "uniform" }
            }
        ]
    });
    renderLayout = device.createPipelineLayout({
        bindGroupLayouts: [
            sceneLayout,
            objectsLayout
        ]
    });
}