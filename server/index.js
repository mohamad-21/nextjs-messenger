const WebSocket = require("ws");
const url = require("url");
const wss = new WebSocket.Server({ port: 8080, clientTracking: true });

const clients = new Map();

wss.on("connection", (ws, req) => {
  let userId = null;
  const params = url.parse(req.url, true).query;
  if (params.userId) {
    userId = parseInt(params.userId);
    clients.set(userId, ws);
    console.log(`user ${userId} has been connected`);
    console.log(`all connections: `, [...clients.keys()]);
  }

  ws.send(JSON.stringify({
    type: "connection_established",
  }))

  ws.addEventListener("message", data => {

    data = JSON.parse(data.data);

    if (data.type === "connection" && data.id) {
      clients.forEach(client => {
        client.send(JSON.stringify(data));
      })
    }

    if (data.type === "send_message" && data.from && data.to) {
      const [receiver, sender] = [clients.get(data.to), clients.get(data.from)];
      const privateClients = [sender, receiver];
      console.log(data);


      privateClients.forEach(client => {
        if (client) {
          client.send(JSON.stringify({
            type: "trigger_messages",
          }));
        }
      })
    }

    if (data.type === "delete_message" && data.from && data.to) {
      const [receiver, sender] = [clients.get(data.to), clients.get(data.from)];
      const privateClients = [sender, receiver];
      privateClients.forEach(client => {
        if (client) {
          client.send(JSON.stringify({
            type: "trigger_messages",
          }));
        }
      })
    }

    if (data.type === "trigger_messages") {
      const clientIds = [...data.clients];
      clientIds.forEach(id => {
        const client = clients.get(id)
        if (client) {
          client.send(JSON.stringify({
            type: "trigger_messages",
          }));
        }
      })
    }

  });

  ws.addEventListener("close", () => {
    if (userId) {
      clients.forEach(client => {
        client.send(JSON.stringify({
          type: "connection",
          id: userId,
          connected: false
        }))
      })

      clients.delete(userId);
      console.log(`user ${userId} has been disconected.`)
    }
  });

});
