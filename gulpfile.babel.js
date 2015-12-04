// generated on 2015-10-05 using generator-gulp-webapp 1.0.3

// node_modules requires:
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';
// import {stream as wiredep} from 'wiredep';

// NodeJS level requires:
import fs from 'fs';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

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
    .pipe($.compass({
      outputStyle: 'expanded',
      precision: 10,
      css: '.tmp/.css',
      sass: 'src/sass',
      require: ['susy','breakpoint']
    }).on('error', function(err){cb(err);}))
    .pipe($.autoprefixer({browsers: ['last 10 versions']}))
    .pipe($.sourcemaps.write())
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
  return gulp.src(srcFile)
    .pipe($.replace(regex2, (match, p1, offset, string) => {
      return `${beginningString}\n\n${insert}\n\n${endingString}`;
    }))
    .pipe(gulp.dest(destDir));
};

// Plan Slider stuff
gulp.task('replacePlanCssLive', ['styles'], () => {
  replaceOnDisk(
    '/* plan-slider.css build:begin */',
    '/* plan-slider.css build:end */',
    '.tmp/plan-slider.css',
    '/Volumes/MediaRobot/Portals/_default/Skins/Fusion/css/default.css');
});

// incentive stuff
gulp.task('replaceIncentiveCssLive', ['styles'], () => {
  replaceOnDisk(
    '/* incentives.css build:begin */',
    '/* incentives.css build:end */',
    '.tmp/incentives.css',
    '/Volumes/MediaRobot/Portals/_default/Skins/Fusion/css/default.css');
});

// pricing css stuff
gulp.task('replacePricingCssLive', ['styles'], () => {
  replaceOnDisk(
    '/* price-grid.css build:begin */',
    '/* price-grid.css build:end */',
    '.tmp/pricing-grid.css',
    '/Volumes/MediaRobot/Portals/_default/Skins/Fusion/css/pricing-grid.css');
});

// template browser css stuff
gulp.task('replaceTemplateBrowserCssLive', ['styles'], () => {
  replaceOnDisk(
    '/* template-browser.css build:begin */',
    '/* template-browser.css build:end */',
    '.tmp/template-browser.css',
    '/Volumes/MediaRobot/Portals/_default/Skins/Fusion/css/default.css');
});

// Info sliders stuff
gulp.task('replaceSliderCssLive', ['styles'], () => {
  replaceOnDisk(
    '/* slider.css build:begin */',
    '/* slider.css build:end */',
    '.tmp/sliding.css',
    '/Volumes/MediaRobot/Portals/_default/Skins/Fusion/css/default.css');
});

gulp.task('replaceSliderHtmlLive', () => {
  replaceOnDisk(
    '<!-- slider.html build:begin -->',
    '<!-- slider.html build:end -->',
    'src/_sliding-part.html',
    '/Volumes/MediaRobot/Portals/_default/Skins/Fusion/HomePage.ascx');
});

gulp.task('replaceSliderJsLive', () => {
  replaceOnDisk(
    '<!-- slider.js build:begin -->',
    '<!-- slider.js build:end -->',
    'src/_sliding-part-js.html',
    '/Volumes/MediaRobot/Portals/_default/Skins/Fusion/HomePage.ascx');
});

gulp.task('localhost', () => {
  gulp.watch('src/sass/*.{scss,sass}', ['replaceTemplateBrowserCssLive']);
  gulp.watch('src/sass/*.{scss,sass}', ['replacePricingCssLive']);
  gulp.watch('src/sass/*.{scss,sass}', ['replaceIncentiveCssLive']);
  gulp.watch('src/sass/*.{scss,sass}', ['replacePlanCssLive']);
  gulp.watch('src/sass/*.{scss,sass}', ['replaceSliderCssLive']);
  
  // THE FOLLOWING FILES HAVE DIVERGED ON THE SERVER.
  // Do not update here without pulling in the changes.
  // (The build tags were removed on the server, too, to avoid issues.)
  //// gulp.watch('src/_sliding-part.html', ['replaceSliderHtmlLive']);
  //// gulp.watch('src/_sliding-part-js.html', ['replaceSliderJsLive']);
});

