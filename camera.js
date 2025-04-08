class Camera {
    constructor(aspectRatio) {
        this.position = [0, 0, 0];
        this.lookTo = [0, 0, -1];
        this.lookAt = [0, 0, 0];
        this.up = [0, 1, 0];
        this.aspectRatio = aspectRatio;
        this.forward;
        this.right;
        this.minCorner = [-10, -10, -10];
        this.maxCorner = [10, 10, 10];
        this.viewMatrix;
        this.viewProjectionMatrix;
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
    }
}