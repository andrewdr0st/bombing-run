struct Scene {
    viewProjection: mat4x4f
}

struct ObjectInfo {
    transform: mat4x4f
}

struct Vertex {
    @location(0) pos: vec3f,
    @location(1) uv: vec2f,
    @location(2) normal: vec3f
}

struct VsOutput {
    @builtin(position) position: vec4f,
    @location(0) uv: vec2f,
    @location(1) normal: vec3f
}

@group(0) @binding(0) var<uniform> scene: Scene;
@group(1) @binding(1) var<uniform> objectData: array<ObjectInfo, 18>;
@group(2) @binding(0) var samp: sampler;
@group(2) @binding(1) var textures32: texture_2d_array<f32>;

@vertex fn vs(vert: Vertex, @builtin(instance_index) inst: u32) -> VsOutput {
    let pos = scene.viewProjection * objectData[inst].transform * vec4f(vert.pos, 1);
    return VsOutput(pos, vert.uv, vert.normal);
}

@fragment fn fs(fsIn: VsOutput) -> @location(0) vec4f {
    let albedo = textureSample(textures32, samp, fsIn.uv, 0);
    let corrected = pow(albedo, vec4f(1.0 / 2.2));
    return vec4f(corrected);
}