const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect("mongodb+srv://imranovazer:20023838Aze@blog.6ft9u8s.mongodb.net/SocketDB", () => {
  console.log('connected to mongodb')
})
