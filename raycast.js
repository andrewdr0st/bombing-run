import { camera } from "./camera.js";
import { setTarget } from "./gameState.js";
const { vec3, vec4, mat4 } = wgpuMatrix;

const aabbList = [];

export function performRaycast(x, y) {
    const rayStart = vec4.transformMat4([x, y, -1, 1], camera.viewProjectionInverse);
    const rayEnd = vec4.transformMat4([x, y, 1, 1], camera.viewProjectionInverse);

    const orig = vec3.fromValues(rayStart[0], rayStart[1], rayStart[2]);
    const dir = vec3.normalize(vec3.sub(vec3.fromValues(rayEnd[0], rayEnd[1], rayEnd[2]), rayStart));
    let id = traverseAABBs(orig, dir);
    setTarget(id);
}

class AABB {
    constructor(a, b, id, child1=null, child2=null) {
        this.a = a;
        this.b = b;
        this.id = id;
        this.child1 = child1;
        this.child2 = child2;
        this.isLeaf = child1 == null;
    }

    intersect(orig, invDir) {
        let t1 = vec3.multiply(vec3.sub(this.a, orig), invDir);
        let t2 = vec3.multiply(vec3.sub(this.b, orig), invDir);
        let tmin = Math.max(Math.min(t1[0], t2[0]), Math.min(t1[1], t2[1]), Math.min(t1[2], t2[2]));
        let tmax = Math.min(Math.max(t1[0], t2[0]), Math.max(t1[1], t2[1]), Math.max(t1[2], t2[2]));
        return tmax >= tmin ? tmin : 10000;
    }
}

function traverseAABBs(orig, dir) {
    let t = 1000;
    let id = -1;
    const invDir = vec3.div([1.0, 1.0, 1.0], dir);
    for (let i = 0; i < aabbList.length; i++) {
        let aabb = aabbList[i];
        let newt = aabb.intersect(orig, invDir);
        if (newt < t) {
            t = newt;
            id = aabb.id;
        }
    }
    return id;
}

export function createBoxes() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let x = (i - 1) * 2;
            let z = (j - 1) * 2;
            let a = vec3.fromValues(x - 4, -0.5, z - 4);
            let b = vec3.fromValues(x - 6, 0.5, z - 6);
            aabbList.push(new AABB(a, b, i * 3 + j));
        }
    }
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let x = (i - 1) * 2;
            let z = (j - 1) * 2;
            let a = vec3.fromValues(4 + x, -0.5, 4 + z);
            let b = vec3.fromValues(6 + x, 0.5, 6 + z);
            aabbList.push(new AABB(a, b, i * 3 + j + 9));
        }
    }
}