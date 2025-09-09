import { device } from "./gpu.js";

export let sceneLayout;
export let objectsLayout;
export let texturesLayout;
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
            }, {
                binding: 1,
                visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                buffer: { type: "uniform" }
            }
        ]
    });
    texturesLayout = device.createBindGroupLayout({
        entries: [
            {
                binding: 0,
                visibility: GPUShaderStage.FRAGMENT,
                sampler: { type: "filtering" }
            }, {
                binding: 1,
                visibility: GPUShaderStage.FRAGMENT,
                texture: { sampleType: "float", viewDimension: "2d-array" }
            }
        ]
    });
    renderLayout = device.createPipelineLayout({
        bindGroupLayouts: [
            sceneLayout,
            objectsLayout,
            texturesLayout
        ]
    });
}