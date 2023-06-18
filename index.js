const express = require("express");
const AWS = require("aws-sdk");
const fs = require("fs");
require("dotenv").config();

const app = express();
const port = 3000;

const keyPairId = process.env.KEY_PAIR_ID;
const privateKeyPath = "./private_key.pem";

const privateKey = fs.readFileSync(privateKeyPath);

const cloudFrontSigner = new AWS.CloudFront.Signer(keyPairId, privateKey);
const timeInMinutes = 5;

app.get("/getsignedurl", (req, res) => {
  // Generate signed URL with 5-minute expiry
  const signedUrl = cloudFrontSigner.getSignedUrl({
    // url: `${cloudFrontDistributionUrl}/${imageFileName}`,
    url: "https://d1hif2zcmltexh.cloudfront.net/chip.jpg",
    expires: Math.floor((Date.now() + timeInMinutes * 60 * 1000) / 1000),
    keypairId: keyPairId,
    privateKeyString: privateKey,
  });

  if (signedUrl) {
    console.log("Signed URL:", signedUrl);
    res.send(signedUrl);
  } else {
    console.error("Error generating signed URL");
    res.status(500).send("Error generating signed URL");
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});
