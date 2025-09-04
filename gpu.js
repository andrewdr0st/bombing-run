let adapter;
export let device;
export let presentationFormat;
const canvas = document.getElementById("canvas");
export const webgpuCtx = canvas.getContext("webgpu");
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
    renderTexture = webgpuCtx.getCurrentTexture();
    depthTexture = device.createTexture({
        size: [renderTexture.width, renderTexture.height],
        format: "depth24plus",
        usage: GPUTextureUsage.RENDER_ATTACHMENT
    });
    return true;
}