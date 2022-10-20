// Gulp 모듈 호출
const { series, parallel, src, dest, watch, lastRun } = require('gulp'), // gulp
	  fileinclude = require('gulp-file-include'), //html include 모듈
	  scss = require('gulp-sass')(require('sass')), // scss 컴파일용
	  minificss = require('gulp-minify-css'), // css minify
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
    stylesPc: {
        src: './project/src/assets/web/scss/common.scss',
        dest: './project/dist/assets/web/css/'
    },
    stylesMobile: {
        src: './project/src/assets/mobile/scss/common.scss',
        dest: './project/dist/assets/mobile/css/'
    },
    scriptsPc: {
		src:  './project/src/assets/web/js/*.js',
		dest: './project/dist/assets/web/js/'
    },
    scriptsMobile: {
		src:  './project/src/assets/mobile/js/*.js',
		dest: './project/dist/assets/mobile/js/'
    },
	wsg:{
		src: './project/src/status/**/*',
		dest: './project/dist/status/'
	},
	pcAssets:{
		js:{
			src: './project/src/assets/web/js/lib/*',
			dest: './project/dist/assets/web/js/lib/'
		},
		fonts:{
			src: './project/src/assets/web/scss/webfonts/*',
			dest: './project/dist/assets/web/css/webfonts/'
		},
		images:{
			src: './project/src/assets/web/images/**/*',
			dest: './project/dist/assets/web/images/'
		},
		sprite:{
			src: './project/src/assets/web/sp_images/*.png',
			dest: './project/dist/assets/web/images/sp_images/'
		}
	},
    moAssets:{
		js:{
			src: './project/src/assets/mobile/js/lib/*',
			dest: './project/dist/assets/mobile/js/lib/'
		},
		fonts:{
			src: './project/src/assets/mobile/scss/webfonts/*',
			dest: './project/dist/assets/mobile/css/webfonts/'
		},
		images:{
			src: './project/src/assets/mobile/images/**/*',
			dest: './project/dist/assets/mobile/images/'
		},
		sprite:{
			src: './project/src/assets/mobile/sp_images/*.png',
			dest: './project/dist/assets/mobile/images/sp_images/'
		}
	}
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
	return src(paths.html.src, '!./project/src/pages/include/*')
			.pipe(changed(paths.html.dest))
			.pipe(dest(paths.html.dest))
			.pipe( browserSync.reload({stream: true}) );

	done();
};

//html include
function htmlInclude(done){
	return src([paths.html.src, '!./project/src/pages/web/include/*', '!./project/src/pages/mobile/include/*'])
			.pipe(fileinclude({ prefix: '@@', basepath: './project/src/'}))
			.pipe(dest(paths.html.dest))
			.pipe(browserSync.reload({stream: true}));

	done();
};

//web script 관련
function jsPcCompile(done){
	return src([paths.scriptsPc.src, '!./project/src/assets/web/js/main.js'], { sourcemaps: true })
			.pipe(cached(jsPcCompile))
			.pipe(concat('ui.common.js'))
		    .pipe(babel())
			.pipe(dest(paths.scriptsPc.dest))
//			.pipe(stripDebug())
			.pipe(uglify())
			.pipe(rename('ui.common.min.js'))
			.pipe(dest(paths.scriptsPc.dest))
			.pipe( browserSync.reload({stream: true}) );

	done();
};

//mobilebile script 관련
function jsMobileCompile(done){
	return src([paths.scriptsMobile.src, '!./project/src/assets/mobile/js/main.js'], { sourcemaps: true })
			.pipe(cached(jsMobileCompile))
			.pipe(concat('ui.common.js'))
		    .pipe(babel())
			.pipe(dest(paths.scriptsMobile.dest))
//			.pipe(stripDebug())
			.pipe(uglify())
			.pipe(rename('ui.common.min.js'))
			.pipe(dest(paths.scriptsMobile.dest))
			.pipe( browserSync.reload({stream: true}) );

	done();
};

// pc main script 배포
// function pcMainJsCompile(done){
// 	return src('./project/src/assets/web/js/main.js', { sourcemaps: true })
// 			.pipe(cached(pcMainJsCompile))
// 		    .pipe(babel())
// 			.pipe(uglify())
// 			.pipe(dest(paths.scriptsPc.dest))
// 			.pipe( browserSync.reload({stream: true}) );
// 	done();
// };

