// Gulp 모듈 호출
const { series, parallel, src, dest, watch, lastRun } = require('gulp'), // gulp
	  fileinclude = require('gulp-file-include'), //html include 모듈
	  scss = require('gulp-sass')(require('sass')), // scss 컴파일용
	  minifycss = require('gulp-clean-css'), // CSS MINIFY
	  sourcemaps  = require('gulp-sourcemaps'), // scss 소스맵
	  concat = require('gulp-concat'), //concat 플러그인(script 파일을 하나로 뭉침)
	  uglify = require('gulp-uglify'), //minify를 못생기게 변수명을 마음대로 바꿔서 치환하니 작업후에 script 파일을 전달해야 할 경우 사용 하지 말것
	  babel = require("gulp-babel"), // babel
	  imagemin = require('gulp-imagemin'), // 이미지 최적화
	  changed = require('gulp-changed'), // 변경된 파일만 캐치
	  spritesmith = require('gulp.spritesmith'), // 이미지 스프라이트 만들기
	  del = require('del'), // 삭제 모듈
	  rename = require('gulp-rename'), // gulp-rename 모듈 호출
	  nodemon = require('gulp-nodemon'), // 웹서버
	  browserSync = require('browser-sync'), //브라우저싱크 화면 자동 새로 고침
	  cached = require('gulp-cached'), //cached
	  stripDebug = require('gulp-strip-debug'); //stripDebug - console, alert 을 void 0 으로 전체 치환, 상황 봐가면서 써야 할듯

