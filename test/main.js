var Chiasm = require("chiasm");

// This is the module published as the npm package "chiasm-charts".
var Charts = require("../src");

function myApp(){
  var chiasm = new Chiasm();

  chiasm.plugins.layout = require("chiasm-layout");
  chiasm.plugins.links = require("chiasm-links");
  chiasm.plugins.dsvDataset = require("chiasm-dsv-dataset");
  chiasm.plugins.dataReduction = require("chiasm-data-reduction");

  // TODO add an API to Chiasm that supports registering multiple plugins simultaneously.
  // e.g. chiasm.registerPlugins(Charts.components);
  chiasm.plugins.scatterPlot = Charts.components.scatterPlot;
  chiasm.plugins.lineChart = Charts.components.lineChart;
  chiasm.plugins.barChart = Charts.components.barChart;
  chiasm.plugins.heatMap = Charts.components.heatMap;
  chiasm.plugins.boxPlot = Charts.components.boxPlot;

  // These are custom property values used across many components.
  var xAxisLabelTextOffset = 30;
  var yAxisLabelTextOffset = 30;
  var margin = { top: 10, right: 10, bottom: 40, left: 42 };

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
              "children": [
                "myBarChart",
                "myScatterPlot",
                "myScatterPlotOrdinalX",
                "myBoxPlot"
              ]
            },
            {
              "orientation": "horizontal",
              "children": [
                "myHistogram",
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
        "xAxisLabelTextOffset": xAxisLabelTextOffset,
        "yAxisLabelTextOffset": yAxisLabelTextOffset,
        "margin": margin
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
        "xAxisLabelTextOffset": xAxisLabelTextOffset,
        "yAxisLabelTextOffset": yAxisLabelTextOffset,
        "margin": margin
      }
    },
    "myScatterPlotOrdinalX": {
      "plugin": "scatterPlot",
      "state": {
        "xAxisLabelText": "Class",
        "xColumn": "class",
        "yAxisLabelText": "Petal Length",
        "yColumn": "petal_length",
        "xAxisLabelTextOffset": xAxisLabelTextOffset,
        "yAxisLabelTextOffset": yAxisLabelTextOffset,
        "margin": margin
      }
    },
    "myBoxPlot": {
      "plugin": "boxPlot",
      "state": {
        "xAxisLabelText": "Class",
        "xColumn": "class",
        "yAxisLabelText": "Sepal Length",
        "yColumn": "sepal_length",
        "xAxisLabelTextOffset": xAxisLabelTextOffset,
        "yAxisLabelTextOffset": yAxisLabelTextOffset,
        "margin": margin
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
        "xAxisLabelTextOffset": xAxisLabelTextOffset,
        "yAxisLabelTextOffset": yAxisLabelTextOffset,
        "margin": margin
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
        "xAxisLabelTextOffset": xAxisLabelTextOffset,
        "yAxisLabelTextOffset": yAxisLabelTextOffset,
        "margin": margin
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
      "plugin": "heatMap",
      "state": {
        "xAxisLabelText": "Petal Length",
        "xColumn": "petal_length",
        "yAxisLabelText": "Sepal Length",
        "yColumn": "sepal_length",
        "colorColumn": "count",
        "xAxisLabelTextOffset": xAxisLabelTextOffset,
        "yAxisLabelTextOffset": yAxisLabelTextOffset,
        "margin": margin
      }
    },
    "myLinks": {
      "plugin": "links",
      "state": {
        "bindings": [
          "lineChartDataLoader.dataset -> myLineChart.dataset",
          "scatterPlotDataLoader.dataset -> myScatterPlot.dataset",
          "scatterPlotDataLoader.dataset -> myScatterPlotOrdinalX.dataset",
          "scatterPlotDataLoader.dataset -> myBoxPlot.dataset",
          "scatterPlotDataLoader.dataset -> histogramData.datasetIn",
          "scatterPlotDataLoader.dataset -> heatmapData.datasetIn",
          "barChartDataLoader.dataset -> myBarChart.dataset",
          "histogramData.datasetOut -> myHistogram.dataset",
          "heatmapData.datasetOut -> myHeatmap.dataset"
        ]
      }
    }
  });
}
myApp();