// mobile main script 배포
// function moMainJsCompile(done){
// 	return src('./project/src/assets/mobile/js/main.js', { sourcemaps: true })
// 			.pipe(cached(moMainJsCompile))
// 		    .pipe(babel())
// 			.pipe(uglify())
// 			.pipe(dest(paths.scriptsMobile.dest))
// 			.pipe( browserSync.reload({stream: true}) );
// 	done();
// };

//scss web compile
function scssPcCompile(done){

	//scss compile option
	let scssOptions = {
		outputStyle : "expanded", // Values : nested, expanded, compact, compressed
		indentType : "space", // Values : space , tab
		indentWidth : 0, // outputStyle 이 nested, expanded 인 경우에 사용
		precision: 4, // 컴파일 된 CSS 의 소수점 자리수
		sourceComments: true // 컴파일 된 CSS 에 원본소스의 위치와 줄수 주석표시.
	};

	return src(paths.stylesPc.src, { sourcemaps: true })
			.pipe(changed(paths.stylesPc.dest))
			.pipe(scss(scssOptions.normal).on('error', scss.logError))
			.pipe(dest(paths.stylesPc.dest), { sourcemaps:  true })
			.pipe(minificss())
			.pipe(rename('common.min.css'))
			.pipe(dest(paths.stylesPc.dest), { sourcemaps:  true })
			.pipe(browserSync.reload({stream: true}) );
	done();
};

//scss mobile compile
function scssMobileCompile(done){
	//scss compile option
	let scssOptions = {
		outputStyle : "expanded", // Values : nested, expanded, compact, compressed
		indentType : "space", // Values : space , tab
		indentWidth : 0, // outputStyle 이 nested, expanded 인 경우에 사용
		precision: 4, // 컴파일 된 CSS 의 소수점 자리수
		sourceComments: true // 컴파일 된 CSS 에 원본소스의 위치와 줄수 주석표시.
	};

	return src(paths.stylesMobile.src, { sourcemaps: true })
			.pipe(changed(paths.stylesMobile.dest))
			.pipe(scss(scssOptions.normal).on('error', scss.logError))
			.pipe(dest(paths.stylesMobile.dest), { sourcemaps:  true })
			.pipe(minificss())
			.pipe(rename('common.min.css'))
			.pipe(dest(paths.stylesMobile.dest), { sourcemaps:  true })
			.pipe(browserSync.reload({stream: true}) );
	done();
};

// pc js 라이브러리 배포
function pclibaryJS(done){
	return src(paths.pcAssets.js.src)
			.pipe(dest(paths.pcAssets.js.dest));
	done();
};

// mo js 라이브러리 배포
function molibaryJS(done){
	return src(paths.moAssets.js.src)
			.pipe(dest(paths.moAssets.js.dest));
	done();
};

// pc 웹폰트 배포
function pclibaryFonts(done){
	return src(paths.pcAssets.fonts.src)
			.pipe(dest(paths.pcAssets.fonts.dest));
	done();
};

// mo 웹폰트 배포
function molibaryFonts(done){
	return src(paths.moAssets.fonts.src)
			.pipe(dest(paths.moAssets.fonts.dest));
	done();
};

// pc 이미지 배포
function pclibaryImages(done){
	return src(paths.pcAssets.images.src)
			.pipe(cached(pclibaryImages))
			.pipe(changed(paths.pcAssets.images.dest))
			.pipe(dest(paths.pcAssets.images.dest))
			.pipe(browserSync.reload({stream: true})
	);
	done();
};
// mo 이미지 배포
function molibaryImages(done){
	return src(paths.moAssets.images.src)
			.pipe(cached(molibaryImages))
			.pipe(changed(paths.moAssets.images.dest))
			.pipe(dest(paths.moAssets.images.dest))
			.pipe(browserSync.reload({stream: true})
	);
	done();
};

//web 이미지 최적화
function pcoptImage(done){
	return src(paths.pcAssets.images.src)
			.pipe(
			imagemin([
				imagemin.gifsicle({interlaced: false}),
				imagemin.mozjpeg({quality: 75, progressive: true}),
				imagemin.optipng({optimizationLevel: 5}),
				imagemin.svgo({
					plugins: [
						{removeViewBox: false},
						{cleanupIDs: false}
					]
				})
			]))
			.pipe(dest(paths.pcAssets.images.dest));
	done();
};

