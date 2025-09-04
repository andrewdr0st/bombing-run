import { device, loadWGSLShader, presentationFormat, renderTexture, depthTexture } from "./gpu.js";

let sceneLayout;
let renderLayout;

export const MainVertexDescriptor = {
    size: 32,
    attributes: [
        { shaderLocation: 0, offset: 0, format: "float32x3" },
        { shaderLocation: 1, offset: 12, format: "float32x2" },
        { shaderLocation: 2, offset: 20, format: "float32x3" }
    ]
}

export const IndicatorVertexDescriptor = {
    size: 16,
    attributes: [
        { shaderLocation: 0, offset: 0, format: "float32x3" },
        { shaderLocation: 1, offset: 12, format: "unorm8x4" }
    ]
}

export function setupRenderLayout() {
    sceneLayout = device.createBindGroupLayout({
        entries: [
            {
                binding: 0,
                visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                buffer: { type: "uniform" }
            }
        ]
    });
    renderLayout = device.createPipelineLayout({
        bindGroupLayouts: [
            sceneLayout
        ]
    });
}

export class RenderPipeline {
    constructor(shader, vertexDescriptor) {
        this.shader = shader;
        this.vertexDescriptor = vertexDescriptor;
    }

    async build() {
        let shaderCode = await loadWGSLShader(this.shader);
        let renderModule = device.createShaderModule({code: shaderCode});
        this.pipeline = device.createRenderPipeline({
            layout: renderLayout,
            vertex: {
                entryPoint: "vs",
                buffers: [{
                    arrayStride: this.vertexDescriptor.size,
                    attributes: this.vertexDescriptor.attributes
                }],
                module: renderModule
            },
            fragment: {
                entryPoint: "fs",
                module: renderModule,
                targets: [{ format: presentationFormat }]
            },
            primitive: {
                cullMode: "back"
            },
            depthStencil: {
                depthWriteEnabled: true,
                depthCompare: 'less',
                format: 'depth24plus'
            }
        });
        this.descriptor = {
            colorAttachments: [{
                view: renderTexture.createView(),
                clearValue: [0.25, 0.25, 0.25, 1],
                loadOp: "clear",
                storeOp: "store"
            }],
            depthStencilAttachment: {
                view: depthTexture.createView(),
                depthClearValue: 1.0,
                depthLoadOp: "clear",
                depthStoreOp: "store"
            }
        }
    }

    run() {

    }
}