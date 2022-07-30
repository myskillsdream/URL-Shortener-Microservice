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
// app.get('/api/hello', function(req, res) {
//   res.json({ greeting: 'hello API' });
// });

  const links = [];
  let id = 0;

app.post('/api/shorturl', (req, res) => {

      let {url} = req.body;

      const host = url.replace(/^https?:\/\//, '');

      dns.lookup(host, (err) => {

        if(err){
          return  res.json({ 
            
            error: 'invalid URL' 
          
          });
        }else{
          id++;
          const link = {
            original_url: url,
            short_url: id
          }

            links.push(link);

            return res.json(link);

        }
}); 
});

app.get('/api/shorturl/:short_url', (req, res) => {

  const { short_url } = req.params;

  const link = links.find(lnk => `${lnk.short_url}` === id);

    if(link){
      return  res.redirect(link.original_url);
    }else{

      return res.json({
        error: "no short url"
      });


    }
}); 


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
