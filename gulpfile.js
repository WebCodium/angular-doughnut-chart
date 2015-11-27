var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    del = require('del'),
    Q = require('q'),
    opn = require('opn');

var config = {
    production: !!$.util.env.production,
    sourceMaps: !$.util.env.production
}

// MAIN PATHS
var paths = {
    styles: 'src/styles/',
    scripts: 'src/js/'
}

// BUILD TARGET CONFIG
var build = {
    styles: 'dist/css',
    scripts: 'dist/js'
};

// SOURCES CONFIG
var source = {
    scripts: [
        paths.scripts + '*.js'
    ],
    styles: {
        app: [paths.styles + '*.*'],
        watch: [paths.styles + '**/*.*']
    }
};

var app = {};

app.addStyle = function (paths, outputFilename) {
    return gulp.src(paths)
        .pipe($.plumber())
        .pipe($.if(config.sourceMaps, $.sourcemaps.init()))
        .pipe($.sass())
        //I think 'autoprefixer' is a better than mixins of compass
        .pipe($.autoprefixer())
        .pipe($.if(outputFilename != undefined, $.concat(outputFilename)))
        .pipe(gulp.dest(build.styles))
        .pipe(config.production ? $.minifyCss() : $.util.noop())
        .pipe($.if(config.production, $.rename({extname: '.min.css'})))
        .pipe($.if(config.sourceMaps, $.sourcemaps.write('.')))
        .pipe(gulp.dest(build.styles))
};

app.addScript = function (paths, outputFilename) {
    return gulp.src(paths)
        .pipe($.plumber())
        .pipe($.if(config.sourceMaps, $.sourcemaps.init()))
        .pipe($.if(outputFilename != undefined, $.concat(outputFilename)))
        .pipe(gulp.dest(build.scripts))
        //jslint - problems only with no defined angular, document and window varaibles and template string of directive
        //.pipe($.jslint())
        .pipe(config.production ? $.uglify() : $.util.noop())
        .pipe($.if(config.production, $.rename({extname: '.min.js'})))
        .pipe($.if(config.sourceMaps, $.sourcemaps.write('.')))
        .pipe(gulp.dest(build.scripts));
};

// Error handler
app.handleError = function (err) {
    app.log(err.toString());
    this.emit('end');
}

// log to console using
app.log = function log(msg) {
    $.util.log($.util.colors.blue(msg));
}

var Pipeline = function () {
    this.entries = [];
};
Pipeline.prototype.add = function () {
    this.entries.push(arguments);
};
Pipeline.prototype.run = function (callable) {
    var deferred = Q.defer();
    var i = 0;
    var entries = this.entries;
    var runNextEntry = function () {
        // see if we're all done looping
        if (typeof entries[i] === 'undefined') {
            deferred.resolve();
            return;
        }
        // pass app as this, though we should avoid using "this"
        // in those functions anyways
        callable.apply(app, entries[i]).on('end', function () {
            i++;
            runNextEntry();
        });
    };
    runNextEntry();
    return deferred.promise;
};

gulp.task('styles', function () {
    var pipeline = new Pipeline();

    pipeline.add(source.styles.app, 'doughnutchart.css');

    return pipeline.run(app.addStyle);
});

gulp.task('scripts', function () {
    var pipeline = new Pipeline();

    pipeline.add(source.scripts, 'doughnutchart.js');

    return pipeline.run(app.addScript);
});

gulp.task('clean', function () {
    del.sync(build.styles);
    del.sync(build.scripts);
});

gulp.task('watch', function () {
    app.log('Starting watch');

    gulp.watch(source.scripts, ['scripts']);
    gulp.watch(source.styles.watch, ['styles']);
});

gulp.task('webserver', function () {
    gulp.src('.')
        .pipe($.serverLivereload({
            livereload: true,
            open: true
        }));
});

gulp.task('assets', ['styles', 'scripts']);

var tasks = ['clean', 'assets'];
if (!config.production) {
    tasks.push('watch');
    tasks.push('webserver');
}

gulp.task('default', tasks);