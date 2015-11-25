# Doughnut chart

Before you run ```gulp``` command in console you need run ```npm update``` (no bower depedencies).
You need run ```gulp``` every time if you want to look for (watch) the project.
Run ```gulp --production``` for minifying and uglifying scripts and styles.

## Install

Include Angular and ```doughnutchart.min.js``` or ```doughnutchart.js``` in your page. You can use bower:

`bower install angular-doughnut-chart`

Add `angular-svg-round-progress` to your app's module dependencies:

```javascript
angular.module('someModule', ['angular-doughnut-chart'])
```

Iclude ```doughnutchart.min.css``` or ```doughnutchart.css``` stylesheet in your page.

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