export let vertexList = [];
export let indexList = [];

export class Mesh {
    constructor(vStart, vCount, iStart, iCount) {
        this.vStar = vStart;
        this.vertexCount = vCount;
        this.iStart = iStart;
        this.indexCount = iCount;
    }
}

export class MeshLoader {
    constructor() {
        this.positions = [];
        this.textureCoords = [];
        this.normals = [];
        this.vertices = [];
        this.vertexCount = 0;
        this.indices = [];
        this.indexCount = 0;
        this.vertexStart = 0;
        this.indexStart = 0;
    }

    addToList() {
        this.vertexStart = vertexList.length;
        vertexList = vertexList.concat(this.vertices);
        this.indexStart = indexList.length;
        indexList = indexList.concat(this.indices);
        console.log(vertexList);
        console.log(indexList);
    }

    getMesh() {
        return new Mesh(this.vertexStart, this.vertexCount, this.indexStart, this.indexCount);
    }

    async parseObjFile(filename) {
        const response = await fetch("objects/" + filename);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.text();
        const lines = data.split("\n");
        const vertexMap = new Map();

        for (let i = 0; i < lines.length; i++) {
            let parts = lines[i].trim().split(/\s+/);
            let type = parts[0];

            if (type == "v") {
                this.positions.push(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]));
            } else if (type == "vt") {
                this.textureCoords.push(parseFloat(parts[1]), parseFloat(parts[2]));
            } else if (type == "vn") {
                this.normals.push(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]));
            } else if (type == "f") {
                for (let j = 1; j <= 3; j++) {
                    let s = parts[j];
                    let idx = vertexMap.get(s);
                    if (idx == undefined) {
                        let v = parts[j].split("/");
                        let p = (parseInt(v[0]) - 1) * 3;
                        this.vertices.push(this.positions[p], this.positions[p + 1], this.positions[p + 2]);
                        if (v.length > 1) {
                            let t = (parseInt(v[1]) - 1) * 2;
                            this.vertices.push(this.textureCoords[t], this.textureCoords[t + 1]);
                            let n = (parseInt(v[2]) - 1) * 3;
                            this.vertices.push(this.normals[n], this.normals[n + 1], this.normals[n + 2]);
                        } else {
                            this.vertices.push(0);
                        }
                        idx = this.vertexCount;
                        vertexMap.set(s, idx);
                        this.vertexCount++;
                    }
                    this.indices.push(idx);
                    this.indexCount++;
                }
            }
        }
    }
}