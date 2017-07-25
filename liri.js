// exporting appropriate libraries
const fs = require('fs');
const request = require('request');
const twitter = require('twitter');
const keys  = require('./key.js')
const spotify = require('node-spotify-api');

// assigning process.argv
var command = process.argv[2];

var queReq = process.argv.splice(3,1);

if(queReq[0] !== undefined){
	queReq = queReq[0].split(' ').join('+').toLowerCase();
}

// my tweets


function myTweets(){

	var client  = new twitter({
	  	consumer_key: keys.twitterKeys.consumer_key,
  		consumer_secret: keys.twitterKeys.consumer_secret,
  		access_token_key: keys.twitterKeys.access_token_key,
  		access_token_secret: keys.twitterKeys.access_token_secret
	})

	var params = {screen_name: 'Mikhail Hnid'}
	
	client.get('statuses/user_timeline',params,function(err,tweets,response){
		if(err){
			console.log(err)
		}
		else{
			console.log(tweets[0].user.name + "\n")
			
			for(let i = 0; i < tweets.length; i++){
				console.log(tweets[i].created_at)
				console.log(tweets[i].text)
				console.log('-------------------------------')
			}
		}
	})
}

// spotify this song
function spotifyThis(){

	var songName;
	var artistName;

	if(queReq[0] === undefined){
		songName = 'The+Sign';
		artistName = 'Ace+of+Bases'
	}else{
		songName = queReq;
	}

	var client = new spotify({
		id: keys.spotifyKeys.id,
		secret: keys.spotifyKeys.secret
	});

	client.search({type: 'track', query: songName, limit: 10, artist: artistName }, function(err, data){
		if(err){console.log(err)}
		else{

			for(i = 0; i < data.tracks.items.length; i++){
				
				// Search Number 
				console.log("Listing",i+1,'\n')
			    // * Artist(s)
			    console.log('Artist(s):',data.tracks.items[i].artists[0].name) 
			    // * The song's name
			    console.log('Name:',data.tracks.items[i].name)
			    // * A preview link of the song from Spotify
	    		console.log('Preview Link:',data.tracks.items[i].preview_url)
			    // * The album that the song is from
			    console.log('Album:',data.tracks.items[i].album.name)
			    // break line
			    console.log('-------------------------------')
			}
		}
	})
}

// movie this
function movieThis(){
	// Grab movie name from process array
	var movieName;

	// if no movie given, the default is Mr.Nobody
	if(queReq[0] === undefined){
		movieName = 'Mr.Nobody';
	}else{
		movieName = queReq;
	}
	
	queryUrl  = "http://www.omdbapi.com/?t="+movieName+"&plot=short&apikey=40e9cece";

	request(queryUrl, function(err,res,body){
		if(err){
			console.log(err)
		}
		else if(res.statusCode === 200){
			var movieData = JSON.parse(body);
			// * Title of the movie.
			console.log('Title:', movieData.Title);
		  	// * Year the movie came out.
		  	console.log('Year:', movieData.Year);
		  	// * IMDB Rating of the movie.
		  	console.log('IMBD Rating:', movieData.Ratings[0].Value);
		  	// * Rotten Tomatoes Rating of the movie.
		  	console.log('Rotten Tomatoes Rating:', movieData.Ratings[1].Value);
		  	// * Country where the movie was produced.
		  	console.log('Country:', movieData.Country);
		  	// * Language of the movie.
		  	console.log('Language:', movieData.Language);
		  	// * Plot of the movie.
		  	console.log('Plot:', movieData.Plot);
		  	// * Actors in the movie.
		  	console.log('Actors:', movieData.Actors)
		}
	})

}

// do what it says
function doThis(){

	fs.readFile('./random.txt','utf8', function(err,data){
		if(err){
			console.log(err)
		}
		else{
			console.log(data);
			data = data.split(',');
			command = data[0];
			queReq = data[1];

			runCommand();
		}
	})
}

// running commands
function runCommand(){
	switch(command){

		case 'my-tweets':
			myTweets();
			break

		case 'spotify-this-song':
			spotifyThis();
			break

		case 'movie-this':
			movieThis();
			break

		case 'do-what-it-says':
			doThis();
			break
	}
}

runCommand()
