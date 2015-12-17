# chiasm-charts

Reusable data visualization components for [Chiasm](https://github.com/chiasm-project/chiasm).

The beginnings of this library are explained in this [video tutorial: Introduction to Chiasm](https://www.youtube.com/watch?v=MpweS7gNBt4). This video tutorial ends with this [code example: Reactive Mixins for Visualizations](http://bl.ocks.org/curran/5e3c1bed7c9cdd2b431c).

## Examples

| thumbnail | description  |
|---|---|
| [![](http://bl.ocks.org/curran/raw/4b18d7b107c0e5b97407/thumbnail.png)](http://bl.ocks.org/curran/4b18d7b107c0e5b97407) | Chiasm-Charts v0.1.5 |
| [![](http://bl.ocks.org/curran/raw/9938078a93a4ba380a0e/thumbnail.png)](http://bl.ocks.org/curran/9938078a93a4ba380a0e) | Interactive Scatter Plot with selectable X, Y columns. |
| [![](http://bl.ocks.org/curran/raw/46050d18d5ec1ab401fa/thumbnail.png)](http://bl.ocks.org/curran/46050d18d5ec1ab401fa) | Chiasm-Charts v0.1.0 |

## Developing

To get set up with your development, clone this repository and install dependencies with these commands.

```shell
git clone git@github.com:chiasm-project/chiasm-charts.git
cd chiasm-charts
npm install
```

After that, you can launch the visual test suite with the command:

```
npm run serve-tests
```

This will launch an instance of [live-server](https://github.com/tapio/live-server), which will automatically re-load the page every time you build the test application bundle. To build the bundle, run

```
npm run build
```

This will build the test application, which you can then inspect in the browser window open to the visual test page. This serves as the unit test suite for chiasm-charts.
