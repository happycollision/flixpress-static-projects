// generated on 2015-10-05 using generator-gulp-webapp 1.0.3

// node_modules requires:
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';
import rs from 'run-sequence';
import rename from 'gulp-rename';
const argv = require('yargs').argv;

// NodeJS level requires:
import fs from 'fs';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

const pathToMediaRobot = argv.basePath.replace(/\\/g, '/');


// /* I am doing this slightly different than suggested at https://github.com/nkostelnik/gulp-s3
//    With my version, only the Key and Secret are in the JSON file. I can define the
//    bucket here.

//    The aws.json file ought to look like this:

//    {
//   "key": "SOMETHING",
//   "secret": "SOMETHING ELSE"
//    }
// */
// var aws = JSON.parse(fs.readFileSync('./aws.json'));
// aws.bucket = 'FlixSamples';
// const awsCredentials = aws;
// const awsOptions = {uploadPath: "development_files/Scripts/flixpress-js/"}

gulp.task('styles', (cb) => {
  return gulp.src('src/sass/*.{scss,sass}')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass({ outputStyle: 'expanded' }).on('error', function(err){cb(err);}))
    .pipe($.autoprefixer({browsers: ['last 10 versions']}))
    // .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/'))
    .pipe(reload({stream: true}));
});

function replaceOnDisk (begStr, endStr, insertFile, destFile, destDir) {
  var beginningString = begStr || '/* Hi */';
  var endingString = endStr || '/* There */';
  var srcFile = destFile || '.tmp/dest.txt';
  var insert; // becomes the inserted string later

  if (srcFile === '.tmp/dest.txt'){
    fs.writeFileSync('.tmp/dest.txt', beginningString + "\n\n" + endingString);
  }
  if (!insertFile){
    fs.writeFileSync('.tmp/fake.txt', "\n Hello again \n");
  }
  insert = insertFile ? fs.readFileSync(insertFile) : fs.readFileSync('.tmp/fake.txt');


  // keep destDir null if src and dest are the same
  if (!destDir) {
    destDir = srcFile.split('/').slice(0,-1).join('/');
  }
  // Auto escape literal strings
  RegExp.quote = function(str) {
    return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
  };
  var beginningStringEsc = RegExp.quote(beginningString);
  var endingStringEsc = RegExp.quote(endingString);

  // RegExp created siwth strings need to escape all backslashes
  // Hence the two slashes where you'd normally see one in the
  // string below.
  var regex2 = new RegExp(`${beginningStringEsc}([^]*)${endingStringEsc}`);

  fs.readFile(pathToMediaRobot + srcFile, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    var result = data.replace(regex2, `${beginningString}\n\n${insert}\n\n${endingString}`);

    fs.writeFile(pathToMediaRobot + srcFile, result, 'utf8', function (err) {
       if (err) return console.log(err);
    });
  });
  return;
};

// Plan Slider stuff
gulp.task('replacePlanCssLive', ['styles'], () => {
  return replaceOnDisk(
    '/* plan-slider.css build:begin */',
    '/* plan-slider.css build:end */',
    '.tmp/plan-slider.css',
    '/Portals/_default/Skins/Fusion/css/default.css');
});

// Plan Slider stuff
gulp.task('replaceHelperCssLive', ['styles'], () => {
  return replaceOnDisk(
    '/* helpers-and-blocks.css build:begin */',
    '/* helpers-and-blocks.css build:end */',
    '.tmp/helpers-and-blocks.css',
    '/Portals/_default/Skins/Fusion/css/default.css');
});

// many styles for individual pages
gulp.task('replaceSpecificPagesCssLive', ['styles'], () => {
  return replaceOnDisk(
    '/* specific-pages.css build:begin */',
    '/* specific-pages.css build:end */',
    '.tmp/specific-pages.css',
    '/Portals/_default/Skins/Fusion/css/default.css');
});

// pricing css stuff
gulp.task('replacePricingCssLive', ['styles'], () => {
  return replaceOnDisk(
    '/* price-grid.css build:begin */',
    '/* price-grid.css build:end */',
    '.tmp/pricing-grid.css',
    '/Portals/_default/Skins/Fusion/css/pricing-grid.css');
});

// template browser css stuff
gulp.task('replaceTemplateBrowserCssLive', ['styles'], () => {
  return replaceOnDisk(
    '/* template-browser.css build:begin */',
    '/* template-browser.css build:end */',
    '.tmp/template-browser.css',
    '/Portals/_default/Skins/Fusion/css/default.css');
});

// Info sliders stuff
gulp.task('replaceSliderCssLive', ['styles'], () => {
  return replaceOnDisk(
    '/* slider.css build:begin */',
    '/* slider.css build:end */',
    '.tmp/sliding.css',
    '/Portals/_default/Skins/Fusion/css/default.css');
});

