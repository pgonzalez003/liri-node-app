const dotenv = require("dotenv").config();

const keys = require("./keys.js");
const Spotify = require("node-spotify-api");
const spotify = new Spotify(keys.spotify);
const request = require("request");
const axios = require("axios");  
const fs = require("fs");
const moment = require("moment");

// User input

const searchOption = process.argv[2];
const searchTerm = process.argv.slice(3).join(" ");

// search function
userInput(searchOption, searchTerm);

function userInput(searchOption, searchTerm) {
    switch (searchOption) {
        case 'concert-this':
            concertSearch(searchTerm);
            break;
        case 'spotify-this-song':
            spotifySearch(searchTerm);
            break;
        case 'movie-this':
            movieSearch(searchTerm);
            break;
        case 'do-what-it-says':
            doWhatItSays();
            break;
        default:
            console.log("try again");
    }
}

// concert search
function concertSearch(searchTerm){
    const queryURL = "https://rest.bandsintown.com/artists/" + searchTerm + "/events?app_id=codingbootcamp";

    axios.get(queryURL).then(
        function (response) {
            const data = JSON.parse(JSON.stringify(response.data));
            console.log("\nVenue: " + data[0].venue.name +
                        "\nLocation: " + data[0].venue.city + ", " + data[0].venue.country +
                        "\nConcert Dates: " + moment(data[0].datetime).format("MM/DD/YYYY"));
        }
    );
}

// spotitfy search

function spotifySearch(searchTerm){

    spotify.search({ type: 'track', query: searchTerm }, function(err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return; 
        }
        else {
            const response = data.tracks.items[0];
            console.log("\nArtist: " + response.artists[0].name +
                        "\nTrack Name: " + response.name +
                        "\nPreview URL: " + response.preview_url +
                        "\nAlbum: " + response.album.name);
        };
    });
}

//movie search

function movieSearch(searchTerm) {
    const queryURL = "http://www.omdbapi.com/?t=" + searchTerm + "&y=&plot=short&apikey=trilogy";

    axios.get(queryURL).then(
        function (response) {
            //console.log("Full Response Data:\n" + JSON.stringify(response.data));    
            console.log("\nTitle: " + response.data.Title +
                "\nYear: " + response.data.Year +
                "\nIMDB Rating: " + response.data.imdbRating +
                "\nRotton Tomato: " + response.data.Ratings[1].Value +
                "\nCountry: " + response.data.Country +
                "\nLanguage: " + response.data.Language +
                "\nPlot: " + response.data.Plot +
                "\nActors: " + response.data.Actors);
        }
    );
}

// do what it says 


function doWhatItSays(searchTerm){

    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
          return console.log(error);
        }
        let dataArr = data.split(", ");
        if (dataArr[0] === "spotifyThis"){
            spotifyThis(dataArr[1])
        }
        else if (dataArr[0] === "movieThis"){
            movieThis(dataArr[1])
        }
        else if (dataArr[0] === "concertThis"){
            concertThis(dataArr[1])
        }
        else {
            console.log('Hmm, something seems to be wrong...');
        }

      });     
}