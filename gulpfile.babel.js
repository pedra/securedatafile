'use strict'
/*
	By Bill Rocha <prbr@ymail.com>

	*** Este script requer o Babel & Gulp 4 ou posterior ***
	Antes de usar, instale a última versão do GULP-CLI e os plugins necessários.
	Para instalar o GULP-CLI, execute o comando:

	npm install -g gulp-cli

	Para rodar o script, execute o comando:

	gulp -p (production mode) -b (to run Babel) -o (obfuscator) 
	gulp -pbo (production mode, Babel, obfuscator)

	Adicione essas linhas no seu package.js:

	"babel": {
		"presets": [ "@babel/preset-env"]
	},

*/


import fs from 'node:fs/promises'
// import del from 'del'
import { exec, spawn } from 'child_process'
import { gulp, series, parallel, src, dest } from 'gulp'
import babel from 'gulp-babel'
import gulpif from 'gulp-if'
import minifyCSS from 'gulp-clean-css'
import htmlmin from 'gulp-html-minifier2'
import concat from 'gulp-concat'
import header from 'gulp-header'
import yargs from 'yargs'
import streamqueue from 'streamqueue'
import javascriptObfuscator from 'gulp-javascript-obfuscator'
import uglify from 'gulp-uglify'
import path from 'path'
import imagemin from 'gulp-imagemin'

const public_dir = path.resolve(__dirname, 'public')
const argv = yargs.argv

// args
const PRO = argv.p !== undefined // gulp -p (production mode)
const OBF = (argv.o || false) && PRO // gulp -o (obfuscator)
const BABEL = argv.b !== undefined // gulp -b (to run Babel)

// show config
console.log(
	'\n---------------------------------------------------\n    ' +
	(!PRO
		? "DEVELOPMENT mode ['gulp -p' to production]"
		: 'PRODUCTION mode') +
	'\n---------------------------------------------------\n',
)

// IMAGE  ------------------------------------------------------------------------------------------
function image() {
	return src(IMG)
		.pipe(imagemin({ verbose: false }))
		.pipe(dest(public_dir + '/media'))
}

// HTML  ------------------------------------------------------------------------------------------
function htmlCompress(files = [], output, destination = false) {
	return src(files)
		.pipe(concat(output))
		.pipe(gulpif(PRO, htmlmin({
			collapseWhitespace: true,
			removeComments: true,
			removeEmptyAttributes: true,
		})))
		.pipe(dest(destination ? destination : public_dir))
}

function html() {
	let h = [...HTML_init, ...HTML, ...HTML_final]
	return htmlCompress(h, 'index.html')
}

// STYLE ------------------------------------------------------------------------------------------
function css() {
	let c = [...CSS_init, ...CSS, ...CSS_final]
	return streamqueue(
		{ objectMode: true },
		//src(['public/src/sass/**/*.scss']).pipe(sass()),
		src(c),
	)
		.pipe(concat('style.css'))
		.pipe(gulpif(PRO, minifyCSS({ level: { 1: { specialComments: 0 } } })))
		.pipe(dest(public_dir))
}

function pack_lib() {
	return src([
		'src/js/aes_main.js',
		//'src/sync/jsbn.js',
		'node_modules/crypto-js/crypto-js.js'
	])
		.pipe(concat('lib.js'))
		.pipe(gulpif(PRO, uglify()))
		.pipe(dest('src/js'))
}



exports.pack_lib = pack_lib

// exports.add = add

// // Default ------
// exports.default = series(add, parallel(html, css, sw, js), upload)

// // CSS ------
// exports.css = series(add, css)

// // Html ------
// exports.html = series(add, html)

// // JS ------
// exports.js = series(add, js)

// // libraries ------
// exports.lib = series(parallel(prelib, lib_modules), lib)

// // Others ------
// exports.image = series(add, image)
// exports.sw = sw

// // Deploy to server...
// exports.upload = upload