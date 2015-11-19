# chiasm-charts

Reusable data visualization components.

<a href="http://bl.ocks.org/curran/5e3c1bed7c9cdd2b431c">
<img align="right" src="http://bl.ocks.org/curran/raw/5e3c1bed7c9cdd2b431c/thumbnail.png">
</a>The beginnings of this library are explained in this [video tutorial: Introduction to Chiasm](https://www.youtube.com/watch?v=MpweS7gNBt4). This video tutorial ends with this [code example: Reactive Mixins for Visualizations](http://bl.ocks.org/curran/5e3c1bed7c9cdd2b431c).

## Developing

To get set up with your development, clone this repository and install dependencies with these commands.

```shell
git clone git@github.com:chiasm-project/chiasm-charts.git
cd chiasm-charts
npm install
```

After that, the NPM scripts available to you are

 * "build" - compiles the test application (under `/test`)
 * "serve" - serves the test application

```
npm run build
> chiasm-charts@0.0.1 build /Users/curran/repos/chiasm-charts
> cd test; browserify main.js | uglifyjs > main-build.js

npm run serve
> chiasm-charts@0.0.1 serve /Users/curran/repos/chiasm-charts
> cd test; http-server
Starting up http-server, serving ./ on: http://0.0.0.0:8080
Hit CTRL-C to stop the server
```
