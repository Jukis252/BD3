const xsHDBConn = require("@sap/hdbext");
const xsenv = require("@sap/xsenv");

let hanaOptions = xsenv.filterCFServices({
    plan: 'hdi-shared',
    label: "hana",
})[0].credentials;


// let hanaOptions = xsenv.getServices({credentials: {tag: 'hana'}}) && xsenv.getServices({credentials: {tag: 'hana'}}).credentials;

hanaOptions = {'hana': hanaOptions};
hanaOptions.hana.pooling = true;

module.exports = {
    insertMiddleware: {
        beforeRequestHandler: [
            {path: "/", handler: xsHDBConn.middleware(hanaOptions.hana)},
        ]
    }
}