var url_data = [
  "./jsonFiles/disasterMonitoring.json",
  "./jsonFiles/earthResources.json",
  "./jsonFiles/education.json",
  "./jsonFiles/engineering.json",
  "./jsonFiles/geodetic.json",
  "./jsonFiles/indianASATtestDebris.json",
  "./jsonFiles/russianASATtestDebris.json",
  "./jsonFiles/spaceAndEarthScience.json",
  "./jsonFiles/spaceStations.json",
  "./jsonFiles/starLink.json",
  "./jsonFiles/Weather.json",
];
function getSattelites(json_data, color) {
  var disasterMonitoring_data = json_data;
  var disasterMonitoring_satrec = [];

  for (let i = 0; i < disasterMonitoring_data.length; i++) {
    disasterMonitoring_satrec[i] = satellite.twoline2satrec(
      disasterMonitoring_data[i].tle_line_1.trim(),
      disasterMonitoring_data[i].tle_line_2.trim()
    );
  }

  var disMonit_positionsOverTime = [];

  for (let j = 0; j < disasterMonitoring_satrec.length; j++) {
    disMonit_positionsOverTime[j] = new Cesium.SampledPositionProperty();

    for (let i = 0; i < totalSeconds; i += timestepInSeconds) {
      var time = Cesium.JulianDate.addSeconds(
        start,
        i,
        new Cesium.JulianDate()
      );
      var jsDate = Cesium.JulianDate.toDate(time);

      var positionAndVelocity = satellite.propagate(
        disasterMonitoring_satrec[j],
        jsDate
      );

      var gmst = satellite.gstime(jsDate);
      var p = satellite.eciToGeodetic(positionAndVelocity.position, gmst);

      var position = Cesium.Cartesian3.fromRadians(
        p.longitude,
        p.latitude,
        p.height * 1000
      );
      disMonit_positionsOverTime[j].addSample(time, position);
    }
  }

  var satellitesPoints = [];
  for (let i = 0; i < disasterMonitoring_data.length; i++) {
    satellitesPoints[i] = viewer.entities.add({
      position: disMonit_positionsOverTime[i],
      point: { pixelSize: 6, color: color },
    });
  }
}
async function program() {
  var json_data;
  async function getData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
  var disMonitoring = await getData("./jsonFiles/disasterMonitoring.json");
  var education = await getData("./jsonFiles/education.json");
  var geodetic = await getData("./jsonFiles/geodetic.json");
  var engineering = await getData("./jsonFiles/engineering.json");
  var spaceStations = await getData("./jsonFiles/spaceStations.json");
  var indianASAT = await getData("./jsonFiles/indianASATtestDebris.json");
  getSattelites(spaceStations, Cesium.Color.GREEN);
  getSattelites(disMonitoring, Cesium.Color.BLUE);
  getSattelites(education, Cesium.Color.RED);
  getSattelites(geodetic, Cesium.Color.YELLOW);
  getSattelites(engineering, Cesium.Color.GREY);
  getSattelites(indianASAT, Cesium.Color.PURPLE);
}

const viewer = new Cesium.Viewer("earth", {
  imageryProvider: new Cesium.TileMapServiceImageryProvider({
    url: Cesium.buildModuleUrl("Assets/Textures/NaturalEarthII"),
  }),
  baseLayerPicker: false,
  geocoder: false,
  homeButton: true,
  infoBox: false,
  navigationHelpButton: false,
  sceneModePicker: true,
});

viewer.scene.globe.enableLighting = true;

const totalSeconds = 100 * 100 * 60;
const timestepInSeconds = 10;
const start = Cesium.JulianDate.fromDate(new Date());
const stop = Cesium.JulianDate.addSeconds(
  start,
  totalSeconds,
  new Cesium.JulianDate()
);
viewer.clock.startTime = start.clone();
viewer.clock.stopTime = stop.clone();
viewer.clock.currentTime = start.clone();
viewer.timeline.zoomTo(start, stop);
viewer.clock.multiplier = 60;
viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;

program();

viewer.trackedEntity = viewer;

let initialized = false;

viewer.scene.globe.tileLoadProgressEvent.addEventListener(() => {
  if (!initialized && viewer.scene.globe.tilesLoaded === true) {
    viewer.clock.shouldAnimate = true;
    initialized = true;
    viewer.scene.camera.zoomOut(5000000);
    document.querySelector("#loading").classList.toggle("disappear", true);
  }
});