// 파일 경로
const paths = {
	all: {
		dest: './project/dist/'
	},
	html: {
        src: './project/src/**/*.html',
        dest: './project/dist/'
	},
    stylesKo: {
        src: './project/src/assets/ko/scss/common.scss',
        dest: './project/dist/assets/ko/css/'
    },
    stylesEn: {
        src: './project/src/assets/en/scss/common.scss',
        dest: './project/dist/assets/en/css/'
    },
    stylesCh: {
        src: './project/src/assets/ch/scss/common.scss',
        dest: './project/dist/assets/ch/css/'
    },
    stylesJp: {
        src: './project/src/assets/jp/scss/common.scss',
        dest: './project/dist/assets/jp/css/'
    },
    scriptsKo: {
		src:  './project/src/assets/ko/js/*.js',
		dest: './project/dist/assets/ko/js/'
    },
    scriptsEn: {
		src:  './project/src/assets/en/js/*.js',
		dest: './project/dist/assets/en/js/'
    },
    scriptsCh: {
		src:  './project/src/assets/ch/js/*.js',
		dest: './project/dist/assets/ch/js/'
    },
    scriptsJp: {
		src:  './project/src/assets/jp/js/*.js',
		dest: './project/dist/assets/jp/js/'
    },
	wsg:{
		src: './project/src/status/**/*',
		dest: './project/dist/status/'
	},
	assetsKo:{
		js:{
			src: './project/src/assets/ko/js/*',
			dest: './project/dist/assets/ko/js/'
		},
		import: {
			src: './project/src/assets/ko/js/import/*',
			dest: './project/dist/assets/ko/js/import/'
		},
		libraries:{
			src: './project/src/assets/ko/js/libraries/*',
			dest: './project/dist/assets/ko/js/libraries/'
		},
		plugins:{
			src: './project/src/assets/ko/js/plugins/*',
			dest: './project/dist/assets/ko/js/plugins/'
		},
		fonts:{
			src: './project/src/assets/ko/fonts/*',
			dest: './project/dist/assets/ko/fonts/'
		},
		images:{
			src: './project/src/assets/ko/images/**/*',
			dest: './project/dist/assets/ko/images/'
		},
		mov:{
			src: './project/src/assets/ko/videos/**/*',
			dest: './project/dist/assets/ko/videos/'
		},
		sprite:{
			src: './project/src/assets/ko/sp_images/*.png',
			dest: './project/dist/assets/ko/images/sp_images/'
		}
	},
    assetsEn:{
		js:{
			src: './project/src/assets/en/js/*',
			dest: './project/dist/assets/en/js/'
		},
		import: {
			src: './project/src/assets/en/js/import/*',
			dest: './project/dist/assets/en/js/import/'
		},
		libraries:{
			src: './project/src/assets/en/js/libraries/*',
			dest: './project/dist/assets/en/js/libraries/'
		},
		plugins:{
			src: './project/src/assets/en/js/plugins/*',
			dest: './project/dist/assets/en/js/plugins/'
		},
		fonts:{
			src: './project/src/assets/en/fonts/*',
			dest: './project/dist/assets/en/fonts/'
		},
		images:{
			src: './project/src/assets/en/images/**/*',
			dest: './project/dist/assets/en/images/'
		},
		mov:{
			src: './project/src/assets/en/videos/**/*',
			dest: './project/dist/assets/en/videos/'
		},
		sprite:{
			src: './project/src/assets/en/sp_images/*.png',
			dest: './project/dist/assets/en/images/sp_images/'
		}
	},
    assetsCh:{
		js:{
			src: './project/src/assets/ch/js/*',
			dest: './project/dist/assets/ch/js/'
		},
		import: {
			src: './project/src/assets/ch/js/import/*',
			dest: './project/dist/assets/ch/js/import/'
		},
		libraries:{
			src: './project/src/assets/ch/js/libraries/*',
			dest: './project/dist/assets/ch/js/libraries/'
		},
		plugins:{
			src: './project/src/assets/ch/js/plugins/*',
			dest: './project/dist/assets/ch/js/plugins/'
		},
		fonts:{
			src: './project/src/assets/ch/fonts/*',
			dest: './project/dist/assets/ch/fonts/'
		},
		images:{
			src: './project/src/assets/ch/images/**/*',
			dest: './project/dist/assets/ch/images/'
		},
		mov:{
			src: './project/src/assets/ch/videos/**/*',
			dest: './project/dist/assets/ch/videos/'
		},
		sprite:{
			src: './project/src/assets/ch/sp_images/*.png',
			dest: './project/dist/assets/ch/images/sp_images/'
		}
	},
    assetsJp:{
		js:{
			src: './project/src/assets/jp/js/*',
			dest: './project/dist/assets/jp/js/'
		},
		import: {
			src: './project/src/assets/jp/js/import/*',
			dest: './project/dist/assets/jp/js/import/'
		},
		libraries:{
			src: './project/src/assets/jp/js/libraries/*',
			dest: './project/dist/assets/jp/js/libraries/'
		},
		plugins:{
			src: './project/src/assets/jp/js/plugins/*',
			dest: './project/dist/assets/jp/js/plugins/'
		},
		fonts:{
			src: './project/src/assets/jp/fonts/*',
			dest: './project/dist/assets/jp/fonts/'
		},
		images:{
			src: './project/src/assets/jp/images/**/*',
			dest: './project/dist/assets/jp/images/'
		},
		mov:{
			src: './project/src/assets/jp/videos/**/*',
			dest: './project/dist/assets/jp/videos/'
		},
		sprite:{
			src: './project/src/assets/jp/sp_images/*.png',
			dest: './project/dist/assets/jp/images/sp_images/'
		}
	},
};

// 웹서버 스타트
function serverStart(){
	nodemon({
		script: 'app.js',
		watch: 'app'
	});
};

// 브라우저 싱크 실행(화면 새로고침)
function liveServer(){
	browserSync.init( null, { proxy: 'http://localhost:8005' , port: 8006 });
};

//html 관련
function htmlCompile(done){
	return src([paths.html.src, '!./project/src/pages/ko/includes/*', '!./project/src/pages/en/includes/*', '!./project/src/pages/ch/includes/*', '!./project/src/pages/jp/includes/*', '!./project/src/pages/gr/includes/*'])
			.pipe(fileinclude({ prefix: '@@', basepath: './project/src/', indent : true}))
			.pipe(cached(htmlCompile))
			.pipe(dest(paths.html.dest))
			.pipe( browserSync.reload({stream: true}) );

	done();
};

//html include
function htmlInclude(done){
	return src([paths.html.src, '!./project/src/pages/ko/includes/*', '!./project/src/pages/en/includes/*', '!./project/src/pages/ch/includes/*', '!./project/src/pages/jp/includes/*', '!./project/src/pages/gr/includes/*'])
			.pipe(fileinclude({ prefix: '@@', basepath: './project/src/', indent : true}))
			.pipe(cached(htmlInclude))
			.pipe(dest(paths.html.dest))
			.pipe(browserSync.reload({stream: true}));

	done();
};

