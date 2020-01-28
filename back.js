const fs = require('fs');
const express = require('express');
const cors = require('cors')

// Sanity Scheck
const app = express();
app.use(cors())
app.get('/', function (req, res) {
  res.send('Hello World!')
})

//Fonction pre-recherche sans elastic search
// const Fuse = require('fuse.js');
// const options = {
//     shouldSort: true,
//     matchAllTokens: true,
//     threshold: 0.6,
//     keys: ['filename', 'filepath'],
//     includeScore: true
// };
// const bdd = fs.readFileSync('scan.json');
// const data = JSON.parse(bdd);
// function search(keyword) {
//     const fuse = new Fuse(data, options);
//     const ret = fuse.search(keyword);
//     return ret;
// }

// app.get('/search/:keyword', function (req, res) {
//     console.log("Recherche: '" + req.params.keyword + "'");
//     const ret = search(req.params.keyword);
//     console.log("# de resulats: " + Object.keys(ret).length);
//     res.send(ret);
// })

//Elastic Search => Pre recherche

const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://localhost:9200' })

app.get('/presearch/:keyword', function (req, res) {
  console.log("Pre-recherche: '" + req.params.keyword + "'");
  client.search({
    index: 'scan',
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
    max_score = result.body.hits.max_score;
    const ret = [];
    es_data.forEach(file => {
      ret.push({
        'score': file._score / max_score,
        'item': file._source
      });
    });
    res.send(ret);
    if (err) console.log(err)
  })
})

//Elastic Search => Recherche full texte

app.get('/es/:keyword', function (req, res) {
  console.log("Recherche: '" + req.params.keyword + "'");
  client.search({
    index: 'final',
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
    max_score = result.body.hits.max_score;
    const ret = [];
    es_data.forEach(file => {
      ret.push({
        'score': file._score / max_score,
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

//Demarage de l'API Back
app.listen(3000, function () {
  console.log('Backend API listening on port 3000!')
})