// Gulp 모듈 호출 
const { series, parallel, src, dest, watch } = require('gulp'), // gulp
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
	  stripDebug = require('gulp-strip-debug') //stripDebug - console, alert 을 void 0 으로 전체 치환, 상황 봐가면서 써야 할듯
	  ;


// 파일 경로
const paths = {
	all: {
		dest: './project/dist/'
	},
	html: {
        src: './project/src/**/*.html',
        dest: './project/dist/'
	},
    styles: {
        src: './project/src/assets/scss/*.scss',
        dest: './project/dist/assets/css/'
    },
    scripts: {
		src:  './project/src/assets/js/*.js',
		dest: './project/dist/assets/js/'
    },
	wsg:{
		src: './project/src/status/**/*',
		dest: './project/dist/status/'
	},	
	assets:{
		js:{
			src: './project/src/assets/js/lib/*',
			dest: './project/dist/assets/js/lib/'
		},
		fonts:{
			src: './project/src/assets/scss/webfonts/*',
			dest: './project/dist/assets/css/webfonts/'
		},
		images:{
			src: './project/src/assets/images/**/*',
			dest: './project/dist/assets/images/'
		},
		sprite:{
			src: './project/src/assets/sp_images/*.png',
			dest: './project/dist/assets/images/sp_images/'
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
function htmlCompile(){
	return src(paths.html.src, '!./project/src/pages/**/include/*')
			.pipe(changed(paths.html.dest))
			.pipe(dest(paths.html.dest))
			.pipe( browserSync.reload({stream: true}) );
};

//html include
function htmlInclude(){
	return src([paths.html.src, '!./project/src/pages/**/include/*'])
			// .pipe(cached(htmlInclude))
			// .pipe(changed(paths.html.dest))
			.pipe(fileinclude({ prefix: '@@', basepath: './project/src/'}))
			.pipe(dest(paths.html.dest))
			.pipe(browserSync.reload({stream: true}));
};

//script 관련
function jsCompile(done){
	return src([paths.scripts.src, '!./project/src/assets/js/main.js'], { sourcemaps: true })
			.pipe(cached(jsCompile))
			.pipe(concat('ui.common.js'))
		    .pipe(babel())
			.pipe(dest(paths.scripts.dest))
//			.pipe(stripDebug())
			.pipe(uglify())
			.pipe(rename('ui.common.min.js'))
			.pipe(dest(paths.scripts.dest))
			.pipe( browserSync.reload({stream: true}) );

	done();
};

// main script 배포
function mainJsCompile(done){
	return src('./project/src/assets/js/main.js', { sourcemaps: true })
			.pipe(cached(mainJsCompile))
			.pipe(concat('main.js'))
		    .pipe(babel())
			.pipe(dest(paths.scripts.dest))
			.pipe(uglify())
			.pipe(rename('main.min.js'))
			.pipe(dest(paths.scripts.dest))
			.pipe( browserSync.reload({stream: true}) );
	done();
};

//scss compile
function scssCompile(){

	//scss compile option
	let scssOptions = {
		outputStyle : "expanded", // Values : nested, expanded, compact, compressed
		indentType : "space", // Values : space , tab
		indentWidth : 0, // outputStyle 이 nested, expanded 인 경우에 사용
		precision: 4, // 컴파일 된 CSS 의 소수점 자리수
		sourceComments: true // 컴파일 된 CSS 에 원본소스의 위치와 줄수 주석표시.
	};

	return src(paths.styles.src, { sourcemaps: true })
			.pipe(changed(paths.styles.dest))
			.pipe(scss(scssOptions.normal).on('error', scss.logError))
			.pipe(dest(paths.styles.dest), { sourcemaps:  true })
			.pipe(minificss())
			.pipe(rename({ suffix: '.min' }))
			.pipe(dest(paths.styles.dest), { sourcemaps:  true })
			.pipe(browserSync.reload({stream: true}) );
};

// js 라이브러리 배포
function libaryJS(){
	return src(paths.assets.js.src)
			.pipe(dest(paths.assets.js.dest));
};

// html guide
function libaryWsg(){
	return src(paths.wsg.src)
			.pipe(dest(paths.wsg.dest));
};

// 웹폰트 배포
function libaryFonts(){
	return src(paths.assets.fonts.src)
			.pipe(dest(paths.assets.fonts.dest));
};

// 이미지 배포 및 최적화
function libaryImages(done){
	console.log('image')
	return src(paths.assets.images.src)
			.pipe(changed(paths.assets.images.dest))
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
			.pipe(dest(paths.assets.images.dest))
			.pipe(browserSync.reload({stream: true})
	);

};

// sprite images 만들기
function spritesImage(done){

	let spriteData = src(paths.assets.sprite.src)
			.pipe(spritesmith({
				imgName: 'sprites.png',
				padding: 10,
				cssName: 'sprites.css'
			}));
			

	spriteData.img.pipe(dest(paths.assets.sprite.dest));
	spriteData.css.pipe(dest(paths.styles.dest + 'common/')).pipe( browserSync.reload({stream: true}));
	done(); //task가 정상 종료 안됐을때 callback 함수를 사용 해서 태스크가 종료 되었음을 시스템에 알려준다. 원리는 모르겄다~
};

// clean
function clean(done){
	del.sync(paths.all.dest);
	done();
};

// 지켜보고 있다
function watchFiles() {
	watch(paths.assets.sprite.src, series([spritesImage]));
	watch(paths.html.src, series([htmlCompile, htmlInclude]));
	watch(['./project/src/assets/js/*.js', '!./project/src/assets/js/main.js'], series([jsCompile]));
	// watch('./project/src/assets/js/**/*.js', series([jsCompile, libaryJS]));
	watch('./project/src/assets/js/main.js', series([mainJsCompile]));
	watch('./project/src/assets/scss/**/*.scss', series([scssCompile]));
	watch(paths.assets.images.src, series([libaryImages]));
	watch(paths.wsg.src, series([libaryWsg]));
};

exports.default = series(parallel(serverStart, liveServer, watchFiles)); // 기본 task liveserver용으로
exports.build = series(parallel(clean, htmlInclude, jsCompile, mainJsCompile, libaryJS, scssCompile, libaryImages, spritesImage, libaryWsg, libaryFonts)); // 기본 빌드 task
exports.sprite = series(parallel(spritesImage)); // 이미지 스프라이프 태스크