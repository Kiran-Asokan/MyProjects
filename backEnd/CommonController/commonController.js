const crypto = require("crypto");
const jwt = require('jsonwebtoken')
const Users = require('../DAL/Schemas/UserSchema')

const commonController = {
    encrypt: async function(message, Key){
        try {
            const key = crypto.scryptSync(Key, "salt", 24); //Create key
            const iv = Buffer.alloc(16, 0);
            // Generate different ciphertext everytime
            const cipher = crypto.createCipheriv('aes-192-cbc', key, iv);
            let encrypted =
              cipher.update(message, "utf8", "hex") + cipher.final("hex"); // Encrypted text
            //Deciphered textconsole.log(decrypted);
            return encrypted;
          } catch (err) {
            console.log({ APIError: err });
          }
    },
    decrypt: async function (message, Key) {
        try {
          const key = crypto.scryptSync(Key, "salt", 24);
          const iv = Buffer.alloc(16, 0);
          const decipher = crypto.createDecipheriv('aes-192-cbc', key, iv);
          let decrypted =
            decipher.update(message, "hex", "utf8") + decipher.final("utf8");
    
          return decrypted;
        } catch (err) {
          console.log(err);
          return { APIError: err };
        }
    },
    createToken: async function (user){
        try {
            const payload = {
                userId: user.id,
                email: user.email
            }
            const key = 'chatapp_secretKey'
            const token = jwt.sign(payload, key, {expiresIn: 84680})
            if(token){
                await Users.updateOne({_id: user.id}, {
                    $set: {token}
                })
                user.save();
                return {user, token}
            }
            

            
        } catch (error) {
            console.log(error);
            return { APIError: error };
        }
        
    }
}

module.exports = commonController