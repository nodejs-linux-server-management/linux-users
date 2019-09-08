/* eslint-disable no-undef */
var platform = require('os').platform;
var Shells = require('../dist/index').Shells;
var Groups = require('../dist/index').Groups;
var Users = require('../dist/index').Users;

describe('#Index Shells namespace (Promises)', function () {
	this.timeout(10000);
	if (platform() === 'linux') {
		it('#list', (done) => {
			Shells.list().then(()=>{
				done();
			}).catch((e) => {
				done(new Error(`Shouldn't fail\n${e}`));
			});
		});
		it('#exists', (done) => {
			Shells.exists('root').then(() => {
				done();
			}).catch((e) => {
				done(new Error(`Shouldn't fail\n${e}`));
			});
		});
	} else {
		it('#Bad platform', (done) => {
			try {
				Shells.shells();
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

describe('#Index Shells namespace (Callbacks)', function () {
	this.timeout(10000);
	if (platform() === 'linux') {
		it('#list', (done) => {
			Shells.list((error) => {
				if(error){
					done(new Error(`Shouldn't fail\n${error}`));
				}else{
					done();
				}
			});
		});
		it('#exists', (done) => {
			Shells.exists('root', (error) => {
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
				Shells.shells();
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

describe('#Index Groups namespace (Promises)', function () {
	this.timeout(10000);
	if (platform() === 'linux') {
		it('#list', (done) => {
			Groups.list().then(() => {
				done();
			}).catch((e) => {
				done(new Error(`Shouldn't fail\n${e}`));
			});
		});
		it('#exists', (done) => {
			Groups.exists('root').then(() => {
				done();
			}).catch((e) => {
				done(new Error(`Shouldn't fail\n${e}`));
			});
		});
		it('#create (sudo)', (done) => {
			Groups.create('newgroup').then(() => {
				done();
			}).catch((e) => {
				done(new Error(`Shouldn't fail\n${e}`));
			});
		});
		it('#delete (sudo)', (done) => {
			Groups.deleteGroup('newgroup').then(() => {
				done();
			}).catch((e) => {
				done(new Error(`Shouldn't fail\n${e}`));
			});
		});
		it('#members', (done) => {
			Groups.members('daemon').then(() => {
				done();
			}).catch((e) => {
				done(new Error(`Shouldn't fail\n${e}`));
			});
		});
	} else {
		it('#Bad platform', (done) => {
			try {
				Shells.shells();
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

describe('#Index Groups namespace (Callbacks)', function () {
	this.timeout(10000);
	if (platform() === 'linux') {
		it('#list', (done) => {
			Groups.list((error) => {
				if(error){
					done(new Error(`Shouldn't fail\n${error}`));
				}else{
					done();
				}
			});
		});
		it('#exists', (done) => {
			Groups.exists('root', (error) => {
				if(error){
					done(new Error(`Shouldn't fail\n${error}`));
				}else{
					done();
				}
			});
		});
		it('#create (sudo)', (done) => {
			Groups.create('newgroup', undefined, (error) => {
				if(error){
					done(new Error(`Shouldn't fail\n${error}`));
				}else{
					done();
				}
			});
		});
		it('#delete (sudo)', (done) => {
			Groups.deleteGroup('newgroup', (error) => {
				if(error){
					done(new Error(`Shouldn't fail\n${error}`));
				}else{
					done();
				}
			});
		});
		it('#members', (done) => {
			Groups.members('daemon', (error) => {
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
				Shells.shells();
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

describe('#Index Users namespace (Promises)', function () {
	this.timeout(1000);
	it('#list', (done) => {
		Users.list().then(() => {
			done();
		}).catch((e) => {
			done(new Error(`Shouldn't fail\n${e}`));
		});
	});
	it('#listSystemUsers', (done) => {
		Users.listSystemUsers().then(() => {
			done();
		}).catch((e) => {
			done(new Error(`Shouldn't fail\n${e}`));
		});
	});
	it('#listNonSystemUsers', (done) => {
		Users.listNonSystemUsers().then(() => {
			done();
		}).catch((e) => {
			done(new Error(`Shouldn't fail\n${e}`));
		});
	});
	it('#exists', (done) => {
		Users.exists('root').then(() => {
			done();
		}).catch((e) => {
			done(new Error(`Shouldn't fail\n${e}`));
		});
	});
	it('#informations', (done) => {
		Users.informations('root').then(() => {
			done();
		}).catch((e) => {
			done(new Error(`Shouldn't fail\n${e}`));
		});
	});
	it('#listWithInformations', (done) => {
		Users.listWithInformations().then(() => {
			done();
		}).catch((e) => {
			done(new Error(`Shouldn't fail\n${e}`));
		});
	});
	it('#create', (done) => {
		Users.create('testuser', 'default', 'testpassword', 'default', ['users', 'wheel'], null, 'default', 'comment').then(() => {
			done();
		}).catch((e) => {
			done(new Error(`Shouldn't fail\n${e}`));
		});
	});
	it('#changePrimaryGroup', (done) => {
		Users.changePrimaryGroup('testuser', 'users').then(() => {
			Users.changePrimaryGroup('testuser', 'testuser').then(() => {
				done();
			}).catch((e) => {
				done(new Error(`Shouldn't fail\n${e}`));
			});
		}).catch((e) => {
			done(new Error(`Shouldn't fail\n${e}`));
		});
	});
	it('#changeSecondaryGroups', (done) => {
		Users.changeSecondaryGroups('testuser', ['wheel', 'video', 'storage']).then(() => {
			done();
		}).catch((e) => {
			done(new Error(`Shouldn't fail\n${e}`));
		});
	});
	it('#addSecondaryGroup', (done) => {
		Users.addSecondaryGroup('testuser', 'disk').then(() => {
			done();
		}).catch((e) => {
			done(new Error(`Shouldn't fail\n${e}`));
		});
	});
	it('#removeSecondaryGroup', (done) => {
		Users.removeSecondaryGroup('testuser', 'disk').then(() => {
			done();
		}).catch((e) => {
			done(new Error(`Shouldn't fail\n${e}`));
		});
	});
	it('#lock', (done) => {
		Users.lock('testuser').then(() => {
			done();
		}).catch((e) => {
			done(new Error(`Shouldn't fail\n${e}`));
		});
	});
	it('#unlock', (done) => {
		Users.unlock('testuser').then(() => {
			done();
		}).catch((e) => {
			done(new Error(`Shouldn't fail\n${e}`));
		});
	});
	it('#checkPassword', (done) => {
		Users.checkPassword('testuser', 'testpassword').then((ok) => {
			if (ok) {
				done();
			} else {
				done(new Error('Bad password'));
			}
		}).catch((e) => {
			done(new Error(`Shouldn't fail\n${e}`));
		});
	});
	it('#changePassword', (done) => {
		Users.changePassword('testuser', 'testpasword2').then(() => {
			done();
		}).catch((e) => {
			done(new Error(`Shouldn't fail\n${e}`));
		});
	});
	it('#changeShell', (done) => {
		Users.changeShell('testuser', '/bin/bash').then(() => {
			done();
		}).catch((e) => {
			done(new Error(`Shouldn't fail\n${e}`));
		});
	});
	it('#changeUserId', (done) => {
		Users.changeUserId('testuser', 9999).then(() => {
			done();
		}).catch((e) => {
			done(new Error(`Shouldn't fail\n${e}`));
		});
	});
	it('#changeComment', (done) => {
		Users.changeComment('testuser', 'comment').then(() => {
			done();
		}).catch((e) => {
			done(new Error(`Shouldn't fail\n${e}`));
		});
	});
	it('#changeAccountExpiryDate', (done) => {
		Users.changeAccountExpiryDate('testuser', new Date('2100-01-01')).then(() => {
			done();
		}).catch((e) => {
			done(new Error(`Shouldn't fail\n${e}`));
		});
	});
	it('#changePasswordExpiryFrequency', (done) => {
		Users.changePasswordExpiryFrequency('testuser', 20).then(() => {
			done();
		}).catch((e) => {
			done(new Error(`Shouldn't fail\n${e}`));
		});
	});
	it('#delete', (done) => {
		Users.deleteUser('testuser', true).then(() => {
			done();
		}).catch((e) => {
			done(new Error(`Shouldn't fail\n${e}`));
		});
	});
});

describe('#Index Users namespace (Promises)', function () {
	this.timeout(1000);
	it('#list', (done) => {
		Users.list((error) => {
			if(error){
				done(new Error(`Shouldn't fail\n${error}`));
			}else{
				done();
			}
		});
	});
	it('#listSystemUsers', (done) => {
		Users.listSystemUsers((error) => {
			if(error){
				done(new Error(`Shouldn't fail\n${error}`));
			}else{
				done();
			}
		});
	});
	it('#listNonSystemUsers', (done) => {
		Users.listNonSystemUsers((error) => {
			if(error) {
				done(new Error(`Shouldn't fail\n${error}`));
			}else{
				done();
			}
		});
	});
	it('#exists', (done) => {
		Users.exists('root', (error) => {
			if(error){
				done(new Error(`Shouldn't fail\n${error}`));
			}else{
				done();
			}
		});
	});
	it('#informations', (done) => {
		Users.informations('root', (error) => {
			if(error){
				done(new Error(`Shouldn't fail\n${error}`));
			}else{
				done();
			}
		});
	});
	it('#listWithInformations', (done) => {
		Users.listWithInformations((error) => {
			if(error){
				done(new Error(`Shouldn't fail\n${error}`));
			}else{
				done();
			}
		});
	});
	it('#create', (done) => {
		Users.create('testuser', 'default', 'testpassword', 'default', ['users', 'wheel'], null, 'default', 'comment', (error) => {
			if(error){
				done(new Error(`Shouldn't fail\n${error}`));
			}else{
				done();
			}
		});
	});
	it('#changePrimaryGroup', (done) => {
		Users.changePrimaryGroup('testuser', 'users', (error) => {
			if(error){
				done(new Error(`Shouldn't fail\n${error}`));
			}else{
				Users.changePrimaryGroup('testuser', 'testuser', (error) => {
					if(error){
						done(new Error(`Shouldn't fail\n${error}`));
					}else{
						done();
					}
				});
			}
		});
	});
	it('#changeSecondaryGroups', (done) => {
		Users.changeSecondaryGroups('testuser', ['wheel', 'video', 'storage'], (error) => {
			if(error){
				done(new Error(`Shouldn't fail\n${error}`));
			}else{
				done();
			}
		});
	});
	it('#addSecondaryGroup', (done) => {
		Users.addSecondaryGroup('testuser', 'disk', (error) => {
			if(error){
				done(new Error(`Shouldn't fail\n${error}`));
			}else{
				done();
			}
		});
	});
	it('#removeSecondaryGroup', (done) => {
		Users.removeSecondaryGroup('testuser', 'disk', (error) => {
			if(error){
				done(new Error(`Shouldn't fail\n${error}`));
			}else{
				done();
			}
		});
	});
	it('#lock', (done) => {
		Users.lock('testuser', (error) => {
			if(error){
				done(new Error(`Shouldn't fail\n${error}`));
			}else{
				done();
			}
		});
	});
	it('#unlock', (done) => {
		Users.unlock('testuser', (error) => {
			if(error){
				done(new Error(`Shouldn't fail\n${error}`));
			}else{
				done();
			}
		});
	});
	it('#checkPassword', (done) => {
		Users.checkPassword('testuser', 'testpassword', (error) => {
			if(error){
				done(new Error(`Shouldn't fail\n${error}`));
			}else{
				done();
			}
		});
	});
	it('#changePassword', (done) => {
		Users.changePassword('testuser', 'testpassword2', (error) => {
			if(error){
				done(new Error(`Shouldn't fail\n${error}`));
			}else{
				done();
			}
		});
	});
	it('#changeShell', (done) => {
		Users.changeShell('testuser', '/bin/bash', (error) => {
			if(error){
				done(new Error(`Shouldn't fail\n${error}`));
			}else{
				done();
			}
		});
	});
	it('#changeUserId', (done) => {
		Users.changeUserId('testuser', 9999, (error) => {
			if(error){
				done(new Error(`Shouldn't fail\n${error}`));
			}else{
				done();
			}
		});
	});
	it('#changeComment', (done) => {
		Users.changeComment('testuser', 'comment', (error) => {
			if(error){
				done(new Error(`Shouldn't fail\n${error}`));
			}else{
				done();
			}
		});
	});
	it('#changeAccountExpiryDate', (done) => {
		Users.changeAccountExpiryDate('testuser', new Date('2100-01-01'), (error) => {
			if(error){
				done(new Error(`Shouldn't fail\n${error}`));
			}else{
				done();
			}
		});
	});
	it('#changePasswordExpiryFrequency', (done) => {
		Users.changePasswordExpiryFrequency('testuser', 20, (error) => {
			if(error){
				done(new Error(`Shouldn't fail\n${error}`));
			}else{
				done();
			}
		});
	});
	it('#delete', (done) => {
		Users.deleteUser('testuser', true, (error) => {
			if(error){
				done(new Error(`Shouldn't fail\n${error}`));
			}else{
				done();
			}
		});
	});
});
