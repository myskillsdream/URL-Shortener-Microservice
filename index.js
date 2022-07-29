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

  const links = [];
  let id = 0;

app.post('/api/shorturl', (req, res) => {

      let {url} = req.body;

      const removeHTTPSurl = url.replace(/^https?:\/\//, '');

      dns.lookup(removeHTTPSurl,(err) => {

        if(err){
          return  res.json({ 
            
            error: 'invalid URL' 
          
          });
        }else{
          id++;
          const link = {
            original_url: url,
            short_url: `${id}`
          };

          links.push(link);
          console.log(links);

          return res.json(link);


        }
}); 
});

app.post('/api/shorturl/:id', (req, res) => {

  let { id } = req.params;

  console.log(id)

  const link = links.find(lnk => lnk.shortenedUrl === id);

    if(link){
      return  res.redirect(link.original_url);
    }else{

      return res.json({
        error: "no shortened url"
      });


    }
}); 


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
