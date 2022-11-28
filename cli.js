#!/usr/bin/env node

import minimist from 'minimist';
import moment from 'moment-timezone';
import fetch from 'node-fetch';

const args = minimist(process.argv.slice(2))


if(args.h !== undefined || Object.keys(args).length == 1){
	console.log(
`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
    -h            Show this help message and exit.
    -n, -s        Latitude: N positive; S negative.
    -e, -w        Longitude: E positive; W negative.
    -z            Time zone: uses tz.guess() from moment-timezone by default.
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
    -j            Echo pretty JSON from open-meteo API and exit.
`)
	process.exit(0)
}

	if(args.n === undefined && args.s === undefined){
		console.log("Latitude must be in range")
	}else if(args.n !== undefined && args.s === undefined){
		args.latitude = args.n
	}else if(args.n === undefined && args.s !== undefined){
		args.latitude = -args.s
	}else{
		console.log("Can't have both positive and negative latitudes");
	}
const latitude = args.latitude;
if(latitude == null){
	if(args.j){process.exit(0)}
	else{process.exit(1)}
}

	if(args.w === undefined && args.e === undefined){
		console.log("Longitude must be in range")
	}else if(args.w !== undefined && args.e === undefined){
		args.longitude = args.w
	}else if(args.w === undefined && args.e !== undefined){
		args.longitude = -args.e
	}else{
		console.log("Can't have both positive and negative longitudes");
	}
const longitude = args.longitude;
if(longitude == null){
	if(args.j){process.exit(0)}
	else{process.exit(1)}
}

	if(args.z === undefined){
		args.z = moment.tz.guess()
	}
const timezone = args.z

	const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude="+latitude+
	"&longitude="+longitude+
	"&daily=precipitation_hours&timezone=" + timezone)
const data = await response.json();

if(args.j !== undefined){
	console.log(data);
	process.exit(0);
}


	if(args.d === undefined){
		args.d = 1;
	}
const days = args.d 

process.stdout.write("You will ")
if(data.daily.precipitation_hours[days] == 0.0){
	process.stdout.write("not ");
}
process.stdout.write("need your galoshes ")

if (days == 0) {
  console.log("today.")
} else if (days > 1) {
  console.log("in " + days + " days.")
} else {
  console.log("tomorrow.")
}
