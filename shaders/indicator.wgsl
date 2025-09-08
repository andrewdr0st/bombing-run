struct IndicatorInfo {
    transform: mat4x4f
}

struct Scene {
    viewProjection: mat4x4f
}

struct Vertex {
    @location(0) pos: vec3f,
    @location(1) color: vec4f
}

struct VsOutput {
    @builtin(position) position: vec4f,
    @location(0) color: vec4f
}

@group(0) @binding(0) var<uniform> scene: Scene;
@group(1) @binding(0) var<uniform> indicatorData: array<IndicatorInfo, 12>;

@vertex fn vs(vert: Vertex, @builtin(instance_index) inst: u32) -> VsOutput {
    let pos = scene.viewProjection * indicatorData[inst].transform * vec4f(vert.pos, 1);
    return VsOutput(pos, select(vec4f(1, 0.5, 0, 1), vec4f(0, 1, 1, 1), inst > 0));
}

@fragment fn fs(fsIn: VsOutput) -> @location(0) vec4f {
    return vec4f(fsIn.color);
}