//script 관련
function jsCompileKo(done){
	return src([paths.scriptsKo.src, '!./project/src/assets/ko/js/main.js'], { sourcemaps: true })
			.pipe(cached(jsCompileKo))
			.pipe(concat('ui.common.js'))
		    .pipe(babel())
			.pipe(dest(paths.scriptsKo.dest))
			.pipe(uglify())
			.pipe(rename('ui.common.min.js'))
			.pipe(dest(paths.scriptsKo.dest))
			.pipe( browserSync.reload({stream: true}) );

	done();
};

function jsCompileEn(done){
	return src([paths.scriptsEn.src, '!./project/src/assets/en/js/main.js'], { sourcemaps: true })
			.pipe(cached(jsCompileEn))
			.pipe(concat('ui.common.js'))
		    .pipe(babel())
			.pipe(dest(paths.scriptsEn.dest))
			.pipe(uglify())
			.pipe(rename('ui.common.min.js'))
			.pipe(dest(paths.scriptsEn.dest))
			.pipe( browserSync.reload({stream: true}) );

	done();
};

function jsCompileCh(done){
	return src([paths.scriptsCh.src, '!./project/src/assets/ch/js/main.js'], { sourcemaps: true })
			.pipe(cached(jsCompileCh))
			.pipe(concat('ui.common.js'))
		    .pipe(babel())
			.pipe(dest(paths.scriptsCh.dest))
			.pipe(uglify())
			.pipe(rename('ui.common.min.js'))
			.pipe(dest(paths.scriptsCh.dest))
			.pipe( browserSync.reload({stream: true}) );

	done();
};

function jsCompileJp(done){
	return src([paths.scriptsJp.src, '!./project/src/assets/jp/js/main.js'], { sourcemaps: true })
			.pipe(cached(jsCompileJp))
			.pipe(concat('ui.common.js'))
		    .pipe(babel())
			.pipe(dest(paths.scriptsJp.dest))
			.pipe(uglify())
			.pipe(rename('ui.common.min.js'))
			.pipe(dest(paths.scriptsJp.dest))
			.pipe( browserSync.reload({stream: true}) );

	done();
};

// main script 배포
function mainJsCompileKo(done){
	return src('./project/src/assets/ko/js/main.js', { sourcemaps: true })
			.pipe(cached(mainJsCompileKo))
		    .pipe(babel())
			.pipe(uglify())
			.pipe(dest(paths.scriptsKo.dest))
			.pipe( browserSync.reload({stream: true}) );
	done();
};

function mainJsCompileEn(done){
	return src('./project/src/assets/en/js/main.js', { sourcemaps: true })
			.pipe(cached(mainJsCompileEn))
		    .pipe(babel())
			.pipe(uglify())
			.pipe(dest(paths.scriptsEn.dest))
			.pipe( browserSync.reload({stream: true}) );
	done();
};

function mainJsCompileCh(done){
	return src('./project/src/assets/ch/js/main.js', { sourcemaps: true })
			.pipe(cached(mainJsCompileCh))
		    .pipe(babel())
			.pipe(uglify())
			.pipe(dest(paths.scriptsCh.dest))
			.pipe( browserSync.reload({stream: true}) );
	done();
};

function mainJsCompileJp(done){
	return src('./project/src/assets/jp/js/main.js', { sourcemaps: true })
			.pipe(cached(mainJsCompileJp))
		    .pipe(babel())
			.pipe(uglify())
			.pipe(dest(paths.scriptsJp.dest))
			.pipe( browserSync.reload({stream: true}) );
	done();
};

//scss compile
function scssCompileKo(done){

	//scss compile option
	let scssOptions = {
		outputStyle : "expanded", // Values : nested, expanded, compact, compressed
		indentType : "space", // Values : space , tab
		indentWidth : 0, // outputStyle 이 nested, expanded 인 경우에 사용
		precision: 4, // 컴파일 된 CSS 의 소수점 자리수
		sourceComments: true // 컴파일 된 CSS 에 원본소스의 위치와 줄수 주석표시.
	};

	return src(paths.stylesKo.src)
			.pipe(sourcemaps.init())
			.pipe(changed(paths.stylesKo.dest))
			.pipe(scss(scssOptions.normal).on('error', scss.logError))
			.pipe(dest(paths.stylesKo.dest), { sourcemaps:  true })
			.pipe(minifycss())
			.pipe(rename('common.min.css'))
			.pipe(sourcemaps.write())
			.pipe(dest(paths.stylesKo.dest), { sourcemaps:  true })
			.pipe(browserSync.reload({stream: true}) );
	done();
};

