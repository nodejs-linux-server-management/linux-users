/* eslint-disable no-undef */
var platform = require('os').platform;
var Groups = require('../dist/groups').Groups;

describe('#Groups Class (Promises)', function () {
	this.timeout(1000);
	if (platform() === 'linux') {
		it('#list', (done) => {
			var groups = new Groups();
			groups.list().then(() => {
				done();
			}).catch((e) => {
				done(new Error(`Shouldn't fail\n${e}`));
			});
		});
		it('#exists', (done) => {
			var groups = new Groups();
			groups.exists().then(() => {
				var p = [];
				for (var i = 0; i < groups.length; i++) {
					p.push(groups.exists(groups[i]));
				}
				Promise.all(p).then((results) => {
					if (results.every((r) => r === true)) {
						groups.exists('doesntexists').then((exists) => {
							if (exists === false) {
								done();
							} else {
								done(new Error('The group "doesntexists" shouldn\'t exists'));
							}
						});
					} else {
						done(new Error(`Shouldn't fail\n${e}`));
					}
				});
			}).catch((e) => {
				done(new Error(`Shouldn't fail\n${e}`));
			});
		});
		it('#create (sudo)', (done) => {
			var groups = new Groups();
			groups.create('testgroupnoid').then(() => {
				groups.create('testgroupid', 123).then(() => {
					done();
				}).catch((e) => {
					done(new Error(`Shouldn't fail\n${e}`));
				});
			}).catch((e) => {
				done(new Error(`Shouldn't fail\n${e}`));
			});
		});
		it('#delete (sudo)', (done) => {
			var groups = new Groups();
			groups.delete('testgroupnoid').then(() => {
				groups.delete('testgroupid').then(() => {
					done();
				}).catch((e) => {
					done(new Error(`Shouldn't fail\n${e}`));
				});
			}).catch((e) => {
				done(new Error(`Shouldn't fail\n${e}`));
			});
		});
		it('#members', (done) => {
			var groups = new Groups();
			groups.members('daemon').then(() => {
				done();
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

describe('#Groups Class (Callbacks)', function () {
	this.timeout(1000);
	if (platform() === 'linux') {
		it('#list', (done) => {
			var groups = new Groups();
			groups.list((error) => {
				if(error){
					done(new Error(`Shouldn't fail\n${error}`));
				}else{
					done();
				}
			});
		});
		it('#exists', (done) => {
			var groups = new Groups();
			groups.exists('daemon', (error, exists) => {
				if(error){
					done(new Error(`Shouldn't fail\n${error}`));
				}else{
					if(exists){
						groups.exists('doesntexists', (error, exists) => {
							if(error){
								done(new Error(`Shouldn't fail\n${error}`));
							}else{
								if(exists === false){
									done();
								}else{
									done(new Error('The group "doesntexists" shouldn\'t exists'));
								}
							}
						});
					}else{
						done(new Error('The group "daemon" should exists'));
					}
				}
			});
		});
		it('#create (sudo)', (done) => {
			var groups = new Groups();
			groups.create('testgroupnoid', undefined, (error) => {
				if(error){
					done(new Error(`Shouldn't fail\n${error}`));
				}else{
					groups.create('testgroupid', 123, (error) => {
						if(error){
							done(new Error(`Shouldn't fail\n${error}`));
						}else{
							done();
						}
					});
				}
			});
		});
		it('#delete (sudo)', (done) => {
			var groups = new Groups();
			groups.delete('testgroupnoid', (error) => {
				if(error){
					done(new Error(`Shouldn't fail\n${error}`));
				}else{
					groups.delete('testgroupid', (error) =>{
						if(error){
							done(new Error(`Shouldn't fail\n${error}`));
						}else{
							done();
						}
					});
				}
			});
		});
		it('#members', (done) => {
			var groups = new Groups();
			groups.members('daemon', (error) => {
				if(error){
					done(new Error(`Shouldn't fail\n${error}`));
				}else{
					done();
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
