"use strict";

var _require = require("./config"),
    host = _require.host,
    port = _require.port;

var app = require("./server");

app.listen(port, console.log("The app is running on http://".concat(host, ":").concat(port, ".")));