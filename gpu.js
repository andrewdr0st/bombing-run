import { canvas, webgpuCtx } from "./canvasManager.js";

let adapter;
export let device;
export let presentationFormat;
export let renderTexture;
export let depthTexture;

export async function loadWGSLShader(f) {
    let response = await fetch("shaders/" + f);
    return await response.text();
}

export async function loadImage(path) {
    const response = await fetch("textures/" + path);
    const blob = await response.blob();
    return await createImageBitmap(blob);
}

export async function setupGPUDevice() {
    adapter = await navigator.gpu?.requestAdapter();
    if (!adapter) {
        alert("Device does not support WebGPU");
        return false;
    }
    device = await adapter?.requestDevice();
    if (!device) {
        alert("Browser does not support WebGPU");
        return false;
    }
    presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    webgpuCtx.configure({
        device,
        format: presentationFormat,
        alphaMode: "premultiplied"
    });
    depthTexture = device.createTexture({
        size: [canvas.width, canvas.height],
        format: "depth24plus",
        usage: GPUTextureUsage.RENDER_ATTACHMENT
    });
    return true;
}

export function updateRenderTexture() {
    renderTexture = webgpuCtx.getCurrentTexture();
}