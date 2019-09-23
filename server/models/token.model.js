const mongoose = require("mongoose");
const TokenSchema = new mongoose.Schema({
    email: { type: String, required: true },
    created_at: { type: Date, default: Date.now() },
    key: { type: String, required: true }
});

module.exports = mongoose.model("Token", TokenSchema, "tokens");
