// import fs from "fs";
// import proj4 from "proj4";

export default function linesToEndpoints(linesGeoJSON) {
	const points = [];

	function convertCoords(coords) {
		return coords.map((line) =>
			line.map((point) => proj4("EPSG:3765", "EPSG:4326", point)),
		);
	}

	linesGeoJSON.features.forEach((feature, index) => {
		if (feature.geometry.type !== "MultiLineString") return;

		proj4.defs(
			"EPSG:3765",
			"+proj=tmerc +lat_0=0 +lon_0=16.5 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
		);

		// apply to your GeoJSON
		console.log(feature.geometry.coordinates);
		const coords = convertCoords(feature.geometry.coordinates);
		console.log(coords);

		let start;
		let end;

		if (index === 0) {
			console.log("startttt");
			start = coords[0][0];
			// end = coords[0][coords.length - 1];

			points.push({
				type: "Feature",
				geometry: {
					type: "Point",
					coordinates: start,
				},
			});
		} else {
			console.log("endddd");
			// start = coords[0][0];
			end = coords[0][coords.length - 1];

			points.push({
				type: "Feature",
				geometry: {
					type: "Point",
					coordinates: end,
				},
			});
		}
	});
	console.log(points);
	return {
		type: "FeatureCollection",
		features: points,
	};
}

const lines = JSON.parse(fs.readFileSync("./data/zone/zona5.geojson"));
const endpoints = linesToEndpoints(lines);

fs.writeFileSync(
	"./data/zone/tocke2/zona5points.geojson",
	JSON.stringify(endpoints, null, 2),
);

// function linesToEndpoints(linesGeoJSON) {
// 	const points = [];

// 	function convertCoords(coords) {
// 		return coords.map((line) =>
// 			line.map((point) => proj4("EPSG:3765", "EPSG:4326", point)),
// 		);
// 	}

// 	linesGeoJSON.features.forEach((feature) => {
// 		if (feature.geometry.type !== "MultiLineString") return;

// 		proj4.defs(
// 			"EPSG:3765",
// 			"+proj=tmerc +lat_0=0 +lon_0=16.5 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
// 		);

// 		// apply to your GeoJSON
// 		console.log(feature.geometry.coordinates);
// 		const coords = convertCoords(feature.geometry.coordinates);
// 		console.log(coords);

// 		const start = coords[0][0];
// 		const end = coords[0][coords.length - 1];

// 		points.push({
// 			type: "Feature",
// 			geometry: {
// 				type: "Point",
// 				coordinates: start,
// 			},
// 		});

// 		points.push({
// 			type: "Feature",
// 			geometry: {
// 				type: "Point",
// 				coordinates: end,
// 			},
// 		});
// 	});
// 	console.log(points);
// 	return {
// 		type: "FeatureCollection",
// 		features: points,
// 	};
// }
