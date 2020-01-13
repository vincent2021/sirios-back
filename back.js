const fs = require('fs');
const express = require('express');
// Connexion MongoDB
// const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true, useUnifiedTopology: true });

// const db = mongoose.connection; 
// db.on('error', console.error.bind(console, 'Erreur lors de la connexion')); 
// db.once('open', function (){
//     console.log("Connexion à la base OK"); 
// }); 

const Fuse = require('fuse.js');
const options = {
    shouldSort: true,
    matchAllTokens: true,
    threshold: 0.6,
    keys: ['filename', 'filepath'],
    includeScore: true
};
const bdd = fs.readFileSync('scan.json');
const data = JSON.parse(bdd);
function search(keyword) {
    const fuse = new Fuse(data, options);
    const ret = fuse.search(keyword);
    return ret;
}

// Partie Serveur API
const app = express();

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/search/:keyword', function (req, res) {
    console.log("Recherche: '" + req.params.keyword + "'");
    const ret = search(req.params.keyword);
    console.log("# de resulats: " + Object.keys(ret).length);
    res.send(ret);
})

app.listen(3000, function () {
  console.log('Backend API listening on port 3000!')
})