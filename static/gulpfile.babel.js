'use strict';

import gulp from 'gulp';
import sass from 'gulp-dart-sass';
import cleanCss from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';
import queries from 'gulp-group-css-media-queries';
import plumber from 'gulp-plumber';
import sourcemaps from 'gulp-sourcemaps';
import del from 'del';
import path from 'path';
import gulpif from 'gulp-if';
import useref from 'gulp-useref';
import uglify from 'gulp-uglify';
import babel from 'gulp-babel';
import fileinclude from 'gulp-file-include';
import cachebust from 'gulp-cache-bust';

const ISDEVELOPMENT = (process.env.NODE_ENV === 'production') ? 'production' : process.env.NODE_ENV;

const PATHS = {
  dev: './dev',
  dist: './dist'
};

const TASK_PATHS = {
  sass: {
    src: PATHS.dev + '/scss/**/*.{scss,sass}',
    dest: PATHS.dist + '/css/'
  },
  html: {
    all: PATHS.dev + '/**/*.html',
    src: PATHS.dev + '/*.html',
    dest: PATHS.dist + '/'
  },
  assets: {
    all: PATHS.dev + '/assets/',
    src: PATHS.dev + '/assets/**',
    dest: PATHS.dist + '/'
  },
  javascript: {
    src: PATHS.dev + '/js/**/*.js',
    dest: PATHS.dist + '/js/'
  },
  server: {
    base: PATHS.dist + '/'
  }
};

/* TASK SASS */
gulp.task('sass', () => {
  return gulp.src(TASK_PATHS.sass.src)
    .pipe(plumber())
    .pipe(gulpif(ISDEVELOPMENT === 'development', sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(queries())
    .pipe(autoprefixer({
      overrideBrowserslist: ['since 2013'],
      cascade: false
    }))
    .pipe(gulpif(ISDEVELOPMENT !== 'development', cleanCss({
      format: (process.env.NODE_ENV === 'production') ? false : 'beautify'
    })))
    .pipe(gulpif(ISDEVELOPMENT === 'development', sourcemaps.write('.')))
    .pipe(gulp.dest(TASK_PATHS.sass.dest));
});

/* TASK HTML */
gulp.task('html', () => {
  return gulp.src(TASK_PATHS.html.src)
    .pipe(plumber())
    .pipe(fileinclude({
      prefix: '@',
      suffix: ';',
      indent: true
    }))
    .pipe(useref())
    .pipe(gulpif(ISDEVELOPMENT === 'production' && '*.js', uglify()))
    .pipe(gulpif(ISDEVELOPMENT !== 'development' && '*.css', cleanCss({
      format: (process.env.NODE_ENV === 'production') ? false : 'beautify'
    })))
    .pipe(cachebust({
      type: 'timestamp'
    }))
    .pipe(gulp.dest(TASK_PATHS.html.dest));
});

/* TASK ASSETS */
gulp.task('assets', () => {
  return gulp.src(TASK_PATHS.assets.src)
    .pipe(gulp.dest(TASK_PATHS.assets.dest));
});

/* TASK JAVASCRIPT */
gulp.task('javascript', () => {
  return gulp.src(TASK_PATHS.javascript.src)
    .pipe(plumber())
    .pipe(babel({
      retainLines: true
    }))
    .pipe(gulpif(ISDEVELOPMENT === 'production', uglify()))
    .pipe(gulp.dest(TASK_PATHS.javascript.dest));
});

/* TASK REMOVE:FOLDER */
gulp.task('remove:folder', () => {
  return del([PATHS.dist]);
});

/* TASK WATCH */
gulp.task('watch', () => {
  gulp.watch(TASK_PATHS.sass.src, gulp.series('sass'));
  gulp.watch(TASK_PATHS.html.all, gulp.series('html'));
  gulp.watch(TASK_PATHS.assets.src, gulp.series('assets'))
      .on('unlink', filepath => {
        let filepathFromSrc = path.relative(path.resolve(TASK_PATHS.assets.all), filepath),
            destFilePath = path.resolve(PATHS.dist + '/', filepathFromSrc);

        del.sync(destFilePath);
      })
      .on('unlinkDir', filepath => {
        let filepathFromSrc = path.relative(path.resolve(TASK_PATHS.assets.all), filepath),
            destFilePath = path.resolve(PATHS.dist + '/', filepathFromSrc);

        del.sync(destFilePath);
      });
  gulp.watch(TASK_PATHS.javascript.src, gulp.series('javascript'));
});

/* TASK DIST */
gulp.task('dist', gulp.series('remove:folder', gulp.parallel('sass', 'html', 'assets', 'javascript')));

/* TASK DEFAULT */
if (ISDEVELOPMENT !== 'development') {
  gulp.task('default', gulp.series('dist'));
} else {
  gulp.task('default', gulp.series('dist', gulp.parallel('watch')));
}