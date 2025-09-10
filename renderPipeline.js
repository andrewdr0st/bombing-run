import { device, loadWGSLShader, presentationFormat, renderTexture, depthTexture } from "./gpu.js";
import { renderLayout } from "./layouts.js";
import { vertexBuffer, indexBuffer, smallVertexBuffer, smallIndexBuffer } from "./buffers.js";
import { sceneBindGroup, objectsBindGroup, texturesBindGroup } from "./bindGroups.js";

export let mainPipeline;
export let indicatorPipeline;

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

export async function createPipelines() {
    indicatorPipeline = new RenderPipeline("indicator.wgsl", IndicatorVertexDescriptor, true);
    mainPipeline = new RenderPipeline("main.wgsl", MainVertexDescriptor);
    await Promise.all([indicatorPipeline.build(), mainPipeline.build()]);
}

export class RenderPipeline {
    constructor(shader, vertexDescriptor, small=false) {
        this.shader = shader;
        this.vertexDescriptor = vertexDescriptor;
        this.small = small;
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
                clearValue: [0.1, 0.1, 0.15, 1],
                loadOp: this.small ? "clear" : "load",
                storeOp: "store"
            }],
            depthStencilAttachment: {
                view: depthTexture.createView(),
                depthClearValue: 1.0,
                depthLoadOp: this.small ? "clear" : "load",
                depthStoreOp: "store"
            }
        }
    }

    run(encoder, mesh, instanceCount) {
        this.descriptor.colorAttachments[0].view = renderTexture.createView();
        const pass = encoder.beginRenderPass(this.descriptor);
        pass.setPipeline(this.pipeline);
        if (this.small) {
            pass.setVertexBuffer(0, smallVertexBuffer);
            pass.setIndexBuffer(smallIndexBuffer, "uint32");
        } else {
            pass.setVertexBuffer(0, vertexBuffer);
            pass.setIndexBuffer(indexBuffer, "uint32");
        }
        pass.setBindGroup(0, sceneBindGroup);
        pass.setBindGroup(1, objectsBindGroup);
        pass.setBindGroup(2, texturesBindGroup);
        pass.drawIndexed(mesh.indexCount, instanceCount, mesh.iStart, mesh.vStart);
        pass.end();
    }
}