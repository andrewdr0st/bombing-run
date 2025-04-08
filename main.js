let lastFrameTime = 0;

async function init() {
    let webgpuSupport = await setupGPUDevice();
    if (!webgpuSupport) {
        return;
    }
    requestAnimationFrame(main);
}

function main(currentTime) {
    const deltaTime = (currentTime - lastFrameTime) * 0.001;
    lastFrameTime = currentTime;

    requestAnimationFrame(main);
}