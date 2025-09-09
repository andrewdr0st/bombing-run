import { device } from "./gpu.js";
import { sceneLayout, objectsLayout, texturesLayout } from "./layouts.js";
import { sceneBuffer, indicatorBuffer, tileBuffer } from "./buffers.js";
import { sampler, textureArray32 } from "./textures.js";

export let sceneBindGroup;
export let objectsBindGroup;
export let texturesBindGroup;

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
            {binding: 0, resource: {buffer: indicatorBuffer}},
            {binding: 1, resource: {buffer: tileBuffer}}
        ]
    });
    texturesBindGroup = device.createBindGroup({
        layout: texturesLayout,
        entries: [
            {binding: 0, resource: sampler},
            {binding: 1, resource: textureArray32.createView()}
        ]
    })
}