/* eslint-disable no-undef */
var platform = require('os').platform;
var Users = require('../dist/users').Users;

describe('#Users Class (Promises)', function () {
	this.timeout(1000);
	if (platform() === 'linux') {
		it('#lists', (done) => {
			var users = new Users();
			users.list().then((usersList) => {
				users.listNonSystemUsers().then((nonSystemUsersList) => {
					users.listSystemUsers().then((systemUsersList) => {
						if (!nonSystemUsersList.some(user => systemUsersList.includes(user))) {
							if ((nonSystemUsersList.concat(systemUsersList)).every(user => usersList.includes(user))) {
								done();
							} else {
								done(new Error('At least one user is missing from the nonSystemUsersList or the systemUsersList'));
							}
						} else {
							done(new Error('A system user cannot be a non system user'));
						}
					}).catch((e) => {
						done(new Error(`Shouldn't fail\n${e}`));
					});
				}).catch((e) => {
					done(new Error(`Shouldn't fail\n${e}`));
				});
			}).catch((e) => {
				done(new Error(`Shouldn't fail\n${e}`));
			});
		});
		it('#exists', (done) => {
			var users = new Users();
			users.list().then((usersList) => {
				var p = [];
				for (var i = 0; i < users.length; i++) {
					p.push(users.exists(usersList[i]));
				}
				Promise.all(p).then((results) => {
					if (results.every(r => r === true)) {
						users.exists('dontexists').then((exists) => {
							if (exists === false) {
								done();
							} else {
								done(new Error('The user "dontexists" shouldn\'t exists'));
							}
						}).catch((e) => {
							done(new Error(`Shouldn't fail\n${e}`));
						});
					}
				}).catch((e) => {
					done(new Error(`Shouldn't fail\n${e}`));
				});
			});
		});
		it('#informations', (done) => {
			var users = new Users();
			users.informations('root').then((informations) => {
				var keys = Object.keys(informations.root);
				var expectedKeys = ['username', 'shadowed', 'userId', 'groupId', 'comment', 'homeDirectory', 'defaultShell'];
				if (JSON.stringify(keys) === JSON.stringify(expectedKeys)) {
					done();
				} else {
					done(new Error(`Bad keys:\nExpected: ${expectedKeys.join(', ')}\nExpected: ${keys.join(', ')}`));
				}
			}).catch((e) => {
				done(new Error(`Shouldn't fail\n${e}`));
			});
		});
		it('#create (sudo)', (done) => {
			var users = new Users();
			users.create('testuser', 'default', 'testpassword', 'default', ['users', 'wheel'], null, 'default', 'comment').then(() => {
				new Users().exists('testuser').then((exists) => {
					if (exists) {
						done();
					} else {
						done(new Error('The user "testuser" should have been created'));
					}
				}).catch((e) => {
					done(new Error(`Shouldn't fail\n${e}`));
				});
			}).catch((e) => {
				done(new Error(`Shouldn't fail\n${e}`));
			});
		});
		it('#lock (sudo)', (done) => {
			var users = new Users();
			users.lock('testuser').then(() => {
				done();
			}).catch((e) => {
				done(new Error(`Shouldn't fail\n${e}`));
			});
		});
		it('#unlock (sudo)', (done) => {
			var users = new Users();
			users.unlock('testuser').then(() => {
				done();
			}).catch((e) => {
				done(new Error(`Shouldn't fail\n${e}`));
			});
		});
		it('#changeHomeDirectory (sudo)', (done) => {
			var users = new Users();
			users.changeHomeDirectory('testuser', '/home/testuser2/', true).then(() => {
				users.informations('testuser').then((informations) => {
					if (informations['testuser'].homeDirectory === '/home/testuser2/') {
						done();
					} else {
						if (informations['testuser'].homeDirectory === '/home/testuser/') {
							done(new Error('The home directory hasn\'t been changed'));
						} else {
							done(new Error(`The home directory has been changed but not to "/home/testuser2/", to ${informations['testuser'].homeDirectory}`));
						}
					}
				}).catch((e) => {
					done(new Error(`Shouldn't fail\n${e}`));
				});
			}).catch((e) => {
				done(new Error(`Shouldn't fail\n${e}`));
			});
		});
		it('#changeName (sudo)', (done) => {
			var users = new Users();
			users.changeName('testuser', 'newtestuser').then(() => {
				new Users().exists('newtestuser').then((exists) => {
					if (exists === true) {
						users.changeName('newtestuser', 'testuser').then(() => {
							new Users().exists('testuser').then((exists) => {
								if (exists) {
									done();
								} else {
									new Users().exists('newtestuser').then((exists) => {
										if (exists === true) {
											done(new Error('The user hasn\'t been renamed'));
										} else {
											done(new Error('The user disappeared'));
										}
									}).catch((e) => {
										done(new Error(`Shouldn't fail\n${e}`));
									});
								}
							}).catch((e) => {
								done(new Error(`Shouldn't fail\n${e}`));
							});
						}).catch((e) => {
							done(new Error(`Shouldn't fail\n${e}`));
						});
					} else {
						new Users().exists('testuser').then((exists) => {
							if (exists === true) {
								done(new Error('The user hasn\'t been renamed'));
							} else {
								done(new Error('The user disappeared'));
							}
						}).catch((e) => {
							done(new Error(`Shouldn't fail\n${e}`));
						});
					}
				}).catch((e) => {
					done(new Error(`Shouldn't fail\n${e}`));
				});
			}).catch((e) => {
				done(new Error(`Shouldn't fail\n${e}`));
			});
		});
		it('#changeUserId (sudo)', (done) => {
			var users = new Users();
			users.informations('testuser').then((defaultInformations) => {
				var defaultUserId = defaultInformations['testuser'].userId;
				users.changeUserId('testuser', 9999).then(() => {
					users.informations('testuser').then((informations) => {
						var newUserId = informations['testuser'].userId;
						if (newUserId === 9999) {
							done();
						} else {
							if (newUserId === defaultUserId) {
								done(new Error('The userId hasn\'t been changed'));
							} else {
								done(new Error('The userId has been randomly changed'));
							}
						}
					}).catch((e) => {
						done(new Error(`Shouldn't fail\n${e}`));
					});
				}).catch((e) => {
					done(new Error(`Shouldn't fail\n${e}`));
				});
			}).catch((e) => {
				done(new Error(`Shouldn't fail\n${e}`));
			});
		});
		it('#changeAccountExpiryDate (sudo)', (done) => {
			var users = new Users();
			users.changeAccountExpiryDate('testuser', new Date('2100-01-01')).then(() => {
				done();
			}).catch((e) => {
				done(new Error(`Shouldn't fail\n${e}`));
			});
		});
		it('#changePasswordExpiryFrequency (sudo)', (done) => {
			var users = new Users();
			users.changePasswordExpiryFrequency('testuser', 5).then(() => {
				done();
			}).catch((e) => {
				done(new Error(`Shouldn't fail\n${e}`));
			});
		});
		it('#delete (sudo)', (done) => {
			var users = new Users();
			users.delete('testuser', true).then(() => {
				new Users().exists('testuser').then((exists) => {
					if (exists === false) {
						done();
					} else {
						done(new Error('The user "testuser" should have been deleted'));
					}
				}).catch((e) => {
					done(new Error(`Shouldn't fail\n${e}`));
				});
			}).catch(() => {
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

describe('#Users Class (Callbacks)', function () {
	this.timeout(1000);
	if (platform() === 'linux') {
		it('#lists', (done) => {
			var users = new Users();
			users.list((error, usersList) => {
				if (error) {
					done(new Error(`Shouldn't fail\n${error}`));
				} else {
					users.listNonSystemUsers((error, nonSystemUsersList) => {
						if (error) {
							done(new Error(`Shouldn't fail\n${error}`));
						} else {
							users.listSystemUsers((error, systemUsersList) => {
								if (error) {
									done(new Error(`Shouldn't fail\n${error}`));
								} else {
									if (!nonSystemUsersList.some(user => systemUsersList.includes(user))) {
										if ((nonSystemUsersList.concat(systemUsersList)).every(user => usersList.includes(user))) {
											done();
										} else {
											done(new Error('At least one user is missing from the nonSystemUsersList or the systemUsersList'));
										}
									} else {
										done(new Error('A system user cannot be a non system user'));
									}
								}
							});
						}
					});
				}
			});
		});
		it('#exists', (done) => {
			var users = new Users();
			users.exists('root', (error, exists) => {
				if (error) {
					done(new Error(`Shouldn't fail\n${error}`));
				} else {
					if (exists) {
						users.exists('doesntexists', (error, exists) => {
							if (error) {
								done(new Error(`Shouldn't fail\n${error}`));
							} else {
								if (exists) {
									done(new Error('The user "dontexists" shouldn\'t exists'));
								} else {
									done();
								}
							}
						});
					} else {
						done(new Error('The user "root" should exists'));
					}
				}
			});
		});
		it('#informations', (done) => {
			var users = new Users();
			users.informations('root', (error, informations) => {
				if (error) {
					done(new Error(`Shouldn't fail\n${error}`));
				} else {
					var keys = Object.keys(informations.root);
					var expectedKeys = ['username', 'shadowed', 'userId', 'groupId', 'comment', 'homeDirectory', 'defaultShell'];
					if (JSON.stringify(keys) === JSON.stringify(expectedKeys)) {
						done();
					} else {
						done(new Error(`Bad keys:\nExpected: ${expectedKeys.join(', ')}\nExpected: ${keys.join(', ')}`));
					}
				}
			});
		});
		it('#create (sudo)', (done) => {
			var users = new Users();
			users.create('testuser', 'default', 'testpassword', 'default', ['users', 'wheel'], null, 'default', 'comment', (error) => {
				if (error) {
					done(new Error(`Shouldn't fail\n${error}`));
				} else {
					new Users().exists('testuser', (error, exists) => {
						if (error) {
							done(new Error(`Shouldn't fail\n${error}`));
						} else {
							if (exists) {
								done();
							} else {
								done(new Error('The user "testuser" should have been created'));
							}
						}
					});
				}
			});
		});
		it('#lock (sudo)', (done) => {
			var users = new Users();
			users.lock('testuser', (error) => {
				if (error) {
					done(new Error(`Shouldn't fail\n${error}`));
				} else {
					done();
				}
			});
		});
		it('#unlock (sudo)', (done) => {
			var users = new Users();
			users.unlock('testuser', (error) => {
				if (error) {
					done(new Error(`Shouldn't fail\n${error}`));
				} else {
					done();
				}
			});
		});
		it('#changeHomeDirectory (sudo)', (done) => {
			var users = new Users();
			users.changeHomeDirectory('testuser', '/home/testuser2/', true, (error) => {
				if(error){
					done(new Error(`Shouldn't fail\n${error}`));
				}else{
					users.informations('testuser', (error, informations) => {
						if(error){
							done(new Error(`Shouldn't fail\n${error}`));
						}else{
							if (informations['testuser'].homeDirectory === '/home/testuser2/') {
								done();
							} else {
								if (informations['testuser'].homeDirectory === '/home/testuser/') {
									done(new Error('The home directory hasn\'t been changed'));
								} else {
									done(new Error(`The home directory has been changed but not to "/home/testuser2/", to ${informations['testuser'].homeDirectory}`));
								}
							}
						}
					});
				}
			});
		});
		it('#changeName (sudo)', (done) => {
			var users = new Users();
			users.changeName('testuser', 'newtestuser', (error) => {
				if (error) {
					done(new Error(`Shouldn't fail\n${error}`));
				} else {
					new Users().exists('newtestuser', (error, exists) => {
						if (error) {
							done(new Error(`Shouldn't fail\n${error}`));
						} else {
							if (exists) {
								users.changeName('newtestuser', 'testuser', (error) => {
									if (error) {
										done(new Error(`Shouldn't fail\n${error}`));
									} else {
										new Users().exists('testuser', (error, exists) => {
											if (error) {
												done(new Error(`Shouldn't fail\n${error}`));
											} else {
												if (exists) {
													done();
												} else {
													new Users().exists('newtestuser', (error, exists) => {
														if (error) {
															done(new Error(`Shouldn't fail\n${error}`));
														} else {
															if (exists) {
																done(new Error('The user hasn\'t been renamed'));
															} else {
																done(new Error('The use disappeared'));
															}
														}
													});
												}
											}
										});
									}
								});
							} else {
								new Users().exists('testuser', (error, exists) => {
									if (error) {
										done(new Error(`Shouldn't fail\n${error}`));
									} else {
										if (exists === true) {
											done(new Error('The user hasn\'t been renamed'));
										} else {
											done(new Error('The user disappeared'));
										}
									}
								});
							}
						}
					});
				}
			});
		});
		it('#changeUserId (sudo)', (done) => {
			var users = new Users();
			users.informations('testuser', (error, defaultInformations) => {
				if (error) {
					done(new Error(`Shouldn't fail\n${e}`));
				} else {
					var defaultUserId = defaultInformations['testuser'].userId;
					users.changeUserId('testuser', 9999, (error) => {
						if (error) {
							done(new Error(`Shouldn't fail\n${e}`));
						} else {
							users.informations('testuser', (error, informations) => {
								if (error) {
									done(new Error(`Shouldn't fail\n${e}`));
								} else {
									var newUserId = informations['testuser'].userId;
									if (newUserId === 9999) {
										done();
									} else {
										if (newUserId === defaultUserId) {
											done(new Error('The userId hasn\'t been changed'));
										} else {
											done(new Error('The userId has been randomly changed'));
										}
									}
								}
							});
						}
					});
				}

			});
		});
		it('#changeAccountExpiryDate (sudo)', (done) => {
			var users = new Users();
			users.changeAccountExpiryDate('testuser', new Date('2100-01-01'), (error) => {
				if (error) {
					done(new Error(`Shouldn't fail\n${e}`));
				} else {
					done();
				}
			});
		});
		it('#changePasswordExpiryFrequency (sudo)', (done) => {
			var users = new Users();
			users.changePasswordExpiryFrequency('testuser', 5, (error) => {
				if (error) {
					done(new Error(`Shouldn't fail\n${e}`));
				} else {
					done();
				}
			});
		});
		it('#delete (sudo)', (done) => {
			var users = new Users();
			users.delete('testuser', true, (error) => {
				if (error) {
					done(new Error(`Shouldn't fail\n${e}`));
				} else {
					new Users().exists('testuser', (error, exists) => {
						if (error) {
							done(new Error(`Shouldn't fail\n${e}`));
						} else {
							if (exists === false) {
								done();
							} else {
								done(new Error('The user "testuser" should have been deleted'));
							}

						}
					});
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