// function lint(files, options) {
//   return () => {
//     return gulp.src(files)
//       .pipe(reload({stream: true, once: true}))
//       .pipe($.eslint(options))
//       .pipe($.eslint.format())
//       .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
//   };
// }
// const testLintOptions = {
//   env: {
//     mocha: true
//   }
// };

// gulp.task('lint', lint('app/**/*.js'));
// gulp.task('lint:test', lint('test/spec/**/*.js', testLintOptions));

// gulp.task('html', ['styles'], () => {
//   const assets = $.useref.assets({searchPath: ['.tmp', 'app', '.']});

//   return gulp.src('app/*.html')
//     .pipe(assets)
//     .pipe($.if('*.js', $.uglify()))
//     .pipe($.if('*.css', $.minifyCss({compatibility: '*'})))
//     .pipe(assets.restore())
//     .pipe($.useref())
//     .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
//     .pipe(gulp.dest('dist'));
// });

// gulp.task('images', () => {
//   return gulp.src('app/images/**/*')
//     .pipe($.if($.if.isFile, $.cache($.imagemin({
//       progressive: true,
//       interlaced: true,
//       // don't remove IDs from SVGs, they are often used
//       // as hooks for embedding and styling
//       svgoPlugins: [{cleanupIDs: false}]
//     }))
//     .on('error', function (err) {
//       console.log(err);
//       this.end();
//     })))
//     .pipe(gulp.dest('dist/images'));
// });

// gulp.task('fonts', () => {
//   return gulp.src(require('main-bower-files')({
//     filter: '**/*.{eot,svg,ttf,woff,woff2}'
//   }).concat('app/fonts/**/*'))
//     .pipe(gulp.dest('.tmp/fonts'))
//     .pipe(gulp.dest('dist/fonts'));
// });

// gulp.task('extras', () => {
//   return gulp.src([
//     'app/*.*',
//     '!app/*.html'
//   ], {
//     dot: true
//   }).pipe(gulp.dest('dist'));
// });

// gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

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

// gulp.task('serve:dist', () => {
//   browserSync({
//     notify: false,
//     port: 9000,
//     server: {
//       baseDir: ['dist']
//     }
//   });
// });

// gulp.task('serve:test', () => {
//   browserSync({
//     notify: false,
//     port: 9000,
//     ui: false,
//     server: {
//       baseDir: 'test',
//       routes: {
//         '/bower_components': 'bower_components'
//       }
//     }
//   });

//   gulp.watch('test/spec/**/*.js').on('change', reload);
//   gulp.watch('test/spec/**/*.js', ['lint:test']);
// });

// // inject bower components
// gulp.task('wiredep', () => {
//   gulp.src('app/styles/*.scss')
//     .pipe(wiredep({
//       ignorePath: /^(\.\.\/)+/
//     }))
//     .pipe(gulp.dest('app/styles'));

//   gulp.src('app/*.html')
//     .pipe(wiredep({
//       ignorePath: /^(\.\.\/)*\.\./
//     }))
//     .pipe(gulp.dest('app'));
// });

// gulp.task('build', ['lint', 'html', 'images', 'fonts', 'extras'], () => {
//   return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
// });

// gulp.task('default', ['clean'], () => {
//   gulp.start('build');
// });

// gulp.task('requirejs', () => {
//   return gulp.src('app/lib/flixpress.js')
//     .pipe($.requirejsOptimize({
//       optimize: 'none',
//       mainConfigFile: 'app/lib/config.js',
//       name: 'flixpress',
//       insertRequire: ['flixpress']
//     }))
//     .pipe($.wrap('(function () {<%= contents %>}());'))
//     .pipe($.addSrc.prepend('bower_components/almond/almond.js'))
//     .pipe($.concat('flixpress.js'))
//     .pipe($.s3(awsCredentials, awsOptions))
//     .pipe(gulp.dest('.tmp'))
// });

// gulp.task('develop', ['requirejs'], () => {

//   gulp.watch('app/**/*.js', ['requirejs']);
// });
