"use strict";

//const backedAccessProvider = require(`${global.__base}/extensions/lib/backendAccessProvider`);
const lrep = require(`${global.__base}/extensions/lib/lrep`);

// function authorizeBackendAccess(req, res, next) {
//     req.headers = Object.assign(req.headers, backedAccessProvider.getAccessHeaders());
//     next();
//   }

module.exports = {
    insertMiddleware: {
        beforeRequestHandler: [
            {path: "/sap/bc/lrep", handler: lrep()},
            //{path: "/ui", handler: authorizeBackendAccess}
        ]
    }
}
