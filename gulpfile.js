var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var sassGlob = require("gulp-sass-glob");
var sprity = require("sprity");
var gulpif = require("gulp-if");
var tsify = require("tsify");
var babelify = require("babelify");
var browserify = require("browserify");
var exorcist = require("exorcist");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var uglify = require("gulp-uglify");
var watchify = require("watchify");
var gutil = require("gulp-util");


gulp.task("build:styles", function () {
    return gulp.src("./views/style.scss")
        .pipe(sourcemaps.init())
        .pipe(sassGlob())
        .pipe(sass().on("error", sass.logError))
        .pipe(sourcemaps.write(".", { sourceRoot: "../app/views" }))
        .pipe(gulp.dest("../resources"));
});


gulp.task("build:sprites", function () {
    return sprity.src({
            src: "./icons/**/*.png",
            style: "sprites.scss",
            processor: "sass",
            "style-type": "scss",
            cssPath: "/resources/images",
            margin: 0,
            orientation: "binary-tree"
        })
        .pipe(gulpif("*.png", gulp.dest("../resources/images"), gulp.dest("./views")));
});


gulp.task("watch", function () {
    gulp.watch("./views/**/*.scss", ["build:styles"]);
    gulp.watch("./icons/**/*.png", ["build:sprites"]);
});


var bundle = watchify(browserify({ cache: {}, packageCache: {}, debug: true }))
    .plugin(tsify)
    .transform(babelify, {
        presets: ["es2015"],
        plugins: ["transform-runtime"],
        extensions: [".ts"]
    })
    .require([{ file: "./MlistingInitializer.ts", expose: "MlistingInitializer" }]);

function bundleApp() {
    return bundle
        .bundle()
        .on("error", gutil.log.bind(gutil, "Browserify Error"))
        .pipe(exorcist("../resources/app.js.map"))
        .pipe(source("app.js"))
        .pipe(buffer())
        .pipe(gulp.dest("../resources"));
}

gulp.task("build:dev", bundleApp);
bundle.on("update", bundleApp);
bundle.on("log", gutil.log);