function scssCompileEn(done){

	//scss compile option
	let scssOptions = {
		outputStyle : "expanded", // Values : nested, expanded, compact, compressed
		indentType : "space", // Values : space , tab
		indentWidth : 0, // outputStyle 이 nested, expanded 인 경우에 사용
		precision: 4, // 컴파일 된 CSS 의 소수점 자리수
		sourceComments: true // 컴파일 된 CSS 에 원본소스의 위치와 줄수 주석표시.
	};

	return src(paths.stylesEn.src)
			.pipe(sourcemaps.init())
			.pipe(changed(paths.stylesEn.dest))
			.pipe(scss(scssOptions.normal).on('error', scss.logError))
			.pipe(dest(paths.stylesEn.dest), { sourcemaps:  true })
			.pipe(minifycss())
			.pipe(rename('common.min.css'))
			.pipe(sourcemaps.write())
			.pipe(dest(paths.stylesEn.dest), { sourcemaps:  true })
			.pipe(browserSync.reload({stream: true}) );
	done();
};

function scssCompileCh(done){

	//scss compile option
	let scssOptions = {
		outputStyle : "expanded", // Values : nested, expanded, compact, compressed
		indentType : "space", // Values : space , tab
		indentWidth : 0, // outputStyle 이 nested, expanded 인 경우에 사용
		precision: 4, // 컴파일 된 CSS 의 소수점 자리수
		sourceComments: true // 컴파일 된 CSS 에 원본소스의 위치와 줄수 주석표시.
	};

	return src(paths.stylesCh.src)
			.pipe(sourcemaps.init())
			.pipe(changed(paths.stylesCh.dest))
			.pipe(scss(scssOptions.normal).on('error', scss.logError))
			.pipe(dest(paths.stylesCh.dest), { sourcemaps:  true })
			.pipe(minifycss())
			.pipe(rename('common.min.css'))
			.pipe(sourcemaps.write())
			.pipe(dest(paths.stylesCh.dest), { sourcemaps:  true })
			.pipe(browserSync.reload({stream: true}) );
	done();
};

function scssCompileJp(done){

	//scss compile option
	let scssOptions = {
		outputStyle : "expanded", // Values : nested, expanded, compact, compressed
		indentType : "space", // Values : space , tab
		indentWidth : 0, // outputStyle 이 nested, expanded 인 경우에 사용
		precision: 4, // 컴파일 된 CSS 의 소수점 자리수
		sourceComments: true // 컴파일 된 CSS 에 원본소스의 위치와 줄수 주석표시.
	};

	return src(paths.stylesJp.src)
			.pipe(sourcemaps.init())
			.pipe(changed(paths.stylesJp.dest))
			.pipe(scss(scssOptions.normal).on('error', scss.logError))
			.pipe(dest(paths.stylesJp.dest), { sourcemaps:  true })
			.pipe(minifycss())
			.pipe(rename('common.min.css'))
			.pipe(sourcemaps.write())
			.pipe(dest(paths.stylesJp.dest), { sourcemaps:  true })
			.pipe(browserSync.reload({stream: true}) );
	done();
};

// js 플러그인, 라이브러리 import 배포
function importJSKo(done){
	return src(paths.assetsKo.import.src)
			.pipe(dest(paths.assetsKo.import.dest));
	done();
};

function importJSEn(done){
	return src(paths.assetsEn.import.src)
			.pipe(dest(paths.assetsEn.import.dest));
	done();
};
function importJSCh(done){
	return src(paths.assetsCh.import.src)
			.pipe(dest(paths.assetsCh.import.dest));
	done();
};
function importJSJp(done){
	return src(paths.assetsJp.import.src)
			.pipe(dest(paths.assetsJp.import.dest));
	done();
};

// js 라이브러리 배포
function libraryJSKo(done){
	return src(paths.assetsKo.libraries.src)
			.pipe(dest(paths.assetsKo.libraries.dest));
	done();
};
function libraryJSEn(done){
	return src(paths.assetsEn.libraries.src)
			.pipe(dest(paths.assetsEn.libraries.dest));
	done();
};
function libraryJSCh(done){
	return src(paths.assetsCh.libraries.src)
			.pipe(dest(paths.assetsCh.libraries.dest));
	done();
};
function libraryJSJp(done){
	return src(paths.assetsJp.libraries.src)
			.pipe(dest(paths.assetsJp.libraries.dest));
	done();
};

