var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){

    url = 'https://en.wikipedia.org/wiki/John_Doe';

    request(url, function(error, response, html){
        
        if(!error){
            var $ = cheerio.load(html);

            var title, release, rating;
            var json = { title: "", desc: "", content: []};            

            $('#content').filter(function(){

                var data = $(this);

                var title = data.find("#firstHeading").text();
                var desc = data.find("#mw-content-text p").first().text();
                var content = [];
                data.find("#mw-content-text #toc li").each(function(){
                    content.push($(this).text())
                })

                json = {
                    title: title,
                    desc: desc,
                    content: content
                }
            })
        } else {
            console.log(error)
        }

        fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){

            console.log('File successfully written! - Check your project directory for the output.json file');

        })

        res.send('Check your console!')

    })

})

app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;