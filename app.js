const middleOfMap = [18.69680928071636, 45.55459080341755];

async function init() {
	const map = new maplibregl.Map({
		style: "https://tiles.openfreemap.org/styles/liberty",
		center: middleOfMap,
		zoom: 14,
		container: "map",
	});

	map.addControl(
		new maplibregl.NavigationControl({
			visualizePitch: true,
			visualizeRoll: true,
			showZoom: true,
			showCompass: true,
		}),
	);

	map.doubleClickZoom.disable();

	map.on("click", (e) => {
		const lng = e.lngLat.lng;
		const lat = e.lngLat.lat;

		console.log([lng, lat]);
	});

	/*----------------------fetching lines json data...............*/
	async function fetchData(path) {
		const response = await fetch(path);
		if (!response.ok) {
			throw new Error("Request error");
		}
		const data = await response.json();
		return data;
	}

	const results = await Promise.all([
		fetchData("./data/zone/zona0.json"),
		fetchData("./data/zone/zona1.json"),
		fetchData("./data/zone/zona2.json"),
	]);

	/*----------------------adding json data...............*/
	map.addSource("polygon0", {
		type: "geojson",
		data: results[0],
	});

	map.addSource("polygon1", {
		type: "geojson",
		data: results[1],
	});

	map.addSource("polygon2", {
		type: "geojson",
		data: results[2],
	});

	/*----------------------adding lines-----------------*/
	map.addLayer({
		id: "polygon-layer0",
		type: "line",
		source: "polygon0",
		layout: { "line-join": "round", "line-cap": "round" },
		paint: {
			"line-color": "#ba0909",
			"line-width": 5,
		},
	});

	map.addLayer({
		id: "polygon-layer1",
		type: "line",
		source: "polygon1",
		layout: { "line-join": "round", "line-cap": "round" },
		paint: {
			"line-color": "#000000",
			"line-width": 5,
		},
	});

	map.addLayer({
		id: "polygon-layer2",
		type: "line",
		source: "polygon2",
		layout: { "line-join": "round", "line-cap": "round" },
		paint: {
			"line-color": "#1322f2",
			"line-width": 5,
		},
	});

	/*-----------------adding circle and points--------------------------*/
	async function fetchMarkerData(path) {
		const response = await fetch(path);
		if (!response.ok) {
			throw new Error("Request error");
		}
		const data = await response.json();
		return data;
	}

	const pointsData0 = await fetchMarkerData("./data/zone/zona0points.json");
	const pointsData1 = await fetchMarkerData("./data/zone/zona1points.json");
	const pointsData2 = await fetchMarkerData("./data/zone/zona2points.json");
	const arrowPoints = await fetchMarkerData("./data/zone/arrowEndpoints.json");
	const circlePoints = await fetchMarkerData(
		"./data/zone/circleGradientEndpoints.json",
	);

	map.addSource("markers0", {
		type: "geojson",
		data: pointsData0,
	});

	map.addLayer({
		id: "markers0",
		type: "circle",
		source: "markers0",
		paint: {
			"circle-radius": 7,
			"circle-color": "#ba0909",
			"circle-stroke-width": 2,
			"circle-stroke-color": "#ffffff",
		},
	});

	map.addSource("markers1", {
		type: "geojson",
		data: pointsData1,
	});

	map.addLayer({
		id: "markers1",
		type: "circle",
		source: "markers1",
		paint: {
			"circle-radius": 7,
			"circle-color": "#000000",
			"circle-stroke-width": 2,
			"circle-stroke-color": "#ffffff",
		},
	});

	map.addSource("markers2", {
		type: "geojson",
		data: pointsData2,
	});

	map.addLayer({
		id: "markers2",
		type: "circle",
		source: "markers2",
		paint: {
			"circle-radius": 7,
			"circle-color": "#1322f2",
			"circle-stroke-width": 2,
			"circle-stroke-color": "#ffffff",
		},
	});

	const el = document.createElement("img");
	el.src = "./icons/arrow.svg";

	el.onload = () => {
		map.addImage("custom-marker", el);

		map.addSource("arrowEndpoints", {
			type: "geojson",
			data: arrowPoints,
		});

		map.addLayer({
			id: "arrowEndpoints",
			type: "symbol",
			source: "arrowEndpoints",
			layout: {
				"icon-image": "custom-marker",
				"icon-overlap": "always",
				"icon-size": 1.5,
				"icon-rotate": ["+", ["get", "bearing"], 30],
				"icon-rotation-alignment": "map",
			},
		});
	};

	const el2 = document.createElement("img");
	el2.src = "./icons/circleGradient.svg";

	el2.onload = () => {
		map.addImage("custom-marker2", el2);

		map.addSource("circleGradientEndpoints", {
			type: "geojson",
			data: circlePoints,
		});

		map.addLayer({
			id: "circleGradientEndpoints",
			type: "symbol",
			source: "circleGradientEndpoints",
			layout: {
				"icon-image": "custom-marker2",
				"icon-overlap": "always",
				"icon-size": 0.65,
				"icon-rotate": ["+", ["get", "bearing"], 30],
				"icon-rotation-alignment": "map",
			},
		});
	};
	/*-----------------adding sms info--------------------------*/
	const messageInfo = document.createElement("div");
	messageInfo.className = "threeD_container";
	messageInfo.innerHTML = `
			<div class="option3D">
				<img class="dimension_icon" src="./icons/3d_icon.svg" alt="mobitel ikona" width="60px" height="60px"/>
			</div>
		`;

	document.getElementById("map").appendChild(messageInfo);

	/*---------------------------add 3D functionality----------------- */
	const option3D = document.querySelector(".option3D");
	const dimensionIcon = document.querySelector(".dimension_icon");
	let option = false;

	option3D.addEventListener("click", () => {
		option = !option;
		if (option) {
			map.setPitch(60);
			map.setBearing(30);
			dimensionIcon.src = "./icons/2d_icon.svg";
		} else {
			map.setPitch(0);
			map.setBearing(0);
			dimensionIcon.src = "./icons/3d_icon.svg";
		}
	});
}

init();

function linesToEndpoints(linesGeoJSON) {
	const points = [];

	linesGeoJSON.features.forEach((feature) => {
		if (feature.geometry.type !== "LineString") return;

		const coords = feature.geometry.coordinates;

		const start = coords[0];
		const end = coords[coords.length - 1];

		points.push({
			type: "Feature",
			geometry: {
				type: "Point",
				coordinates: start,
			},
		});

		points.push({
			type: "Feature",
			geometry: {
				type: "Point",
				coordinates: end,
			},
		});
	});
	console.log(points);
	return {
		type: "FeatureCollection",
		features: points,
	};
}

// const lines = JSON.parse(fs.readFileSync("./data/zone/zona1.json"));
// const endpoints = linesToEndpoints(lines);

// fs.writeFileSync(
// 	"./data/zone/zona1points.json",
// 	JSON.stringify(endpoints, null, 2),
// );