// js 플러그인 배포
function pluginJSKo(done){
	return src(paths.assetsKo.plugins.src)
			.pipe(dest(paths.assetsKo.plugins.dest));
	done();
};
function pluginJSEn(done){
	return src(paths.assetsEn.plugins.src)
			.pipe(dest(paths.assetsEn.plugins.dest));
	done();
};
function pluginJSCh(done){
	return src(paths.assetsCh.plugins.src)
			.pipe(dest(paths.assetsCh.plugins.dest));
	done();
};
function pluginJSJp(done){
	return src(paths.assetsJp.plugins.src)
			.pipe(dest(paths.assetsJp.plugins.dest));
	done();
};

// html guide
function libraryWsg(done){
	return src(paths.wsg.src)
			.pipe(dest(paths.wsg.dest));
	done();
};

// 웹폰트 배포
function libraryFontsKo(done){
	return src(paths.assetsKo.fonts.src)
			.pipe(dest(paths.assetsKo.fonts.dest));
	done();
};
function libraryFontsEn(done){
	return src(paths.assetsEn.fonts.src)
			.pipe(dest(paths.assetsEn.fonts.dest));
	done();
};
function libraryFontsCh(done){
	return src(paths.assetsCh.fonts.src)
			.pipe(dest(paths.assetsCh.fonts.dest));
	done();
};
function libraryFontsJp(done){
	return src(paths.assetsJp.fonts.src)
			.pipe(dest(paths.assetsJp.fonts.dest));
	done();
};

// 영상 배포
function libraryMovsKo(done){
	return src(paths.assetsKo.mov.src)
			.pipe(dest(paths.assetsKo.mov.dest));
	done();
};
function libraryMovsEn(done){
	return src(paths.assetsEn.mov.src)
			.pipe(dest(paths.assetsEn.mov.dest));
	done();
};
function libraryMovsCh(done){
	return src(paths.assetsCh.mov.src)
			.pipe(dest(paths.assetsCh.mov.dest));
	done();
};
function libraryMovsJp(done){
	return src(paths.assetsJp.mov.src)
			.pipe(dest(paths.assetsJp.mov.dest));
	done();
};

// 이미지 배포
function libraryImagesKo(done){
	return src(paths.assetsKo.images.src)
			.pipe(cached(libraryImagesKo))
			.pipe(changed(paths.assetsKo.images.dest))
			.pipe(dest(paths.assetsKo.images.dest))
			.pipe(browserSync.reload({stream: true})
	);
	done();
};
function libraryImagesEn(done){
	return src(paths.assetsEn.images.src)
			.pipe(cached(libraryImagesEn))
			.pipe(changed(paths.assetsEn.images.dest))
			.pipe(dest(paths.assetsEn.images.dest))
			.pipe(browserSync.reload({stream: true})
	);
	done();
};
function libraryImagesCh(done){
	return src(paths.assetsCh.images.src)
			.pipe(cached(libraryImagesCh))
			.pipe(changed(paths.assetsCh.images.dest))
			.pipe(dest(paths.assetsCh.images.dest))
			.pipe(browserSync.reload({stream: true})
	);
	done();
};
function libraryImagesJp(done){
	return src(paths.assetsJp.images.src)
			.pipe(cached(libraryImagesJp))
			.pipe(changed(paths.assetsJp.images.dest))
			.pipe(dest(paths.assetsJp.images.dest))
			.pipe(browserSync.reload({stream: true})
	);
	done();
};

