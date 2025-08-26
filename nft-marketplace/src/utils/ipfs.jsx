import { create as ipfsHttpClient } from "ipfs-http-client";



//todo Have to insert data
const projectId = "Infura id";
const projectSecret = "Infura project secret";
const auth = "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const client = ipfsHttpClient ({
    host: "ipfs.infura.io",
    port: 5001,
    protocols: "https",
    header: {
        authorization: auth,
    },

});

export default client;