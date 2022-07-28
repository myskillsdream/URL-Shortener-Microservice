require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {

      let {url} = req.body;

      url = url.replace(/^https?:\/\//, "");

      dns.lookup(url,(err, address, family) => {

        console.log("err", err);
        console.log("address", address);
        console.log("family", family);

        if(err){
          return  res.json({ 
            
            error: 'invalid URL' 
          
          });
        }
}); 
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
