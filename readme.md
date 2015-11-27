# Doughnut chart

Before you run `gulp` command in console you need run `npm install` and `bower install`.
You need run `gulp` every time if you want to look for (watch) the project.
You need run `gulp server` if you want to run the project in your browser.
Run `gulp --production` for minifying and uglifying scripts and styles.

## Install

Include Angular and [doughnutchart.min.js](https://raw.githubusercontent.com/WebCodium/angular-doughnut-chart/master/dist/js/doughnutchart.min.js) or [doughnutchart.js](https://raw.githubusercontent.com/WebCodium/angular-doughnut-chart/master/dist/js/doughnutchart.js) in your page. You can use bower:

`bower install angular-doughnut-chart`

Add `angular-svg-round-progress` to your app's module dependencies:

```javascript
angular.module('someModule', ['angular-doughnut-chart'])
```

Iclude [doughnutchart.min.css](https://raw.githubusercontent.com/WebCodium/angular-doughnut-chart/master/dist/css/doughnutchart.min.css) or [doughnutchart.css](https://raw.githubusercontent.com/WebCodium/angular-doughnut-chart/master/dist/css/doughnutchart.css) stylesheet in your page.

## Options

| Name           | Description           | Required  | Default value     | Possible values   |
| ---            | ---                   | ---       | ---               | ---               |
| `percentage`      | The current progress. | Yes       | undefined         | Integer           |

### Example:

```html
<doughnut-chart
    percentage="50">
</doughnut-chart>
```

Author: yura.l@webcodium.com