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
  var xAxisLabelTextOffset = 6;
  var yAxisLabelTextOffset = 15;
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
                {
                  "orientation": "vertical",
                  "children": [
                    "myHeatmapOrdinal",
                    "myHeatmapOrdinalY"
                  ]
                },
                {
                  "orientation": "vertical",
                  "children": [
                    "myScatterPlotTimeX",
                    "myLineChart"
                  ]
                }
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
        "margin": margin,

        // This tests that it is possible to specify a set of sides for the editor.
        "marginEditor": ["left"]
      }
    },
    "scatterPlotDataLoader": {
      "plugin": "dsvDataset",
      "state": {
        "path": "iris"
      }
    },
    "myScatterPlot": {
      "plugin": "scatterPlot",
      "state": {
        "xAxisLabelText": "Petal Width",
        "xColumn": "petal_width",
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
        "xAxisLabelText": "Species",
        "xColumn": "species",
        "yAxisLabelText": "Petal Length",
        "yColumn": "petal_length",
        "circleRadius": 20,
        "fill": "rgba(100, 0, 0, 0.1)",
        "xAxisLabelTextOffset": xAxisLabelTextOffset,
        "yAxisLabelTextOffset": yAxisLabelTextOffset,
        "margin": margin
      }
    },
    "myScatterPlotTimeX": {
      "plugin": "scatterPlot",
      "state": {
        "xAxisLabelText": "Time",
        "xColumn": "timestamp",
        "yAxisLabelText": "Temperature",
        "yColumn": "temperature",
        "circleRadius": 2,
        "xAxisLabelTextOffset": xAxisLabelTextOffset,
        "yAxisLabelTextOffset": yAxisLabelTextOffset,
        "margin": margin
      }
    },
    "myBoxPlot": {
      "plugin": "boxPlot",
      "state": {
        "xAxisLabelText": "Species",
        "xColumn": "species",
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
        "fill": "#1EABE8",
        "stroke": "#008CC8",
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
    "heatmapOrdinalData": {
      "plugin": "dataReduction",
      "state": {
        "aggregate": {
          "dimensions": [
            {
              "column": "petal_length",
              "histogram": true,
              "numBins": 15
            },
            {
              "column": "species"
            }
          ],
          "measures": [{
            "outColumn": "count", 
            "operator": "count"
          }]
        }
      }
    },
    "myHeatmapOrdinal": {
      "plugin": "heatMap",
      "state": {
        "xAxisLabelText": "Species",
        "xColumn": "species",
        "yAxisLabelText": "Petal Length",
        "yColumn": "petal_length",
        "colorColumn": "count",
        "xAxisLabelTextOffset": xAxisLabelTextOffset,
        "yAxisLabelTextOffset": yAxisLabelTextOffset,
        "margin": margin
      }
    },
    "myHeatmapOrdinalY": {
      "plugin": "heatMap",
      "state": {
        "xAxisLabelText": "Petal Length",
        "xColumn": "petal_length",
        "yAxisLabelText": "Species",
        "yColumn": "species",
        "colorColumn": "count",
        "xAxisLabelTextOffset": xAxisLabelTextOffset,
        "yAxisLabelTextOffset": yAxisLabelTextOffset,
        "margin": { top: 10, right: 10, bottom: 40, left: 75 }
      }
    },
    "myLinks": {
      "plugin": "links",
      "state": {
        "bindings": [
          "lineChartDataLoader.dataset -> myLineChart.dataset",
          "lineChartDataLoader.dataset -> myScatterPlotTimeX.dataset",
          "scatterPlotDataLoader.dataset -> myScatterPlot.dataset",
          "scatterPlotDataLoader.dataset -> myScatterPlotOrdinalX.dataset",
          "scatterPlotDataLoader.dataset -> myBoxPlot.dataset",
          "scatterPlotDataLoader.dataset -> histogramData.datasetIn",
          "scatterPlotDataLoader.dataset -> heatmapData.datasetIn",
          "scatterPlotDataLoader.dataset -> heatmapOrdinalData.datasetIn",
          "barChartDataLoader.dataset -> myBarChart.dataset",
          "histogramData.datasetOut -> myHistogram.dataset",
          "heatmapData.datasetOut -> myHeatmap.dataset",
          "heatmapOrdinalData.datasetOut -> myHeatmapOrdinal.dataset",
          "heatmapOrdinalData.datasetOut -> myHeatmapOrdinalY.dataset"
        ]
      }
    }
  });
}
myApp();
