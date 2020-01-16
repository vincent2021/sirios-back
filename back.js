const fs = require('fs');
const express = require('express');
const cors = require('cors')
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
app.use(cors())
app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/search/:keyword', function (req, res) {
    console.log("Recherche: '" + req.params.keyword + "'");
    const ret = search(req.params.keyword);
    console.log("# de resulats: " + Object.keys(ret).length);
    res.send(ret);
})

// Route Elastic Search

const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://localhost:9200' })

app.get('/presearch/:keyword', function (req, res) {
  
  console.log("Pre-recherche: '" + req.params.keyword + "'");
  client.search({
    index: 'scan2',
    body: {
      "query": {
          "match": { 
            "filepath": {
              "query": req.params.keyword,
              "fuzziness": 1
            }
          } 
      }
  }}, (err, result) => {
    es_data = result.body.hits.hits;
    console.log(es_data);
    const ret = [];
    es_data.forEach(file => {
      ret.push({
        'score': file._score,
        'item': file._source
      });
    });
    res.send(ret);
    if (err) console.log(err)
  })
})


app.get('/es/:keyword', function (req, res) {
  console.log("Recherche: '" + req.params.keyword + "'");
  client.search({
    index: 'test2',
    body: {
      "query": {
        "multi_match": {
          "query": req.params.keyword,
          "fields": [
            "data.*"
            ]
          }
        },
        "highlight" : {
            "fields" : {
                "data.*" : {}
            }
        }
      }
    }, (err, result) => {
    es_data = result.body.hits.hits;
    const ret = [];
    es_data.forEach(file => {
      ret.push({
        'score': file._score,
        'title': file._source.title,
        'author': file._source.author,
        'encrypted': file._source.isClassified,
        'filepath': file._source.filepath,
        'data': file.highlight
      });
    });
    res.send(ret);
    console.log("# de resulats: " + Object.keys(ret).length);
    if (err) console.log(err)
  })
})

app.listen(3000, function () {
  console.log('Backend API listening on port 3000!')
})