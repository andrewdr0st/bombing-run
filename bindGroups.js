import { device } from "./gpu.js";
import { sceneLayout, objectsLayout } from "./layouts.js";
import { sceneBuffer, indicatorBuffer } from "./buffers.js";

export let sceneBindGroup;
export let objectsBindGroup;

export function setupBindGroups() {
    sceneBindGroup = device.createBindGroup({
        layout: sceneLayout,
        entries: [
            {binding: 0, resource: {buffer: sceneBuffer}}
        ]
    });
    objectsBindGroup = device.createBindGroup({
        layout: objectsLayout,
        entries: [
            {binding: 0, resource: {buffer: indicatorBuffer}}
        ]
    });
}