// React Basic Template Editor
gulp.task('replaceEditorCssLive', ['styles'], () => {
  return replaceOnDisk(
    '/* no-flash-editor.css build:begin */',
    '/* no-flash-editor.css build:end */',
    '.tmp/no-flash-editor.css',
    '/templates/Styles/editor.css');
});

// JS Image Selection Screen
gulp.task('replaceImageSelectionCssLive', ['styles'], () => {
  return replaceOnDisk(
    '/* images-selection.css build:begin */',
    '/* images-selection.css build:end */',
    '.tmp/images-selection.css',
    '/templates/Styles/images-selection.css');
});

// Common Template Styles
gulp.task('replaceCommonTemplateCssLive', ['styles'], () => {
  return replaceOnDisk(
    '/* common-template-styles.css build:begin */',
    '/* common-template-styles.css build:end */',
    '.tmp/common-template-styles.css',
    '/templates/Styles/common-styles.css');
});

gulp.task('replaceSliderHtmlLive', () => {
  return replaceOnDisk(
    '<!-- slider.html build:begin -->',
    '<!-- slider.html build:end -->',
    'src/_sliding-part.html',
    '/Portals/_default/Skins/Fusion/CommonParts/TargetAudienceSliders.ascx');
});

gulp.task('replaceSliderJsLive', () => {
  return replaceOnDisk(
    '/*/ slider.js build:begin /*/',
    '/*/ slider.js build:end /*/',
    'src/_sliding-part.js',
    '/Portals/_default/Skins/Fusion/CommonParts/TargetAudienceSliders.ascx');
});

gulp.task('replaceSliderJsLocal', () => {
  return replaceOnDisk(
    '/*/ slider.js build:begin /*/',
    '/*/ slider.js build:end /*/',
    'src/_sliding-part.js',
    '.tmp/sliding.html');
});

gulp.task('replaceSliderHtmlLocal', () => {
  return replaceOnDisk(
    '<!-- slider.html build:begin -->',
    '<!-- slider.html build:end -->',
    'src/_sliding-part.html',
    '.tmp/sliding.html');
});

gulp.task('replaceSliderLocal', () => {
  rs('replaceSliderHtmlLocal','replaceSliderJsLocal')
});

gulp.task('devServer', () => {
  if (!pathToMediaRobot) {
    console.log('You must specify a path with something like `npm run css -- --base-path=/Volumes/MediaRobot` on Mac or `npm run css -- --base-path=\\\\DEVOLVED-SERVER\\Sites\\Andrey` on Windows');
    process.exit();
  }

  gulp.watch('src/sass/template-browser.{scss,sass}', ['replaceTemplateBrowserCssLive']);
  gulp.watch('src/sass/pricing-grid.{scss,sass}', ['replacePricingCssLive']);
  gulp.watch(['src/sass/specific-pages.{scss,sass}','src/sass/specific-pages/*'], ['replaceSpecificPagesCssLive']);
  gulp.watch('src/sass/plan-slider.{scss,sass}', ['replacePlanCssLive']);
  gulp.watch('src/sass/helpers-and-blocks.{scss,sass}', ['replaceHelperCssLive']);
  gulp.watch('src/sass/sliding.{scss,sass}', ['replaceSliderCssLive']);
  gulp.watch('src/sass/no-flash-editor.{sass,scss}', ['replaceEditorCssLive']);
  gulp.watch('src/sass/images-selection.{sass,scss}', ['replaceImageSelectionCssLive']);
  gulp.watch('src/sass/common-template-styles.{scss,sass}', ['replaceCommonTemplateCssLive']);
  gulp.watch('src/_sliding-part.js', ['replaceSliderJsLive']);

  // THE FOLLOWING FILES HAVE DIVERGED ON THE SERVER.
  // Do not update here without pulling in the changes.
  // (The build tags were removed on the server, too, to avoid issues.)
  //// gulp.watch('src/_sliding-part.html', ['replaceSliderHtmlLive']);
});

gulp.task('reactDev', () => {
  gulp.watch('src/sass/no-flash-editor.{sass,scss}', ['replaceInReact'])
});
gulp.task('replaceInReact', ['styles'],()=>{
  return gulp.src('.tmp/no-flash-editor.css')
    .pipe(rename('editor.css'))
    .pipe(gulp.dest('/Users/Don/Documents/Current Projects/reactTextOnly/src/styles'));
});

gulp.task('serve', ['styles'/*, 'fonts'*/], () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'src'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.src(['src/sliding.html']).pipe(gulp.dest('.tmp/'));

  rs('replaceSliderLocal');

  gulp.watch('src/*-part*', ['replaceSliderLocal']);

  gulp.watch([
    'src/*.html',
    'src/**/*.js',
    'src/images/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', reload);

  gulp.watch('src/sass/**/*.{scss,sass}', ['styles']);
  // gulp.watch('src/fonts/**/*', ['fonts']);
  // gulp.watch('bower.json', ['wiredep', 'fonts']);
});