//mobile 이미지 최적화
function mooptImage(done){
	return src(paths.moAssets.images.src)
			.pipe(
			imagemin([
				imagemin.gifsicle({interlaced: false}),
				imagemin.mozjpeg({quality: 75, progressive: true}),
				imagemin.optipng({optimizationLevel: 5}),
				imagemin.svgo({
					plugins: [
						{removeViewBox: false},
						{cleanupIDs: false}
					]
				})
			]))
			.pipe(dest(paths.moAssets.images.dest));
	done();
};

// pc sprite images 만들기
function pcspritesImage(done){

	let spriteData = src(paths.pcAssets.sprite.src)
			.pipe(spritesmith({
				imgName: 'sprites.png',
				padding: 10,
				cssName: 'sprites.css'
			}));

	spriteData.img.pipe(dest(paths.pcAssets.sprite.dest));
	spriteData.css.pipe(dest(paths.stylesPc.dest + 'common/')).pipe( browserSync.reload({stream: true}));
	done(); //task가 정상 종료 안됐을때 callback 함수를 사용 해서 태스크가 종료 되었음을 시스템에 알려준다. 원리는 모르겄다~
};

// mo sprite images 만들기
function mospritesImage(done){

	let spriteData = src(paths.moAssets.sprite.src)
			.pipe(spritesmith({
				imgName: 'sprites.png',
				padding: 10,
				cssName: 'sprites.css'
			}));

	spriteData.img.pipe(dest(paths.moAssets.sprite.dest));
	spriteData.css.pipe(dest(paths.stylesMobile.dest + 'common/')).pipe( browserSync.reload({stream: true}));
	done(); //task가 정상 종료 안됐을때 callback 함수를 사용 해서 태스크가 종료 되었음을 시스템에 알려준다. 원리는 모르겄다~
};

// clean
function clean(done){
	del.sync(paths.all.dest);
	done();
};

// html guide
function libaryWsg(done){
	return src(paths.wsg.src)
			.pipe(dest(paths.wsg.dest));
	done();
};

// 지켜보고 있다
function watchFiles() {
	watch(paths.pcAssets.sprite.src, series([pcspritesImage]));
	watch(paths.moAssets.sprite.src, series([mospritesImage]));
	watch(paths.html.src, series([htmlCompile, htmlInclude]));
	watch(['./project/src/assets/web/js/*.js', '!./project/src/assets/web/js/main.js'], series([jsPcCompile]));
	watch(['./project/src/assets/mobile/js/*.js', '!./project/src/assets/mobile/js/main.js'], series([jsMobileCompile]));
	watch('./project/src/assets/web/js/lib/*.js', series([pclibaryJS]));
	watch('./project/src/assets/mobile/js/lib/*.js', series([molibaryJS]));
	// watch('./project/src/assets/web/js/main.js', series([pcMainJsCompile]));
	// watch('./project/src/assets/mobile/js/main.js', series([moMainJsCompile]));
	watch('./project/src/assets/web/scss/**/*.scss', series([scssPcCompile]));
	watch('./project/src/assets/mobile/scss/**/*.scss', series([scssMobileCompile]));
	watch(paths.pcAssets.images.src, series([pclibaryImages]));
	watch(paths.moAssets.images.src, series([molibaryImages]));
	watch(paths.wsg.src, series([libaryWsg]));
};

exports.default = series(parallel(serverStart, liveServer, watchFiles)); // 기본 task liveserver용으로
exports.build = series(parallel(clean, htmlInclude, jsPcCompile, jsMobileCompile, pclibaryJS, molibaryJS, scssPcCompile, scssMobileCompile, pclibaryImages, molibaryImages, pcspritesImage, mospritesImage, libaryWsg, pclibaryFonts, molibaryFonts)); // 전체 빌드 task
exports.semi = series(parallel(htmlInclude, jsPcCompile, jsMobileCompile, scssPcCompile, scssMobileCompile, pclibaryImages, molibaryImages,)); // 세미 빌드 task
exports.sprite = series(parallel(pcspritesImage, mospritesImage)); // 이미지 스프라이프 태스크
exports.optImage = series(parallel(pcoptImage, mooptImage)); // 이미지 최적화