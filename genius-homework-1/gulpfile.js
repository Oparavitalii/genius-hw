// see video explanation: https://youtu.be/ubHwScDfRQA

const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass")); // This is different from the video since gulp-sass no longer includes a default compiler. Install sass as a dev dependency `npm i -D sass` and change this line from the video.
const prefix = require("gulp-autoprefixer");
const minify = require("gulp-clean-css");
const terser = require("gulp-terser");
const imagemin = require("gulp-imagemin");
const htmlmin = require("gulp-htmlmin");
const fileInclude = require("gulp-file-include");
const imagewebp = require("gulp-webp");
const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const babel = require("gulp-babel");
var ttf2woff2 = require("gulp-ttf2woff2");

//compile, prefix, and min scss
function compileScss() {
  return src("src/scss/*.scss") // change to your source directory
    .pipe(sass())
    .pipe(prefix("last 2 versions"))
    .pipe(minify())
    .pipe(dest("dist/css"))
    .pipe(browserSync.stream());
}
//compile html
function compileHtml() {
  return src("src/*.html")
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest("dist"))
    .pipe(browserSync.stream());
}
//optimize and move images
function optimizeImg() {
  return src("src/images/*.{jpg,png}") // change to your source directory
    .pipe(
      imagemin([
        imagemin.mozjpeg({ quality: 80, progressive: true }),
        imagemin.optipng({ optimizationLevel: 2 }),
      ])
    )
    .pipe(dest("dist/images")); // change to your final/public directory
}

//optimize and move images
function webpImage() {
  return src("dist/images/*.{jpg,png}") // change to your source directory
    .pipe(imagewebp())
    .pipe(dest("dist/images")); // change to your final/public directory
}
//ttf to woff 
function fontsWoff() {
  return gulp.src(["./src/fonts/*.ttf"]).pipe(ttf2woff2()).pipe(gulp.dest("./dist/fonts/"));
}

// minify js
function compileJs() {
  return src("src/js/*.js") // change to your source directory
    .pipe(terser())
    .pipe(dest("dist/js"))
    .pipe(browserSync.stream()); // change to your final/public directory
}
// babel transpiling

function babelTranspiling() {
  return src("src/js/*.js") // change to your source directory
    .pipe(
      babel({
        presets: ["@babel/env"], // the minimum presets needed to make gulp-babel work in babel 7 - https://github.com/babel/gulp-babel/tree/v7-maintenance
      })
    )
    .pipe(dest("dist/js"));
}

//watchtask

function browsSync() {
  browserSync.init({
    server: {
      baseDir: "dist/",
    },
  });
  gulp.watch("src/scss/**/*.scss", compileScss); // change to your source directory
  gulp.watch("src/components/*/*.scss", compileScss); // change to your source directory
  gulp.watch("src/js/*.js", compileJs); // change to your source directory
  gulp.watch("src/images/*", optimizeImg); // change to your source directory
  gulp.watch("src/fonts/*.ttf", fontsWoff); // change to your source directory
  gulp.watch("src/*.html", compileHtml); // change to your source directory
  gulp.watch("dist/images/*.{jpg,png}", webpImage); //
  gulp.watch("src/*.html").on("change", browserSync.reload);
  gulp
    .watch("src/components/*/*.html", compileHtml)
    .on("change", browserSync.reload); // Watch changes in included HTML files
}

exports.default = series(
  compileScss,
  babelTranspiling,
  compileJs,
  compileHtml,
  optimizeImg,
  webpImage,
  fontsWoff,
  browsSync
);
