// import createJson from "./helpers/createJson.js";

const middleOfMap = [18.69680928071636, 45.55459080341755];

async function init() {
	const map = new maplibregl.Map({
		style: "https://tiles.openfreemap.org/styles/liberty",
		center: middleOfMap,
		zoom: 12,
		container: "map",
	});

	// map.setStyle("https://tiles.openfreemap.org/styles/liberty");
	map.on("load", async () => {
		map.addControl(
			new maplibregl.NavigationControl({
				visualizePitch: true,
				visualizeRoll: true,
				showZoom: true,
				showCompass: true,
			}),
			"bottom-right",
		);

		// Geolocation control
		map.addControl(
			new maplibregl.GeolocateControl({
				positionOptions: {
					enableHighAccuracy: true,
				},
				trackUserLocation: true,
			}),
			"bottom-right",
		);

		map.addControl(new maplibregl.FullscreenControl(), "bottom-right");

		map.doubleClickZoom.disable();

		map.on("click", (e) => {
			const lng = e.lngLat.lng;
			const lat = e.lngLat.lat;
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
			fetchData("./data/zone/zona0.geojson"),
			fetchData("./data/zone/zona1.geojson"),
			fetchData("./data/zone/zona2.geojson"),
			fetchData("./data/zone/zona3.geojson"),
			fetchData("./data/zone/zona4.geojson"),
			fetchData("./data/zone/zona5.geojson"),
		]);

		proj4.defs(
			"EPSG:3765",
			"+proj=tmerc +lat_0=0 +lon_0=16.5 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
		);

		// convert coordinates
		function convertCoords(coords) {
			return coords.map((line) =>
				line.map((point) => proj4("EPSG:3765", "EPSG:4326", point)),
			);
		}

		// apply to result GeoJSON
		results.forEach((result) =>
			result.features.forEach((f) => {
				if (f.geometry.type === "MultiLineString") {
					f.geometry.coordinates = convertCoords(f.geometry.coordinates);
				}
			}),
		);

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

		map.addSource("polygon3", {
			type: "geojson",
			data: results[3],
		});
		map.addSource("polygon4", {
			type: "geojson",
			data: results[4],
		});
		map.addSource("polygon5", {
			type: "geojson",
			data: results[5],
		});

		/*----------------------adding lines-----------------*/
		map.addLayer({
			id: "polygon-layer0",
			type: "line",
			source: "polygon0",
			layout: { "line-join": "round", "line-cap": "round" },
			paint: {
				"line-color": "#d61111",
				"line-width": 8,
				"line-opacity": 0.7,
			},
		});

		map.addLayer({
			id: "polygon-layer1",
			type: "line",
			source: "polygon1",
			layout: { "line-join": "round", "line-cap": "round" },
			paint: {
				"line-color": "#c510c5",
				"line-width": 8,
				"line-opacity": 0.7,
			},
		});

		map.addLayer({
			id: "polygon-layer2",
			type: "line",
			source: "polygon2",
			layout: { "line-join": "round", "line-cap": "round" },
			paint: {
				"line-color": "#005fac",
				"line-width": 8,
				"line-opacity": 0.7,
			},
		});

		map.addLayer({
			id: "polygon-layer3",
			type: "line",
			source: "polygon3",
			layout: { "line-join": "round", "line-cap": "round" },
			paint: {
				"line-color": "#12bb12",
				"line-width": 8,
				"line-opacity": 0.7,
			},
		});

		map.addLayer({
			id: "polygon-layer4",
			type: "line",
			source: "polygon4",
			layout: { "line-join": "round", "line-cap": "round" },
			paint: {
				"line-color": "#f28a13",
				"line-width": 8,
				"line-opacity": 0.7,
			},
		});

		map.addLayer({
			id: "polygon-layer5",
			type: "line",
			source: "polygon5",
			layout: { "line-join": "round", "line-cap": "round" },
			paint: {
				"line-color": "#414141",
				"line-width": 8,
				"line-opacity": 0.7,
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

		const pointsData0 = await fetchMarkerData(
			"./data/zone/tocke2/zona0points.geojson",
		);
		const pointsData1 = await fetchMarkerData(
			"./data/zone/tocke2/zona1points.geojson",
		);
		const pointsData2 = await fetchMarkerData(
			"./data/zone/tocke2/zona2points.geojson",
		);
		const pointsData3 = await fetchMarkerData(
			"./data/zone/tocke2/zona3points.geojson",
		);
		const pointsData4 = await fetchMarkerData(
			"./data/zone/tocke2/zona4points.geojson",
		);
		const pointsData5 = await fetchMarkerData(
			"./data/zone/tocke2/zona5points.geojson",
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
				"circle-color": "#d61111",
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
				"circle-color": "#c510c5",
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
				"circle-color": "#005fac",
				"circle-stroke-width": 2,
				"circle-stroke-color": "#ffffff",
			},
		});
		map.addSource("markers3", {
			type: "geojson",
			data: pointsData3,
		});

		map.addLayer({
			id: "markers3",
			type: "circle",
			source: "markers3",
			paint: {
				"circle-radius": 7,
				"circle-color": "#12bb12",
				"circle-stroke-width": 2,
				"circle-stroke-color": "#ffffff",
			},
		});

		map.addSource("markers4", {
			type: "geojson",
			data: pointsData4,
		});

		map.addLayer({
			id: "markers4",
			type: "circle",
			source: "markers4",
			paint: {
				"circle-radius": 7,
				"circle-color": "#f28a13",
				"circle-stroke-width": 2,
				"circle-stroke-color": "#ffffff",
			},
		});

		map.addSource("markers5", {
			type: "geojson",
			data: pointsData5,
		});

		map.addLayer({
			id: "markers5",
			type: "circle",
			source: "markers5",
			paint: {
				"circle-radius": 7,
				"circle-color": "#414141",

				"circle-stroke-width": 2,
				"circle-stroke-color": "#ffffff",
			},
		});

		/*-----------------adding sms info--------------------------*/
		const messageInfo = document.createElement("div");
		messageInfo.className = "info-container";
		messageInfo.innerHTML = `
				<div class="map-info-container">
					<div class="downArr">
							<img  src="./icons/downArr.svg" alt="legenda ikona" width="30px" height="30px"/>
					</div>
					<div class="legend-container">
						<div class="legend-info">
							<div>
								<input type="checkbox" id="bike-way"  />
								<label for="bike-way">
									<div class="blue-line line"></div>
									Biciklističke staze
								</label>
							</div>
							<div>
								<input type="checkbox" id="bike-lane"  />
								<label for="bike-lane">
									<div class="green-line line"></div>
									Biciklističke trake
								</label>
							</div>
							<div>
								<input type="checkbox" id="bike-road"  />
								<label for="bike-road">
									<div class="orange-line line"></div>
									Biciklističke ceste
								</label>
							</div>
							<div>
								<input type="checkbox" id="walk-bike"  />
								<label for="walk-bike">
									<div class="red-line line"></div>
									Pješačko-biciklističke staze
								</label>
							</div>
							<div>
								<input type="checkbox" id="mixed-traffic"  />
								<label for="mixed-traffic">
									<div class="pink-line line"></div>
									Ceste za mješoviti promet
								</label>
							</div>
							<div>
								<input type="checkbox" id="unmarked"  />
								<label for="unmarked">
									<div class="black-line line"></div>
									Neoznačeno
								</label>
							</div>
						</div>
					</div>
				</div>
			`;

		document.getElementById("map").appendChild(messageInfo);

		const optionInfo = document.createElement("div");
		optionInfo.className = "options-container";
		optionInfo.innerHTML = `
			<div class="optionMapContainer">
					<img  src="./icons/legend.svg" alt="legenda ikona" width="50px" height="50px"/>
			</div>
			<div class="option3D">
				<img class="dimension_icon" src="./icons/3d_icon.svg" alt="mobitel ikona" width="60px" height="60px"/>
			</div>`;

		document.getElementById("map").appendChild(optionInfo);
		/*---------------------------add 3D functionality----------------- */
		const option3D = document.querySelector(".option3D");
		const dimensionIcon = document.querySelector(".dimension_icon");
		let option = false;

		option3D.addEventListener("click", () => {
			option = !option;
			if (option) {
				map.setPitch(60);
				map.setBearing(30);
				dimensionIcon.src = "./icons/2d_icon_new.svg";
			} else {
				map.setPitch(0);
				map.setBearing(0);
				dimensionIcon.src = "./icons/3d_icon.svg";
			}
		});

		/*---------------------------add legend functionality----------------- */
		const optionlegend = document.querySelector(".optionMapContainer");
		const exitLegendIcon = document.querySelector(".downArr");
		const legend = document.querySelector(".map-info-container");

		optionlegend.addEventListener("click", function () {
			legend.classList.toggle("showLegend");
		});

		exitLegendIcon.addEventListener("click", function () {
			legend.classList.toggle("showLegend");
		});

		/*---------------------------add toggle functionality----------------- */

		function setupLayerToggle(toggleElements) {
			toggleElements.forEach((toggleElement) => {
				const checkbox = document.getElementById(toggleElement.checkbox);
				checkbox.checked = true;

				checkbox.addEventListener("change", () => {
					toggleElement.layer.forEach((lay) => {
						map.setLayoutProperty(
							lay,
							"visibility",
							checkbox.checked ? "visible" : "none",
						);
					});
				});
			});
		}

		setupLayerToggle([
			{
				checkbox: "walk-bike",
				layer: ["polygon-layer0", "markers0"],
			},
			{
				checkbox: "mixed-traffic",
				layer: ["polygon-layer1", "markers1"],
			},
			{
				checkbox: "bike-way",
				layer: ["polygon-layer2", "markers2"],
			},
			{
				checkbox: "bike-lane",
				layer: ["polygon-layer3", "markers3"],
			},
			{
				checkbox: "bike-road",
				layer: ["polygon-layer4", "markers4"],
			},
			{
				checkbox: "unmarked",
				layer: ["polygon-layer5", "markers5"],
			},
		]);
		/*-----------------adding lines onclick functionality--------------------------*/
		const layers = [
			"polygon-layer0",
			"polygon-layer1",
			"polygon-layer2",
			"polygon-layer3",
			"polygon-layer4",
			"polygon-layer5",
		];

		layers.forEach((layer) => {
			map.on("click", layer, (e) => {
				const feature = e.features[0];
				showSidebar(feature.properties);
			});
		});

		function showSidebar(props) {
			const sidebar = document.getElementById("sidebar");
			const content = document.getElementById("sidebar-content");

			content.innerHTML = `
			<p><b>Lokacija:</b> ${props["lokacija"] || "-"}</p>
			<p><b>Kategorija:</b> ${props["kategorija"] || "-"}</p>
			<p><b>Tip:</b> ${props["tip"] || "-"}</p>
			<p><b>Širina:</b> ${props["širina"] || "-"}</p>
			<p><b>Duljina:</b> ${props["duljina"] || "-"}</p>
			<p><b>Status:</b> ${props["status"] || "-"}</p>
			<p><b>Završni sloj:</b> ${props["završni sloj"] || "-"}</p>
			<p><b>Datum podataka:</b> ${props["datum podatka"] || "-"}</p>
			<p><b>Napomena:</b> ${props["napomena"] || "-"}</p>
		`;

			sidebar.classList.add("show");
		}

		layers.forEach((layer) => {
			map.on("mouseenter", layer, () => {
				map.getCanvas().style.cursor = "pointer";
			});

			map.on("mouseleave", layer, () => {
				map.getCanvas().style.cursor = "";
			});
		});

		const closeButton = document.getElementById("close");
		closeButton.addEventListener("click", () => {
			sidebar.classList.remove("show");
		});
	});
}

init();
