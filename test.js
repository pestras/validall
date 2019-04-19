"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
let schema = {
    $props: {
        privileges: {
            $include: [
                "WRITE_STRATEGY"
            ]
        },
        user: {
            $props: {
                accountId: { $equals: "$payload.accountId" }
            }
        }
    }
};
let data = {
    "user": {
        "_id": "5c8156cd612d725be08a4cd3",
        "email": "amrmrd111spcl@hotmail.com",
        "password": "rnqtl77a1a7PGOKxVsiU8DX2lj2DtnzxgODwKUkoPfgeO+ZI4wasOgDSlq7Z3Hw3GdPoJTLgq0zRs4O3uq8tVw==",
        "active": true,
        "salt": "LIqcH1bY9XyCGimMb0RYJA==",
        "updatedAt": 1552242448356,
        "createdAt": 1551980237446,
        "accountId": "5c8156cd612d725be08a4cd0",
        "orgUnitId": "5c8156cd612d725be08a4cd2",
        "updatedBy": "5c8156cd612d725be08a4cd3"
    },
    "groups": [
        "superAdmin"
    ],
    "service": "strategy",
    "capability": "create",
    "payload": {
        "accountId": "5c8156cd612d725be08a4cd0",
        "title": "Test",
        "description": "Test strategy",
        "startDate": 1553018975384,
        "endDate": 1584565200000
    },
    "privileges": [
        "WRITE_ADMIN",
        "WRITE_USER",
        "WRITE_ORG_UNIT",
        "WRITE_STRATEGY",
        "WRITE_GOAL",
        "WRITE_PROJECT",
        "WRITE_INDICATOR",
        "WRITE_PARTNER",
        "READ"
    ]
};
let validator = new index_1.Validall({ id: null, schema: schema });
