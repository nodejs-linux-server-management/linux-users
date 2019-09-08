/* eslint-disable no-undef */
var platform = require('os').platform;
var Shells = require('../dist/shells').Shells;

describe('#Shells Class (Promises)', function () {
	this.timeout(1000);
	if (platform() === 'linux') {
		it('#list', (done) => {
			var sh = new Shells();
			sh.list().then(() => {
				done();
			}).catch((e) => {
				done(new Error(`Shouldn't fail\n${e}`));
			});
		});
		it('#exists', (done) => {
			var sh = new Shells();
			sh.list().then((shells) => {
				var p = [];
				for (var i = 0; i < shells.length; i++) {
					p.push(sh.exists(shells[i]));
				}
				Promise.all(p).then((results) => {
					if (results.every((r) => r === true)) {
						sh.exists('dontExists').then((exists) => {
							if (exists === false) {
								done();
							} else {
								done(new Error('The shell "dontExists" shouldn\'t exists'));
							}
						}).catch((e) => {
							done(new Error(`Shouldn't fail\n${e}`));
						});
					} else {
						var missingShells = {};
						for(var i = 0; i < shells.length; i++){
							if(results[i] !== true){
								missingShells[shells[i]] = results[i];
							}
						}
						console.log(missingShells);
						done(new Error('All shells in the list of shells should exists'));
					}
				}).catch((e) => {
					done(new Error(`Shouldn't fail\n${e}`));
				});
			}).catch((e) => {
				done(new Error(`Shouldn't fail\n${e}`));
			});
		});
	} else {
		it('#Bad platform', (done) => {
			try {
				new Shells();
				done(new Error('Shouldn\'t work on this platform'));
			} catch (e) {
				if (e.message === 'This module only runs on linux') {
					done();
				} else {
					done(new Error(`Expected message:\n"This module only runs on linux"\nBut got:\n${e.message}`));
				}
			}
		});
	}
});

describe('#Shells Class (Callbacks)', function () {
	this.timeout(1000);
	if (platform() === 'linux') {
		it('#list', (done) => {
			var sh = new Shells();
			sh.list((error) => {
				if(error){
					done(new Error(`Shouldn't fail\n${error}`));
				}else{
					done();
				}
			});
		});
		it('#exists', (done) => {
			var sh = new Shells();
			sh.exists('/bin/sh', (error, exists) => {
				if(error){
					done(new Error(`Shouldn't fail\n${error}`));
				}else{
					if(exists === true){
						sh.exists('dontExists', (error, exists) => {
							if(error){
								done(new Error(`Shouldn't fail\n${error}`));
							}else{
								if(exists === true){
									done(new Error('The shell "dontExists" shouldn\'t exists'));
								}else{
									done();
								}
							}
						});
					}else{
						done(new Error('The shell "/bin/sh" should exists'));
					}
				}
			});
		});
	} else {
		it('#Bad platform', (done) => {
			try {
				new Shells();
				done(new Error('Shouldn\'t work on this platform'));
			} catch (e) {
				if (e.message === 'This module only runs on linux') {
					done();
				} else {
					done(new Error(`Expected message:\n"This module only runs on linux"\nBut got:\n${e.message}`));
				}
			}
		});
	}
});
