<template>
  <div class="iss">
    <h2>ISS Position</h2>
    <div class="worldmap" ref="chartdiv">
    </div>
    <div class="detail">
      <h4>Lat: {{ position.lat }} | Long: {{ position.long }}</h4>
      <h4>Time: {{ position.timestamp }}</h4>
      <button v-on:click="fetchPosition">Force Fetch</button>
      <p>Every 10 seconds the ISS position is updated using backend service</p>
      <p>The ISS orbits the earth once every 93 minutes (roughly), completing 15.5 orbits per day (Source: <a href="https://en.wikipedia.org/wiki/International_Space_Station">Wikipedia</a>)</p>
      <p>Inspired from and actual data API at <a href="http://open-notify.org/Open-Notify-API/">Open Notify</a>.</p>
    </div>
  </div>
</template>

<script>
import * as am4core from '@amcharts/amcharts4/core'
import * as am4maps from '@amcharts/amcharts4/maps'
import am4geodataWorldLow from '@amcharts/amcharts4-geodata/worldLow'
import am4themesAnimated from '@amcharts/amcharts4/themes/animated'
import axios from 'axios'

am4core.useTheme(am4themesAnimated)
export default {
  name: 'WorldMap',
  data () {
    return {
      position: {
        lat: 40.440624,
        long: -79.995888,
        timestamp: null
      },
      polling: null
    }
  },
  created () {
    this.pollPosition()
  },
  mounted () {
    // Create map instance
    const chart = am4core.create('worldmap', am4maps.MapChart)

    // Set map definition
    chart.geodata = am4geodataWorldLow

    // Set projection
    chart.projection = new am4maps.projections.NaturalEarth1()
    chart.panBehavior = 'rotateLong'
    // chart.deltaLatitude = this.position.lat
    chart.deltaLongitude = this.position.long
    chart.padding(20, 20, 20, 20)

    // limits vertical rotation
    /*
    chart.adapter.add('deltaLatitude', function (deltaLatitude) {
      return am4core.math.fitToRange(deltaLatitude, -90, 90)
    })
     */

    // Create map polygon series
    const polygonSeries = chart.series.push(new am4maps.MapPolygonSeries())

    // Make map load polygon (like country names) data from GeoJSON
    polygonSeries.useGeodata = true

    // Configure series
    const polygonTemplate = polygonSeries.mapPolygons.template
    polygonTemplate.tooltipText = '{name}'
    polygonTemplate.fill = am4core.color('#47c78a')
    polygonTemplate.stroke = am4core.color('#454a58')
    polygonTemplate.strokeWidth = 0.5

    const graticuleSeries = chart.series.push(new am4maps.GraticuleSeries())
    graticuleSeries.mapLines.template.line.stroke = am4core.color('#ffffff')
    graticuleSeries.mapLines.template.line.strokeOpacity = 0.08
    graticuleSeries.fitExtent = false

    chart.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 0.1
    chart.backgroundSeries.mapPolygons.template.polygon.fill = am4core.color('#ffffff')

    // Create hover state and set alternative fill color
    const hs = polygonTemplate.states.create('hover')
    hs.properties.fill = chart.colors.getIndex(0).brighten(-0.5)

    // Create ISS Marker
    const imageSeries = chart.series.push(new am4maps.MapImageSeries())
    const imageSeriesTemplate = imageSeries.mapImages.template
    const circle = imageSeriesTemplate.createChild(am4core.Circle)
    circle.radius = 4
    circle.fill = am4core.color('#B27799')
    circle.stroke = am4core.color('#FFFFFF')
    circle.strokeWidth = 2
    circle.nonScaling = true
    circle.tooltipText = '{title}'
    imageSeriesTemplate.propertyFields.latitude = 'latitude'
    imageSeriesTemplate.propertyFields.longitude = 'longitude'
    imageSeries.data = [{
      latitude: this.position.lat,
      longitude: this.position.long,
      title: 'ISS'
    }]

    this.chart = chart
    this.chartPointer = imageSeries

    // Update with api data
    setTimeout(() => this.fetchPosition(), 100)
  },
  methods: {
    pollPosition: function () {
      this.polling = setInterval(() => {
        this.fetchPosition()
      }, 10 * 1000)
    },
    fetchPosition: function () {
      axios.get('http://localhost:8081/api/v1/iss/coordinates')
        .then(response => {
          console.log(response)
          this.position = {
            lat: response.data.iss_position.latitude,
            long: response.data.iss_position.longitude,
            timestamp: new Date(response.data.timestamp)
          }
          // this.chart.deltaLatitude = this.position.lat
          this.chart.deltaLongitude = -this.position.long
          this.chartPointer.data = [{
            latitude: this.position.lat,
            longitude: this.position.long,
            title: 'ISS'
          }]
        })
        .catch(error => console.log(error))
    }
  },
  beforeDestroy () {
    if (this.chart) {
      this.chart.dispose()
    }
    clearInterval(this.polling)
  }
}
</script>

<style scoped>
  .worldmap {
    width: 100%;
    height: 500px;
    max-width:100%;
    background-color:#454a58;
  }
</style>
