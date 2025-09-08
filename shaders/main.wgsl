struct Scene {
    viewProjection: mat4x4f
}

struct Vertex {
    @location(0) pos: vec3f,
    @location(1) uv: vec2f,
    @location(2) normal: vec3f
}

struct VsOutput {
    @builtin(position) position: vec4f,
    @location(0) uv: vec2f,
    @loaction(1) normal: vec3f
}

@vertex fn vs(vert: Vertex, @builtin(instance_index) inst: u32) -> VsOutput {
    return vec4f(vert.pos, 1);
}

@fragment fn fs(fsIn: VsOutput) -> @location(0) vec4f {
    return vec4f(1, 0, 0, 1);
}