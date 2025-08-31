struct IndicatorInfo {
    transform: mat4x4f
}

struct Vertex {
    @location(0) pos: vec3f,
    @location(1) color: vec4f
}

struct VsOutput {
    @builtin(position) position: vec4f,
    @location(0) color: vec4f
}

@vertex fn vs(vert: Vertex) -> VsOutput {
    return VsOutput(vert.pos, vert.color);
}

@fragment fn fs(fsIn: VsOutput) -> vec4f {
    return fsIn.color;
}