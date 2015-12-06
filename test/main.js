var Chiasm = require("chiasm");
var ChiasmDataReduction = require("chiasm-data-reduction");

// This is the module published as the npm package "chiasm-charts".
var Charts = require("../src");

function myApp(){
  var chiasm = new Chiasm();

  chiasm.plugins.layout = require("chiasm-layout");
  chiasm.plugins.links = require("chiasm-links");
  chiasm.plugins.dsvDataset = require("chiasm-dsv-dataset");

  // TODO add an API to Chiasm that supports registering multiple plugins simultaneously.
  // e.g. chiasm.registerPlugins(Charts.components);
  chiasm.plugins.scatterPlot = Charts.components.scatterPlot;
  chiasm.plugins.lineChart = Charts.components.lineChart;
  chiasm.plugins.barChart = Charts.components.barChart;
  chiasm.plugins.heatMap = Charts.components.heatMap;
  chiasm.plugins.boxPlot = Charts.components.boxPlot;

  chiasm.plugins.dataReduction = ChiasmDataReduction;

  chiasm.setConfig({
    "layout": {
      "plugin": "layout",
      "state": {
        "containerSelector": "#container",
        "layout": {
          "orientation": "vertical",
          "children": [
            {
              "orientation": "horizontal",
              "size": 2,
              "children": [
                {
                  "orientation": "vertical",
                  "children": [
                    "myBarChart",
                    "myHistogram"
                  ]
                },
                "myScatterPlot",
                "myBoxPlot"
              ]
            },
            {
              "orientation": "horizontal",
              "children": [
                "myHeatmap",
                "myLineChart"
              ]
            }
          ]
        }
      }
    },
    "lineChartDataLoader": {
      "plugin": "dsvDataset",
      "state": {
        "path": "lineChartData"
      }
    },
    "myLineChart": {
      "plugin": "lineChart",
      "state": {
        "xAxisLabelText": "Time",
        "xColumn": "timestamp",
        "yAxisLabelText": "Temperature",
        "yColumn": "temperature",
        "xAxisLabelTextOffset": 32,
        "yAxisLabelTextOffset": 30,
        "margin": { top: 0, right: 20, bottom: 35, left: 50}
      }
    },
    "scatterPlotDataLoader": {
      "plugin": "dsvDataset",
      "state": {
        "path": "scatterPlotData"
      }
    },
    "myScatterPlot": {
      "plugin": "scatterPlot",
      "state": {
        "xAxisLabelText": "Sepal Length",
        "xColumn": "sepal_length",
        "yAxisLabelText": "Petal Length",
        "yColumn": "petal_length",
        "xAxisLabelTextOffset": 32,
        "yAxisLabelTextOffset": 30,
        "margin": { top: 5, right: 20, bottom: 35, left: 50}
      }
    },
    "myBoxPlot": {
      "plugin": "boxPlot",
      "state": {
        "xAxisLabelText": "Class",
        "xColumn": "class",
        "yAxisLabelText": "Sepal Length",
        "yColumn": "sepal_length",
        "xAxisLabelTextOffset": 32,
        "yAxisLabelTextOffset": 30,
        "margin": { top: 5, right: 20, bottom: 35, left: 50}
      }
    },
    "barChartDataLoader": {
      "plugin": "dsvDataset",
      "state": {
        "path": "barChartData"
      }
    },
    "myBarChart": {
      "plugin": "barChart",
      "state": {
        "xAxisLabelText": "Name",
        "xColumn": "name",
        "yAxisLabelText": "Amount",
        "yColumn": "amount",
        "xAxisLabelTextOffset": 32,
        "yAxisLabelTextOffset": 30,
        "margin": { top: 5, right: 20, bottom: 35, left: 50}
      }
    },
    "histogramData": {
      "plugin": "dataReduction",
      "state": {
        "aggregate": {
          "dimensions": [{
            "column": "petal_length",
            "histogram": true,
            "numBins": 20
          }],
          "measures": [{
            "outColumn": "count", 
            "operator": "count"
          }]
        }
      }
    },
    "myHistogram": {
      "plugin": "barChart",
      "state": {
        "xAxisLabelText": "Petal Length",
        "xColumn": "petal_length",
        "yAxisLabelText": "Count",
        "yColumn": "count",
        "xAxisLabelTextOffset": 32,
        "yAxisLabelTextOffset": 30,
        "margin": { top: 5, right: 20, bottom: 35, left: 50}
      }
    },
    "heatmapData": {
      "plugin": "dataReduction",
      "state": {
        "aggregate": {
          "dimensions": [
            {
              "column": "petal_length",
              "histogram": true,
              "numBins": 10
            },
            {
              "column": "sepal_length",
              "histogram": true,
              "numBins": 10
            }
          ],
          "measures": [{
            "outColumn": "count", 
            "operator": "count"
          }]
        }
      }
    },
    "myHeatmap": {
      "plugin": "barChart",
      "state": {
        "xAxisLabelText": "Petal Length",
        "xColumn": "petal_length",
        "yAxisLabelText": "Sepal Length",
        "yColumn": "sepal_length",
        "xAxisLabelTextOffset": 32,
        "yAxisLabelTextOffset": 30,
        "margin": { top: 5, right: 20, bottom: 35, left: 50}
      }
    },
    "myLinks": {
      "plugin": "links",
      "state": {
        "bindings": [
          "lineChartDataLoader.dataset -> myLineChart.dataset",
          "scatterPlotDataLoader.dataset -> myScatterPlot.dataset",
          "scatterPlotDataLoader.dataset -> myBoxPlot.dataset",
          "scatterPlotDataLoader.dataset -> histogramData.datasetIn",
          "barChartDataLoader.dataset -> myBarChart.dataset",
          "histogramData.datasetOut -> myHistogram.dataset",
          "heatmapData.datasetOut -> myHeatmap.dataset"
        ]
      }
    }
  });
}
myApp();