//이미지 최적화
function optImageKo(done){

	return src(paths.assetsKo.images.src)
			.pipe(
			imagemin([
				imagemin.gifsicle({interlaced: false}),
				imagemin.mozjpeg({quality: 75, progressive: true}),
				imagemin.optipng({optimizationLevel: 5}),
				imagemin.svgo({
					plugins: [
						{removeViewBox: true},
						{cleanupIDs: false}
					]
				})
			]))
			.pipe(dest(paths.assetsKo.images.dest));

	done();
};
function optImageEn(done){

	return src(paths.assetsEn.images.src)
			.pipe(
			imagemin([
				imagemin.gifsicle({interlaced: false}),
				imagemin.mozjpeg({quality: 75, progressive: true}),
				imagemin.optipng({optimizationLevel: 5}),
				imagemin.svgo({
					plugins: [
						{removeViewBox: true},
						{cleanupIDs: false}
					]
				})
			]))
			.pipe(dest(paths.assetsEn.images.dest));

	done();
};
function optImageCh(done){

	return src(paths.assetsCh.images.src)
			.pipe(
			imagemin([
				imagemin.gifsicle({interlaced: false}),
				imagemin.mozjpeg({quality: 75, progressive: true}),
				imagemin.optipng({optimizationLevel: 5}),
				imagemin.svgo({
					plugins: [
						{removeViewBox: true},
						{cleanupIDs: false}
					]
				})
			]))
			.pipe(dest(paths.assetsCh.images.dest));

	done();
};
function optImageJp(done){

	return src(paths.assetsJp.images.src)
			.pipe(
			imagemin([
				imagemin.gifsicle({interlaced: false}),
				imagemin.mozjpeg({quality: 75, progressive: true}),
				imagemin.optipng({optimizationLevel: 5}),
				imagemin.svgo({
					plugins: [
						{removeViewBox: true},
						{cleanupIDs: false}
					]
				})
			]))
			.pipe(dest(paths.assetsJp.images.dest));

	done();
};

// sprite images 만들기
function spritesImageKo(done){

	let spriteData = src(paths.assetsKo.sprite.src)
			.pipe(spritesmith({
				imgName: 'sprites.png',
				padding: 10,
				cssName: 'sprites.css'
			}));
	spriteData.img.pipe(dest(paths.assetsKo.sprite.dest));
	spriteData.css.pipe(dest(paths.stylesKo.dest + 'common/')).pipe( browserSync.reload({stream: true}));
	done(); //task가 정상 종료 안됐을때 callback 함수를 사용 해서 태스크가 종료 되었음을 시스템에 알려준다.
};
function spritesImageEn(done){

	let spriteData = src(paths.assetsEn.sprite.src)
			.pipe(spritesmith({
				imgName: 'sprites.png',
				padding: 10,
				cssName: 'sprites.css'
			}));
	spriteData.img.pipe(dest(paths.assetsEn.sprite.dest));
	spriteData.css.pipe(dest(paths.stylesEn.dest + 'common/')).pipe( browserSync.reload({stream: true}));
	done(); //task가 정상 종료 안됐을때 callback 함수를 사용 해서 태스크가 종료 되었음을 시스템에 알려준다.
};
function spritesImageCh(done){

	let spriteData = src(paths.assetsCh.sprite.src)
			.pipe(spritesmith({
				imgName: 'sprites.png',
				padding: 10,
				cssName: 'sprites.css'
			}));
	spriteData.img.pipe(dest(paths.assetsCh.sprite.dest));
	spriteData.css.pipe(dest(paths.stylesCh.dest + 'common/')).pipe( browserSync.reload({stream: true}));
	done(); //task가 정상 종료 안됐을때 callback 함수를 사용 해서 태스크가 종료 되었음을 시스템에 알려준다.
};
function spritesImageJp(done){

	let spriteData = src(paths.assetsJp.sprite.src)
			.pipe(spritesmith({
				imgName: 'sprites.png',
				padding: 10,
				cssName: 'sprites.css'
			}));
	spriteData.img.pipe(dest(paths.assetsJp.sprite.dest));
	spriteData.css.pipe(dest(paths.stylesJp.dest + 'common/')).pipe( browserSync.reload({stream: true}));
	done(); //task가 정상 종료 안됐을때 callback 함수를 사용 해서 태스크가 종료 되었음을 시스템에 알려준다.
};

// clean
function clean(done){
	del.sync(paths.all.dest);
	done();
};

