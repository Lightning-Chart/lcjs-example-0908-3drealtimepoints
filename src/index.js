/*
 * LightningChartJS example that showcases PointSeries3D in a realtime application (continuous high speed data input)
 */
// Import LightningChartJS
const lcjs = require('@arction/lcjs')

// Extract required parts from LightningChartJS.
const {
    lightningChart,
    PointSeriesTypes3D,
    Themes
} = lcjs

// Initiate chart
const chart3D = lightningChart().Chart3D({
    // theme: Themes.darkGold
})

// Set Axis titles
chart3D.getDefaultAxisX().setTitle('Axis X')
chart3D.getDefaultAxisY().setTitle('Axis Y')
chart3D.getDefaultAxisZ().setTitle('Axis Z')

// Set static Axis intervals.
chart3D.getDefaultAxisX().setInterval( 0, 100, false, true )
chart3D.getDefaultAxisY().setInterval( 0, 100, false, true )
chart3D.getDefaultAxisZ().setInterval( 0, 100, false, true )

// Create Point Cloud Series (variant optimized for rendering minimal detail geometry)
const pointSeries3D = chart3D.addPointSeries({ type: PointSeriesTypes3D.Pixelated })
    .setPointStyle((style) => style.setSize(5))

// : Example data generation configuration :
// Amount of data visible at a time.
const pointBatchSize = 10000
// Amount of unique data sets.
const uniqueDataSetsCount = 5
// Visible duration of each data set in milliseconds.
const frameDurationMs = 100

// Set Chart title
chart3D.setTitle(`3D Realtime Point Series (${pointBatchSize} data points per frame)`)

// Generate data.
new Promise((resolve, reject) => {
    const dataSets = []
    for (let iDataset = 0; iDataset < uniqueDataSetsCount; iDataset ++) {
        const dataSet = []
        dataSets.push(dataSet)
        for (let iPoint = 0; iPoint < pointBatchSize; iPoint ++) {
            const x = Math.random() * 100
            const y = Math.random() * 100
            const z = Math.random() * 100
            dataSet.push({ x, y, z })
        }
    }
    resolve(dataSets)
})
    .then((dataSets) => {
        // Alternate visible dataset at regular intervals.
        let iDataSet = 0
        let lastSwitch
        const switchDataSet = () => {
            iDataSet = (iDataSet + 1) % uniqueDataSetsCount
            const data = dataSets[iDataSet]
            pointSeries3D
                // Clear previous data.
                .clear()
                // Add new data.
                .add(data)
            lastSwitch = Date.now()
        }
        switchDataSet()
        const checkRegularDataSetSwitch = () => {
            if (Date.now() - lastSwitch >= frameDurationMs) {
                switchDataSet()
            }
            requestAnimationFrame(checkRegularDataSetSwitch)
        }
        checkRegularDataSetSwitch()
    })
