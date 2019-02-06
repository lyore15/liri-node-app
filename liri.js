require("dotenv").config();
var keys = require("./keys.js");

var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);

var request = require('request');

var moment = require("moment");

var fs = require("fs");

//Take input as first argument 
var userInput = process.argv[2]

//Take query as second argument
var query = process.argv[3]

//Set up a methods object to take all of the commands and run the functions
var commands = {
    
    concertthis: function () {
        if (!query) {
            query = "Maroon 5"
        }
        var queryUrl = "https://rest.bandsintown.com/artists/" + query + "/events?app_id=codingbootcamp"

        request(queryUrl, function (error, response, data) {

            if (!error && response.statusCode === 200) {
                var bands = JSON.parse(data)

                for (let i = 0; i < bands.length; i++) {
                    var event = bands[i]
                    console.log("\n" + query + "\nVenue: " + event.venue.name + "\nCity: " + event.venue.city + "\nDate: " + moment(event.datetime).format("MM/DD/YYYY"))
                }
            }
        });
    },
   
    spotifythissong: function (query) {
        if (!query) {
            query = "Sugar"
        }
        spotify.search({
            type: 'track',
            query: query
        }, function (error, data) {
            if (!error) {
                var spoty = data.tracks.items

                for (let i = 0; i < spoty.length; i++) {
                    console.log("\nArtist: " + spoty[i].album.artists[0].name + "\nSong: " + spoty[i].name + "\nPreview Link: " + spoty[i].external_urls.spotify + "\nAlbum: " + spoty[i].album.name)
                }

            } else {
                return console.log('Error occurred: ' + error);
            }
        });
    },
    
    moviethis: function () {
        if (!query) {
            query = "Mr. Nobody"
        }
        var queryUrl = "http://www.omdbapi.com/?apikey=trilogy&t=" + query

        request(queryUrl, function (error, response, data) {

            if (!error && response.statusCode === 200) {
                var omdbReturn = JSON.parse(data)

                console.log("\nTitle: " + omdbReturn.Title + "\nYear: " + omdbReturn.Year + "\nIMDB Rating: " + omdbReturn.Ratings[0].Value + "\nRotten Tomatoes Rating: " + omdbReturn.Ratings[1].Value + "\nCountry: " + omdbReturn.Country + "\nLanguage: " + omdbReturn.Language + "\nActors: " + omdbReturn.Actors + "\nPlot: " + omdbReturn.Plot)
            }
        });
    },
    dowhatitsays: function () {
        fs.readFile("random.txt", "utf8", function (error, data) {
            if (!error) {
                var dataArr = data.split(",")
                var input = dataArr[0]
                var request = dataArr[1]
                if (input === "spotify-this-song") {
                    methods.spotifythissong(request)
                }
            } else {
                console.log(error)
            }

        });
    }
}

commands[userInput](query)