// 지정한 파일, 경로에 대해 실시간 파일 변경 감지
function watchFiles() {
	watch(paths.assetsKo.sprite.src, series([spritesImageKo]));
	watch(paths.assetsEn.sprite.src, series([spritesImageEn]));
	watch(paths.assetsCh.sprite.src, series([spritesImageCh]));
	watch(paths.assetsJp.sprite.src, series([spritesImageJp]));
	watch(paths.html.src, series([htmlCompile]));
	watch(['./project/src/assets/ko/js/*.js', '!./project/src/assets/ko/js/main.js'], series([jsCompileKo]));
	watch(['./project/src/assets/en/js/*.js', '!./project/src/assets/en/js/main.js'], series([jsCompileEn]));
	watch(['./project/src/assets/ch/js/*.js', '!./project/src/assets/ch/js/main.js'], series([jsCompileCh]));
	watch(['./project/src/assets/jp/js/*.js', '!./project/src/assets/jp/js/main.js'], series([jsCompileJp]));
	watch('./project/src/assets/ko/js/libraries/*.js', series([libraryJSKo]));
	watch('./project/src/assets/en/js/libraries/*.js', series([libraryJSEn]));
	watch('./project/src/assets/ch/js/libraries/*.js', series([libraryJSCh]));
	watch('./project/src/assets/jp/js/libraries/*.js', series([libraryJSJp]));
	watch('./project/src/assets/ko/js/plugins/*.js', series([pluginJSKo]));
	watch('./project/src/assets/en/js/plugins/*.js', series([pluginJSEn]));
	watch('./project/src/assets/ch/js/plugins/*.js', series([pluginJSCh]));
	watch('./project/src/assets/jp/js/plugins/*.js', series([pluginJSJp]));
	watch('./project/src/assets/ko/js/main.js', series([mainJsCompileKo]));
	watch('./project/src/assets/en/js/main.js', series([mainJsCompileEn]));
	watch('./project/src/assets/ch/js/main.js', series([mainJsCompileCh]));
	watch('./project/src/assets/jp/js/main.js', series([mainJsCompileJp]));
	watch('./project/src/assets/ko/scss/**/*.scss', series([scssCompileKo]));
	watch('./project/src/assets/en/scss/**/*.scss', series([scssCompileEn]));
	watch('./project/src/assets/ch/scss/**/*.scss', series([scssCompileCh]));
	watch('./project/src/assets/jp/scss/**/*.scss', series([scssCompileJp]));
	watch(paths.assetsKo.images.src, series([libraryImagesKo]));
	watch(paths.assetsEn.images.src, series([libraryImagesEn]));
	watch(paths.assetsCh.images.src, series([libraryImagesCh]));
	watch(paths.assetsJp.images.src, series([libraryImagesJp]));
	watch(paths.assetsKo.mov.src, series([libraryMovsKo]));
	watch(paths.assetsEn.mov.src, series([libraryMovsEn]));
	watch(paths.assetsCh.mov.src, series([libraryMovsCh]));
	watch(paths.assetsJp.mov.src, series([libraryMovsJp]));
	watch(paths.wsg.src, series([libraryWsg]));
};

exports.default = series(parallel(serverStart, liveServer, watchFiles)); // 기본 task liveserver용으로
exports.build = series(parallel(clean, htmlInclude, jsCompileKo, jsCompileEn, jsCompileCh, jsCompileJp, mainJsCompileKo, mainJsCompileEn, mainJsCompileCh, mainJsCompileJp, importJSKo, importJSEn, importJSCh, importJSJp, libraryJSKo, libraryJSEn, libraryJSCh, libraryJSJp, pluginJSKo, pluginJSEn, pluginJSCh, pluginJSJp, scssCompileKo, scssCompileEn, scssCompileCh, scssCompileJp, libraryImagesKo, libraryImagesEn, libraryImagesCh, libraryImagesJp, spritesImageKo, spritesImageEn, spritesImageCh, spritesImageJp, libraryMovsKo, libraryMovsEn, libraryMovsCh, libraryMovsJp, libraryWsg, libraryFontsKo, libraryFontsEn, libraryFontsCh, libraryFontsJp)); // 전체 빌드 task
exports.semi = series(parallel(htmlInclude, jsCompileKo, jsCompileEn, jsCompileCh, jsCompileJp, mainJsCompileKo, mainJsCompileEn, mainJsCompileCh, mainJsCompileJp, scssCompileKo, scssCompileEn, scssCompileCh, scssCompileJp, libraryImagesKo, libraryImagesEn, libraryImagesCh, libraryImagesJp, libraryMovsKo, libraryMovsEn, libraryMovsCh, libraryMovsJp)); // 세미 빌드 task
exports.sprite = series(parallel(spritesImageKo, spritesImageEn, spritesImageCh, spritesImageJp)); // 이미지 스프라이프 태스크
exports.optImage = series(parallel(optImageKo, optImageEn, optImageCh, optImageJp)); // 이미지 최적화