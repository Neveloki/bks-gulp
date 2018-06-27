import gulp from 'gulp';
import pugbem from 'gulp-pug';
import babel from 'gulp-babel';
import browserSync from 'browser-sync';
import sass from 'gulp-sass';
import cssmin from 'gulp-cssmin';
import concat from 'gulp-concat';
import rename from 'gulp-rename';
import normalize from 'node-normalize-scss';
import prefixer from 'gulp-autoprefixer';
import uglifyes from 'gulp-uglify-es';
import uglify from 'gulp-uglify';
import del from 'del';
import merge from 'merge2';
import imagemin from 'gulp-imagemin';
import mozjpeg from 'imagemin-mozjpeg';
import svgsprite from 'gulp-svg-sprite';
import svgmin from 'gulp-svgmin';
import cheerio from 'gulp-cheerio';
import replace from 'gulp-replace';
import rigger from 'gulp-rigger';
import smartgrid from 'smart-grid'
import pretty from 'gulp-html-prettify'

import config from './config/config';
import path from './config/path';
import grid from './config/grid';

const server = browserSync.create();

const clean = () => del([path.clean]);

const pug = () => {
    return gulp.src(path.src.blocks)
        .pipe(rename({dirname: ''}))
        .pipe(concat('blocks.pug'))
        .pipe(gulp.dest(path.replace.pug))
        .pipe(browserSync.stream());
};

const html = () => {
    return merge(
        gulp.src(path.src.layout)
            .pipe(rename({dirname: ''}))
            .pipe(gulp.dest(path.replace.pug)),
        gulp.src(path.src.html)
            .pipe(gulp.dest(path.replace.temp))
            .pipe(pugbem({
                pretty: false
            }))
            .pipe(pretty({indent_char: ' ', indent_size: 4}))
            .pipe(gulp.dest(path.build.html))
    )
        .pipe(browserSync.stream());
};

const scss = () => {
    return merge(
        gulp.src(path.src.scss)
            .pipe(concat('styles.scss'))
            .pipe(gulp.dest(path.replace.temp))
            .pipe(sass({includePaths: normalize.includePaths}))
            .pipe(prefixer({
                browsers: ['last 3 versions'],
                cascade: false
            })),
        gulp.src(path.src.scss)
            .pipe(concat('styles.scss'))
            .pipe(gulp.dest(path.replace.temp))
            .pipe(sass({includePaths: normalize.includePaths}))
            .pipe(prefixer({
                browsers: ['last 3 versions'],
                cascade: false
            }))
            .pipe(cssmin())
            .pipe(rename({suffix: '.min'}))
    )
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.stream());
};

const css = () => {
    return gulp.src(path.src.css)
        .pipe(concat('plugins.scss'))
        .pipe(gulp.dest(path.replace.temp))
        .pipe(sass())
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(path.build.css))
};

const js = () => {
    return merge(
        gulp.src(path.src.js)
            .pipe(rigger())
            .pipe(concat('script.js'))
            .pipe(babel()),
        gulp.src(path.src.js)
            .pipe(rigger())
            .pipe(concat('script.js'))
            .pipe(uglifyes())
            .pipe(babel())
            .pipe(rename({suffix: '.min'}))
            .pipe(uglify()),
        gulp.src(path.src.plugins)
            .pipe(rigger())
            .pipe(concat('plugins.min.js'))
    )
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.stream());
};

const img = () => {
    return merge(
        gulp.src(path.src.img)
            .pipe(rename({dirname: ''}))
            .pipe(imagemin([
                imagemin.gifsicle({interlaced: true}),
                mozjpeg({
                    quality: 85,
                    progressive: true
                }),
                imagemin.jpegtran({progressive: true}),
                imagemin.optipng({optimizationLevel: 5, bitDepthReduction: true}),
                imagemin.svgo({
                    plugins: [
                        {removeViewBox: true},
                        {cleanupIDs: true}
                    ]
                })
            ]))
            .pipe(gulp.dest(path.build.img)),
        gulp.src(path.src.content)
            .pipe(rename({dirname: ''}))
            .pipe(imagemin([
                imagemin.gifsicle({interlaced: true}),
                mozjpeg({
                    quality: 85,
                    progressive: true
                }),
                imagemin.jpegtran({progressive: true}),
                imagemin.optipng({optimizationLevel: 5, bitDepthReduction: true})
            ]))
            .pipe(gulp.dest(path.build.content))
    )
};

const sprite = () => {
    return gulp.src(path.src.sprite)
        .pipe(rename({dirname: ''}))
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        .pipe(cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
            },
            parserOptions: {xmlMode: false}
        }))
        .pipe(replace('&gt;', '>'))
        .pipe(svgsprite({
            mode: {
                inline: true,
                symbol: {
                    sprite: "../sprite.svg",
                    render: {
                        scss: {
                            dest: '../../../src/assets/sprite.scss',
                            template: "src/assets/sprite_template.scss"
                        }
                    }
                }
            }
        }))
        .pipe(gulp.dest(path.build.img))
};

const fonts = () => {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
};

function init(done) {
    smartgrid(path.replace.temp, grid);
    done();
}

function reload(done) {
    server.reload();
    done();
}

function serve(done) {
    server.init(config);
    done();
}

const watch = () => {
    gulp.watch(path.watch.html, gulp.series(html, reload));
    gulp.watch(path.watch.blocks, gulp.series(pug, html, reload));
    gulp.watch(path.watch.scss, gulp.series(scss, reload));
    gulp.watch(path.watch.js, gulp.series(js, reload));
};

const compile = gulp.parallel(fonts, img, sprite, scss, css, gulp.series(pug, html), js);
compile.description = 'Compile all sources';
const build = gulp.series(clean, init, compile);
build.description = 'Full project build';

const recompile = gulp.parallel(scss, gulp.series(pug, html), js);
recompile.description = 'Quick compile most used sources';
const rebuild = gulp.series(recompile, serve, watch);
rebuild.description = 'Quick project build';

export {
    clean,
    build,
    rebuild
}

export default rebuild;
