// A biztonsági kulcs.
const crypto = require('crypto')

function generateSecretKey(){
    return crypto.randomBytes(128).toString('hex');
}
const secretKey = generateSecretKey();
console.log(secretKey);

module.exports={
    secret: secretKey
}