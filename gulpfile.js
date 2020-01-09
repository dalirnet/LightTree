// gulp
const gulp = require("gulp");
const log = require("gulplog");
const sourcemaps = require("gulp-sourcemaps");
const replace = require("gulp-replace");

// html
const htmlMin = require("gulp-htmlmin");

// style
const cleanCSS = require("gulp-clean-css");
const autoPrefixer = require("gulp-autoprefixer");
const minifyCSS = require("gulp-csso");

// script
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const babel = require("gulp-babel");
const buffer = require("vinyl-buffer");
const uglify = require("gulp-uglify");

gulp.task("html", function () {
    return gulp.src("src/index.html").pipe(htmlMin({
        collapseWhitespace: true
    })).pipe(gulp.dest("build"));
});

gulp.task("copy", function () {
    return gulp.src([
        "src/manifest.json",
        "src/browserconfig.xml",
        "src/phaser.min.js"
    ]).pipe(gulp.dest("build"));
});

gulp.task("icon", function () {
    return gulp.src(["src/icon/**"]).pipe(gulp.dest("build/icon"));
});

gulp.task("svg", function () {
    return gulp.src(["src/svg/**"]).pipe(gulp.dest("build/svg"));
});

gulp.task("css", function () {
    return gulp.src([
        "src/style.css",
    ]).pipe(cleanCSS({
        level: {
            2: {
                all: true,
                removeDuplicateRules: true
            }
        }
    })).pipe(autoPrefixer()).pipe(minifyCSS()).pipe(gulp.dest("build"));
});

gulp.task("js-debug", function () {
    return browserify({
        entries: "src/action.js",
        debug: true
    }).bundle()
        .pipe(source("action.js"))
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true
        })).on("error", log.error)
        .pipe(replace("\"@@debug\"", "true"))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("build"));
});

gulp.task("js", function () {
    return browserify({
        entries: "src/action.js",
        debug: false
    }).bundle()
        .pipe(source("action.js"))
        .pipe(buffer())
        .pipe(babel({
            presets: ["@babel/env"],
            compact: false
        }))
        .pipe(uglify()).on("error", log.error)
        .pipe(replace("\"@@debug\"", "false"))
        .pipe(gulp.dest("build"));
});

gulp.task("watch", function () {
    gulp.watch(["src/index.html"], gulp.registry().get("html"));
    gulp.watch(["src/style.css"], gulp.registry().get("css"));
    gulp.watch(["src/**/*.js"], gulp.registry().get("js-debug"));
})


gulp.task("all", gulp.parallel("html", "copy", "icon", "svg", "css", "js"));
gulp.task("default", gulp.parallel("html", "css", "js-debug", "watch"));