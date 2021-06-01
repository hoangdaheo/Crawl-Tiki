const express = require('express');
const https =  require('https');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
app.use(bodyParser.urlencoded({ extended:true }));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.post("/sendUrl", (request, response) => {
    let BODY = request.body.url;
    let urlKey = BODY.split('/')[3];
    let c =  BODY.split('/')[4].replace("c","");
    let page = "";
    
    if (c.indexOf("?")){
    	page = c.split("=")[1];
    	c = c.split("?")[0]; 
    }
    if(page == undefined){
    	 page = "1";
    }
   
    console.log(page);
    console.log(c);
    console.log(urlKey);
    
    const url = `https://tiki.vn/api/v2/products?limit=48&category=`+c+`&page=`+page+`&urlKey=`+urlKey;
    
    https.get(url, (resp) => {
        // console.log('statusCode:', resp.statusCode);
        // console.log('headers:', resp.headers);
        
        let data = '';

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
          data += chunk;
        });
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          //console.log(JSON.parse(data));
          const td = [];
          const tikiData = JSON.parse(data);
          for (let i = 0 ; i< tikiData.data.length ; i++) {
            let price = tikiData.data[i].price;
            let name = tikiData.data[i].name;
            let list_price = tikiData.data[i].list_price;
            let rating_average = tikiData.data[i].rating_average;
            let discount_rate = tikiData.data[i].discount_rate;
            let discount = tikiData.data[i].discount;
            let review_count = tikiData.data[i].review_count;

            td.push({
              name: name,
              price: price,
              list_price: list_price,
              rating_average: rating_average,
              discount_rate: discount_rate,
              discount: discount,
              review_count: review_count,
            })
          }
          fs.writeFileSync(urlKey+"-"+page+".json",JSON.stringify(td),(err)=>{
              if(err){
                  console.log(err);
                  return;
              }else{
                  console.log("OK MAN");
              }
          })
        });
      
      }).on('error', (e) => {
        console.error(e);
      });
      response.redirect("/");
})


app.listen(3000,()=>{
    console.log("server started on port 3000");

})