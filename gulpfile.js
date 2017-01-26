const gulpif = require('gulp-if');
const gulp = require('gulp');
const fs = require('fs');
const zip = require('gulp-zip');
const sftp = require('gulp-sftp');
const ssh = require('gulp-ssh');
const open = require('open');
// readSync不支持mac os、linux系统
const readlineSync = require('readline-sync');

const pkg = JSON.parse(fs.readFileSync('server.json'));

function sftpFun(server, host) {
	var obj = {
		host: pkg[server][host].host,
		user: pkg[server][host].username,
		pass: pkg[server][host].password
	};
	if (server === "public_server") {
		obj.remotePath = pkg[server][host].www_directory_path;
	} else if (server === "release_server") {
		obj.remotePath = pkg[server][host].release_directory_path;
	} else {
		obj = null;
	}
	return obj;
}

gulp.task('list', function() {
	console.log("历史版本列表");
	console.log("————————————————");
	for (var i in pkg.release_history) {
		console.log(i);
	}
	console.log("————————————————");
});

function showList(flag) {
	if (flag === "release") {
		for (var i in pkg.release_history) {
			console.log(i + ': [' + pkg.release_history[i].release_zip_name + ']');
		}
	} else if (flag === "pub") {
		for (var  i in pkg.public_server) {
			console.log(i + ': ' + pkg.public_server[i].host + '(' + pkg.public_server[i].name + ')');
		}
	}
}
gulp.task('release', function() {
	console.log("# 发布release包到网盘系统构建机 #");
	console.log("PS：* 请先测试生产版Web *");
	console.log("release历史版本列表");
	console.log("————————————————");
	showList("release");
	console.log("————————————————");
	console.log("请输入你要上传到的构建机的版本号（格式：19120101）：");
	var answer = readlineSync.question('');
	return gulp.src(['../dist/**/**','!../dist/*.zip'], {
			buffer: false
		})
		// 打包
		.pipe(zip(pkg.release_history[answer].release_zip_name))
		.pipe(gulp.dest('../dist/'))
		// 构建机
		.pipe(gulpif(pkg.release_history[answer].release_server.replace(/\s/g, '') !== "", sftp(sftpFun('release_server', '155'))));
});

gulp.task('pub', function() {
	console.log("# 发布生产版（/dist/web）到测试机 #");
	console.log("PS：* 请先测试生产版Web *");
	console.log("测试服务器列表");
	console.log("————————————————");
	showList("pub");
	console.log("————————————————");
	console.log("请输入你要上传的服务器地址（格式）:");
	var answer = readlineSync.question('');
	return gulp.src(['../dist/**/**','!../dist/*.zip'], {
			buffer: false
		})
		// 打包
		.pipe(zip(pkg.public_server[answer].release_zip_name))
		.pipe(gulp.dest('../dist/'))
		// 构建机
		.pipe(gulpif(pkg.public_server[answer].release_server.replace(/\s/g, '') !== '', sftp(sftpFun('release_server', '155'))))
		// 测试机
		.pipe(sftp(sftpFun('public_server', answer)))
		.on('end', function() {
			var s = new ssh({
				ignoreErrors: false,
				sshConfig: {
					host: pkg.public_server[answer].host,
					username: pkg.public_server[answer].username,
					password: pkg.public_server[answer].password
				}
			});
			s.shell(['cd ' + pkg.public_server[answer].www_directory_path,
				'unzip -o ' + pkg.public_server[answer].release_zip_name,
				'rm -rf ' + pkg.public_server[answer].release_zip_name
			]);
			// 打开测试地址进行测试
			setTimeout(function(){
				open('http://' + pkg.public_server[answer].host);
			},1200);
		});
});
