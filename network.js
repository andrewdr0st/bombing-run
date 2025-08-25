
export function establishConnection() {
    let peer = new Peer();

    peer.on("open", (id) => {
        console.log(id);
    });

    peer.on("connection", (c) => {
        console.log(c);

        c.on("data", (d) => {
            console.log(d);
        });
    });
}