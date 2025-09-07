export const canvas = document.getElementById("canvas");
export const webgpuCtx = canvas.getContext("webgpu");
export let aspectRatio = 1;

export function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    aspectRatio = canvas.width / canvas.height;
}