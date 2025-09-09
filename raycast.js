import { camera } from "./camera.js";
const { vec3, vec4, mat4 } = wgpuMatrix;

export function performRaycast(x, y) {
    const rayStart = vec4.transformMat4([x, y, -1, 1], camera.viewProjectionInverse);
    const rayEnd = vec4.transformMat4([x, y, 1, 1], camera.viewProjectionInverse);

    const orig = vec3.fromValues(rayStart[0], rayStart[1], rayStart[2]);
    const dir = vec3.normalize(vec3.sub(vec3.fromValues(rayEnd[0], rayEnd[1], rayEnd[2]), rayStart));

    let invDir = vec3.div([1.0, 1.0, 1.0], dir);
    let a = vec3.fromValues(4, -0.5, 4);
    let b = vec3.fromValues(6, 0.5, 6);
    let t1 = vec3.multiply(vec3.sub(a, orig), invDir);
    let t2 = vec3.multiply(vec3.sub(b, orig), invDir);
    let tmin = Math.max(Math.min(t1[0], t2[0]), Math.min(t1[1], t2[1]), Math.min(t1[2], t2[2]));
    let tmax = Math.min(Math.max(t1[0], t2[0]), Math.max(t1[1], t2[1]), Math.max(t1[2], t2[2]));
    console.log(tmax >= tmin);
}