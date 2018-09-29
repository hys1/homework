var gulp = require('gulp');
var sass = require('gulp-sass');
var mincss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var server = require('gulp-webserver');
var path = require('path');
var fs = require('fs');
var data = require('./src/data/data.json');


//编译scss
gulp.task('devCss', function() {
    return gulp.src('./src/sass/*.scss')
        .pipe(sass())
        .pipe(mincss())
        .pipe(gulp.dest('./src/css'))
})

//合并js
gulp.task('devJs', function() {
    return gulp.src('./src/maxjs/*.js')
        .pipe(uglify())
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./src/js'))
})

//监听
gulp.task('watch', function() {
    return gulp.watch(['./src/sass/*.scss', './src/maxjs/*.js'], gulp.parallel(['devCss', 'devJs']))
})

//起服务
gulp.task('server', function() {
    return gulp.src('./src')
        .pipe(server({
            port: 8080,
            middleware: function(req, res, next) {
                console.log(req.url);
                var pathname = require('url').parse(req.url).pathname;
                if (pathname === '/favicon.ico' || pathname === '/js/libs/swiper.min.js.map') {
                    res.end();
                    return
                } else if (pathname === '/') {
                    res.end(fs.readFileSync(path.join(__dirname, 'src', 'index.html')))
                } else {
                    var extname = path.extname(pathname);
                    if (extname) {
                        res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)))
                    } else {
                        if (pathname === '/data') {
                            res.end(JSON.stringify(data));
                        }
                    }
                }


                res.end('123');
            }
        }))
})

//整合
gulp.task('dev', gulp.series('devCss', 'devJs', 'server', 'watch'))