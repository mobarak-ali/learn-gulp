const { src, dest, series, parallel,watch } = require('gulp');
const del = require('del');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');

const babel = require('gulp-babel');
const concatenate = require('gulp-concat');

const origin = 'src';
const build = 'build';

sass.compiler = require('node-sass');

// Sass.compiler = require('node-sass');

async function clean(cb){
    await del(build);
    cb();
}

function html(cb){
    src(`${origin}/**/*.html`)
    .pipe(dest(build));
    cb();
}
function css(cb){
    src(`${origin}/css/lib/*.css`).pipe(dest(`${build}/css`));

    src([`${origin}/css/lib/*.scss`, `${origin}/css/style.scss`])
    .pipe(sass({
        outputStyle : 'compressed'
    }))
    .pipe(dest(`${build}/css`));
    cb();
}
function js(cb){
    src(`${origin}/js/lib/**/*.js`).pipe(dest(`${build}/js`));

    src([
        `${origin}/js/custom.js`,
        `${origin}/js/*.js`
    ])
    .pipe(babel({
        compact:true,// minify the code
        presets: ['@babel/env']
    }))
    .pipe(concatenate('script.js')) //concatinate 2 or more files
    .pipe(dest(`${build}/js`));

    cb();
}

function server(cb){
    browserSync.init({
        // notify:false,
        open: false,
        server: {
            baseDir : build
        }
    })
    cb();
}

function watcher(cb){
    watch(`${origin}/**/*.html`).on("change", series(html,browserSync.reload));
    watch(`${origin}/**/*.scss`).on("change", series(css,browserSync.reload));
    watch(`${origin}/**/*.js`).on("change", series(js,browserSync.reload));
    cb();
}

// 
// exports.html = html;
// exports.css = css;
// exports.js = js;
exports.default = series(clean,parallel( html, css, js), server, watcher);

