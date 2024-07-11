const UglifyJS = require("uglify-js");
const fs = require('fs'); 


let package = JSON.parse(fs.readFileSync(`${__dirname}/package.json`, {encoding: 'utf8', flag: 'r'}));
let [major, build_no] = package.version.split('.');
build_no = String(parseInt(build_no)+1).padStart(5, '0');
package.version = `${major}.${build_no}`;
fs.writeFileSync(`${__dirname}/package.json`, JSON.stringify(package, null, "\t"));

let code = fs.readFileSync(`${__dirname}/animate.js`, {encoding: 'utf8', flag: 'r'});
code = code.replace(/\n\s*\*\s*@version\s*\d+\.\d+/, `\n * @version ${package.version}`);
fs.writeFileSync(`${__dirname}/animate.js`, code);

let minified = UglifyJS.minify(code);
fs.writeFileSync(`${__dirname}/animate.min.js`, minified.code);

let readme = fs.readFileSync(`${__dirname}/readme.md`, {encoding: 'utf8', flag: 'r'});
readme = readme.replace(/\d*\.*\d+ KB/, (Math.floor((minified.code.length/100))/10)+" KB");
fs.writeFileSync(`${__dirname}/readme.md`, readme);

let index = fs.readFileSync(`${__dirname}/index.html`, {encoding: 'utf8', flag: 'r'});
index = index.replace(/\d*\.*\d+ KB/, (Math.floor((minified.code.length/100))/10)+" KB");
fs.writeFileSync(`${__dirname}/index.html`, index);
