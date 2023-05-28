"use strict";
require("@sap/xsenv").loadEnv();

process.env.sapui5url = process.env.sapui5url || "https://sapui5.hana.ondemand.com/1.111.0";

// const __dirname = process.cwd();

global.__base = `${process.cwd()}`;

const app = require("@sap/approuter")();

app.start({
    extensions: [
        //require("./extensions/db"),
        require("./extensions/backendAccess"),
    ]
});