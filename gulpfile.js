// =================================================================
// Init global configurations ======================================
// =================================================================
var config = require('./config');

// =================================================================
// Public project directory and helpers ============================
// =================================================================
var public = config.publicUrl;
var modules = config.modulesUrl;
var source = config.sourceUrl;

// Lodash
var _ = require('lodash');

// =================================================================
// Public project directory ========================================
// =================================================================
// Gulp beginners guide: https://css-tricks.com/gulp-for-beginners/
var gulp = require('gulp');

// =================================================================
// Gulp Sass and Sass globbing =====================================
// =================================================================
var sass = require('gulp-sass');
var sassGlob = require('gulp-sass-glob');

// =================================================================
// CSS Post process: https://github.com/postcss/gulp-postcss =======
// =================================================================
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');

// =================================================================
// Gulp Angular Template Cache =====================================
// =================================================================
var templateCache = require('gulp-angular-templatecache');

// =================================================================
// Gulp TinyPNG and SVGmin Compress ================================
// =================================================================
var tinypng = require('gulp-tinypng-compress');
var svgmin = require('gulp-svgmin');

// =================================================================
// Gulp app.js init and concat =====================================
// =================================================================
var gls = require('gulp-live-server');
var concat = require('gulp-concat');
var minify = require('gulp-minifier');
var merge = require('merge-stream');

// =================================================================
// Tasks ===========================================================
// =================================================================

// Sass processing task
gulp.task('sass', function () {
  var sassStream,
      cssStream,
      processors = [
        autoprefixer( {browsers: ['last 4 versions']} )
      ];

  // CSS Files from NPM
  cssStream = gulp
    .src([
      modules + 'animate.css/animate.css'
    ]);

  sassStream =  gulp
    .src(source + 'scss/main.scss')
    .pipe(sassGlob())
    .pipe(sass().on('error', sass.logError));

  //merge the two streams and concatenate their contents into a single file
  return merge(cssStream, sassStream)
      .pipe(concat('main.css'))
      .pipe(postcss(processors))
      .pipe(gulp.dest(public + 'css/'));
});

// Scripts processing task
gulp.task('scripts', ['ng-templates'], function() {

  return gulp
    .src([
      modules + 'jquery/dist/jquery.js',
      source + 'js/lodash.min.js',
      modules + 'angular/angular.js',
      modules + 'angular-animate/angular-animate.js',
      modules + 'angular-sanitize/angular-sanitize.js',
      modules + 'angular-cookies/angular-cookies.js',
      modules + 'angular-scroll/angular-scroll.js',
      modules + 'angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
      modules + 'angular-ui-router/release/angular-ui-router.js',
      modules + 'pgwbrowser/pgwbrowser.js',
      source + 'ng-app/app.js',
      source + 'ng-app/conf.templates.js',
      source + 'js/templates.js', // Generated by 'ng-templates' task

      source + 'ng-app/filters/conf.filters.js',
      source + 'ng-app/filters/**/*.js',

      source + 'ng-app/services/conf.services.js',
      source + 'ng-app/services/**/*.js',

      source + 'ng-app/directives/conf.directives.js',
      source + 'ng-app/directives/form/**/*.js',

      source + 'ng-app/common/conf.common.js',
      source + 'ng-app/common/header/header.js',
      source + 'ng-app/common/footer/footer.js',

      source + 'ng-app/components/conf.home.js',
      source + 'ng-app/components/home/home.js',
    ])
    .pipe(concat('all.js', {newLine: ';'}))
    .pipe(gulp.dest(public + 'js/'));

});

// Icon fonts related
gulp.task('icons', function() { 
    return gulp
      .src(modules + 'font-awesome/fonts/**.*') 
      .pipe(gulp.dest(public + 'fonts/font-awesome')); 
});

// Images from source to public
// - https://tinypng.com/developers
// - https://www.npmjs.com/package/gulp-tinypng-compress
// - https://github.com/ben-eb/gulp-svgmin
gulp.task('images', function() { 
    var jpgPngStream = gulp
          .src(source + 'img/**/*.{png,jpg,jpeg}') 
          // .pipe(tinypng({
          //     key: '<TinyPNG API Key>',
          //     sigFile: public + 'img/.tinypng-sigs',
          //     log: true
          // }))
          ; 

    var svgStream = gulp
          .src(source + 'img/**/*.svg') 
          .pipe(svgmin());
          

    return merge(svgStream, jpgPngStream)
            .pipe(gulp.dest(public + 'img')); 
});



// Images from source to public
gulp.task('layout', function() { 
    return gulp
      .src(source + 'index.html') 
      .pipe(gulp.dest(public)); 
});



// Angular templates cache
// - https://johnpapa.net/angular-and-gulp/
// - https://www.npmjs.com/package/gulp-angular-templatecache
gulp.task('ng-templates', function() { 
    return gulp
      .src(source + 'ng-app/**/*.html') 
      .pipe(templateCache())
      .pipe(gulp.dest(source + 'js/')); 
});

// Server task (connect to Express at ./app.js)
// - https://github.com/gimm/gulp-live-server/blob/master/README.md#usage
gulp.task('default', ['dependencies'], function() {

  // Express server location with cwd args, ex. --harmony flag
  var server = gls.new([
    // '--harmony',
    'app.js'
  ],{
    env: {
      NODE_ENV: 'development'
    }
  });

  server.start();

  // Gulp watch Sass changes
  gulp.watch(source + '**/*.scss', ['sass']);

  // Gulp watch Scripts changes
  gulp.watch([
    source + '**/*.js',
    source + 'ng-app/**/*.html'
  ], ['scripts']);
  
  // Gulp layout changes
  gulp.watch(source + 'index.html', ['layout']);

  gulp.watch(
    [
      public + '**/*.css',
      public + '**/*.js',
      public + '**/*.html'
    ],

    function (file) {
      server.notify.apply(server, [file]);
    }
  );

  //Restart my server
  gulp.watch([
    'app.js',
    'config.js',
    'api/**/*.js'
  ], function() {
    server.start.bind(server)()
  });
});

// Dependencies tasks
gulp.task('dependencies', ['sass', 'scripts', 'icons', 'images', 'layout']);

// Build task - For exporting files to production
// - https://www.npmjs.com/package/gulp-minifier
gulp.task('build', ['dependencies'], function(){
  var publicStream = gulp
    .src(public + '/**/*')
    .pipe(minify({
      minify: true,
      collapseWhitespace: true,
      conservativeCollapse: true,
      minifyJS: true,
      minifyCSS: true
    }))
    .pipe(gulp.dest('build/public'));

  var appStream = gulp
    .src([
      'app.js',
      'config.js',
      'package.json'
    ])
    .pipe(minify({
      minify: true,
      collapseWhitespace: true,
      conservativeCollapse: true,
      minifyJS: true
    }))
    .pipe(gulp.dest('build'));

  var apiStream = gulp
    .src('api/**/*')
    .pipe(minify({
      minify: true,
      collapseWhitespace: true,
      conservativeCollapse: true,
      minifyJS: true
    }))
    .pipe(gulp.dest('build/api'));

  return merge(publicStream, appStream, apiStream);
});


