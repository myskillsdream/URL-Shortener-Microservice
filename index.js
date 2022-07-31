// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const app = express();
// const bodyParser = require('body-parser');

// const dns = require('dns');

// // Basic Configuration
// const port = process.env.PORT || 3000;

// app.use(cors());

// app.use(bodyParser.urlencoded({extended: false}));
// app.use('/public', express.static(`${process.cwd()}/public`));

// app.get('/', function(req, res){
//   res.sendFile(process.cwd() + '/views/index.html');
// });

// // Your first API endpoint
// app.get('/api/hello', function(req, res) {
//   res.json({ greeting: 'hello API' });
// });

//   const links = [];
//   let short_url = 0;

// app.post('/api/shorturl', (req, res) => {

//       let {url} = req.body;

//       const host = url.replace(/^https?:\/\//, '');

//       dns.lookup(host, (err) => {

//         if(err || host === ""){
//           return  res.json({ 
            
//             error: 'invalid URL' 
          
//           });
//         }else{
//           short_url++;
//           const link = {
//             original_url: url,
//             short_url: short_url
//           }

//             console.log(host)

//             links.push(link);

//             return res.json(link);

//         }
// }); 
// });

// app.get('/api/shorturl/:short_url', (req, res) => {

//   const { short_url } = req.params;

//   const link = links.find(lnk => `${lnk.short_url}` === short_url);

//     if(link){
//       return  res.redirect(link.original_url);
//     }else{

//       return res.json({
//         error: "no short url"
//       });


//     }
// }); 


// app.listen(port, function() {
//   console.log(`Listening on port ${port}`);
// });


'use strict';

var express = require('express');
var mongo = require('mongodb');
const mongoose = require('mongoose');

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;


require('mongodb');

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});


/* Database Connection */

// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
// mongoose.set('useUnifiedTopology', true);

let uri = 'mongodb+srv://myskillsdream:' + process.env.PW + '@cluster0.kuhcl.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('Connect to MongoDB..'))
.catch(err => console.error('Could not connect to MongoDB..', err));


let urlSchema = new mongoose.Schema({
  original : {type: String, required: true},
  short: Number
})

let Url = mongoose.model('Url', urlSchema)

let bodyParser = require('body-parser')
let responseObject = {}
app.post('/api/shorturl', bodyParser.urlencoded({ extended: false }) , (request, response) => {
  let inputUrl = request.body['url']
  
  let urlRegex = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi)
  
  if(!inputUrl.match(urlRegex)){
    response.json({error: 'Invalid URL'})
    return
  }
    
  responseObject['original_url'] = inputUrl
  
  let inputShort = 1
  
  Url.findOne({})
        .sort({short: 'desc'})
        .exec((error, result) => {
          if(!error && result != undefined){
            inputShort = result.short + 1
          }
          if(!error){
            Url.findOneAndUpdate(
              {original: inputUrl},
              {original: inputUrl, short: inputShort},
              {new: true, upsert: true },
              (error, savedUrl)=> {
                if(!error){
                  responseObject['short_url'] = savedUrl.short
                  response.json(responseObject)
                }
              }
            )
          }
  })
  
})

app.get('/api/shorturl/:short_url', (request, response) => {
  let input = request.params.short_url
  
  Url.findOne({short: input}, (error, result) => {
    if(!error && result != undefined){
      response.redirect(result.original)
    }else{
      response.json('URL not Found')
    }
  })
})