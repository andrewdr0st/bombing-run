import { device } from "./gpu.js";

export let sampler;
export let textureArray32;

async function loadImage(path) {
    const response = await fetch("textures/" + path);
    const blob = await response.blob();
    return await createImageBitmap(blob);
}

export async function setupTextures() {
    let tileBitmap = await loadImage("grass-tile-l.webp");

    sampler = device.createSampler({
        minFilter: "linear",
        magFilter: "linear"
    });

    textureArray32 = device.createTexture({
        size: [32, 32, 2],
        format: "rgba8unorm",
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
    });

    device.queue.copyExternalImageToTexture({source: tileBitmap}, {texture: textureArray32, origin: {z:0}}, [32, 32]);
    device.queue.copyExternalImageToTexture({source: tileBitmap}, {texture: textureArray32, origin: {z:1}}, [32, 32]);
}