import { device } from "./gpu.js";
import { aspectRatio } from "./canvasManager.js";
import { sceneBuffer } from "./buffers.js";
const { vec3, mat4 } = wgpuMatrix;

export let camera;

export function setupCamera() {
    camera = new Camera(aspectRatio);
    camera.position = [-3, 5, 3];
    camera.lookTo = [0.75, -1, -0.75];
    camera.updateLookAt();
    camera.writeData();
}

class Camera {
    constructor(aspectRatio) {
        this.position = [0, 0, 0];
        this.lookTo = [0, 0, -1];
        this.lookAt = [0, 0, 0];
        this.up = [0, 1, 0];
        this.aspectRatio = aspectRatio;
        this.forward;
        this.right;
        this.minCorner = [-12.5, -8, 0];
        this.maxCorner = [12.5, 8, 20];
        this.viewMatrix;
        this.viewProjectionMatrix;
        this.viewProjectionInverse;
        this.updateLookAt();
    }

    updateLookAt() {
        this.lookTo = vec3.normalize(this.lookTo);
        this.lookAt = vec3.add(this.position, this.lookTo);
        this.right = vec3.normalize(vec3.cross(this.lookTo, this.up));
        this.forward = vec3.normalize(vec3.cross(this.up, this.right));
        this.viewMatrix = mat4.lookAt(this.position, this.lookAt, this.up);
        const projection = mat4.ortho(this.minCorner[0], this.maxCorner[0], this.minCorner[1], this.maxCorner[1], this.minCorner[2], this.maxCorner[2]);
        this.viewProjectionMatrix = mat4.multiply(projection, this.viewMatrix);
        this.viewProjectionInverse = mat4.inverse(this.viewProjectionMatrix);
    }

    writeData() {
        device.queue.writeBuffer(sceneBuffer, 0, this.viewProjectionMatrix);
    }
}