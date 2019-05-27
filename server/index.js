const { host, port } = require("./config");
const app = require("./server");

app.listen(port, console.log(`The app is running on http://${host}:${port}.`));
