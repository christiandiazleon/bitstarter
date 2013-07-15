#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var rest = require('restler');

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

function checkHtmlFile(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    var temp = JSON.stringify(out, null, 4);
    console.log(temp);
};

function checkHtmlUrl(htmlfile, checksfile) {
    rest.get(htmlfile).on('complete', function(result){
        if (result instanceof Error) {
                console.log("The url " + htmlfile + " doesn't exists " + result);$
        } else {
		//console.log(htmlfile);
               // console.log(result);
		var checks = loadChecks(checksfile).sort();
		$ = cheerio.load(result);
		var out = {};
    		for(var ii in checks) {
    			var present = $(checks[ii]).length > 0;
   			out[checks[ii]] = present;
   		}
		var temp = JSON.stringify(out, null, 4);
    		console.log(temp);		
        }
        });
};

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json')
        .option('-f, --file <html_file>', 'Path to index.html')
	.option('-u, --url <html_url>', 'Url to index.html')
        .parse(process.argv);
	
    	if(typeof program.url == 'undefined'){
		checkHtmlFile(program.file, program.checks);
		//console.log('type of input is a file');
	}
	else{
		checkHtmlUrl(program.url, program.checks);
		//console.log('type of input is a url');
	}
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
