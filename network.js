let peer;
let isHost;
let foundPlayer;
let connection;

function setupConnection() {
    connection.on("open", () => {
        console.log("open");
    });

    connection.on("data", (d) => {
        console.log(d);
    });

    connection.on("close", () => {
        console.log("closed");
    });
}

function setupErrorHandling() {
    peer.on("error", (e) => {
        console.log(e.type);
        if (e.type = "unavailable-id") {
            console.log("Room name is unavailiable");
        }
    });
}

export function createRoom(roomName) {
    peer = new Peer(roomName);
    setupErrorHandling();

    isHost = true;
    foundPlayer = false;

    peer.on("connection", (c) => {
        if (!foundPlayer) {
            connection = c;
            foundPlayer = true;
            setupConnection();
        } else {
            c.on("open", () => {c.close()});
        }
    });
}

export function joinRoom(roomName) {
    peer = new Peer();
    setupErrorHandling();

    peer.on("open", () => {
        connection = peer.connect(roomName);
        setupConnection();
    });
}

export function sendData(data) {
    if (!peer || !connection) {
        return false;
    }
    if (!connection.open) {
        return false;
    }
    connection.send(data);
    return true;
}