const { WOMToken, ERC20Mock, WOMTokenProxy, WOMProxyAdmin, UpgradeExample, encodeCall, assertRevert, expectRevert, ZERO_ADDRESS, LARGER_BATCH_ADDRESS, LARGER_BATCH_NUMBER } = require('./common')

contract('WOMTokenProxy', ([owner, newOwner, user, user_batch_1, user_batch_2, attacker]) => {
	beforeEach(async () => {
        this.tokenImplementation = await WOMToken.new({ from: owner })
        this.newTokenImplementation = await UpgradeExample.new({ from: owner })

        this.data = encodeCall('initialize', [], [])
    })
    describe('deploy proxy admin controller', () => {
        beforeEach(async () => {
            this.proxyAdmin = await WOMProxyAdmin.new({ from: owner })
        });
        it('owner set', async () => {
            assert.equal(await this.proxyAdmin.owner(), owner)
        });
        describe('deploy proxy', () => {
            beforeEach(async () => {
                this.proxy = await WOMTokenProxy.new(this.tokenImplementation.address, this.proxyAdmin.address, this.data, { from: owner })
            });
            describe('point token to proxy', () => {
                beforeEach(async () => {
                    this.token = await WOMToken.at(this.proxy.address)
                });
                describe('validate proxy pointers', () => {
                    it('implementation set', async () => {
                        assert.equal(await this.proxyAdmin.getProxyImplementation(this.proxy.address), this.tokenImplementation.address)
                    });
                    it('admin set', async () => {
                        assert.equal(await this.proxyAdmin.getProxyAdmin(this.proxy.address), this.proxyAdmin.address)
                    });
                    describe('initialize constructor', () => {
                        describe('non-functional', () => {
                            it('revert when already initialized', async () => {
                                await expectRevert(this.token.initialize({ from: owner }), 'Contract instance has already been initialized')
                            });
                        });
                        it('name set', async () => {
                            assert.equal(await this.token.name(), 'WOM Token')
                        });
                        it('symbol set', async () => {
                            assert.equal(await this.token.symbol(), 'WOM')
                        });
                        it('decimal set', async () => {
                            assert.equal(await this.token.decimals(), 18)
                        });
                        it('owner balance', async () => {
                            // console.log(await this.token.balanceOf(owner))
                        });
                        it('owner set', async () => {
                            assert.equal(await this.token.owner(), owner)
                        });
                        describe('initialize owner', () => {
                            describe('transfer ownership of ownable', () => {
                                beforeEach(async () => {
                                    await this.token.transferOwnership(newOwner, { from: owner })
                                });
                                it('new owner set', async () => {
                                    assert.equal(await this.token.owner(), newOwner)
                                });
                            });
                            describe('renounce ownership of ownable', () => {
                                beforeEach(async () => {
                                    await this.token.renounceOwnership({ from: owner })
                                });
                                it('empty owner set', async () => {
                                    assert.equal(await this.token.owner(), ZERO_ADDRESS)
                                });
                            });
                        });
                    });
                });
                describe('transfer proxy admin', () => {
                    beforeEach(async () => {
                        this.newProxyAdmin = await WOMProxyAdmin.new({ from: owner })
                    });
                    describe('non-functional', () => {
                        it('revert from attacker', async () => {
                            await assertRevert(this.proxy.changeAdmin(this.newProxyAdmin.address, { from: attacker }))
                        });
                        it('revert when new admin empty address', async () => {
                            await expectRevert(this.proxyAdmin.changeProxyAdmin(this.proxy.address, ZERO_ADDRESS, { from: owner }), 'TransparentUpgradeableProxy: new admin is the zero address')
                        });
                    });
                    describe('functional', () => {
                        beforeEach(async () => {
                            await this.proxyAdmin.changeProxyAdmin(this.proxy.address, this.newProxyAdmin.address, { from: owner })
                        });
                        it('new admin set', async () => {
                            assert.equal(await this.newProxyAdmin.getProxyAdmin(this.proxy.address), this.newProxyAdmin.address)
                        });
                    });
                });
                describe('ownership proxy admin', () => {
                    describe('transfer proxy admin ownership', () => {
                        describe('non-functional', () => {
                            it('revert from attacker', async () => {
                                await assertRevert(this.proxyAdmin.transferOwnership(newOwner, { from: attacker}))
                            });
                            it('revert when new owner empty address', async () => {
                                await assertRevert(this.proxyAdmin.transferOwnership(ZERO_ADDRESS, { from: owner}))
                            });
                        });
                        describe('functional', () => {
                            beforeEach(async () => {
                                await this.proxyAdmin.transferOwnership(newOwner, { from: owner })
                            });
                            it('new owner set', async () => {
                                assert.equal(await this.proxyAdmin.owner(), newOwner)
                            });
                        });
                    });
                    describe('renounce ownership', () => {
                        describe('non-functional', () => {
                            it('revert when from attacker', async () => {
                                await assertRevert(this.proxyAdmin.renounceOwnership({ from: attacker}))
                            });
                        });
                        describe('functional', () => {
                            beforeEach(async () => {
                                await this.proxyAdmin.renounceOwnership({ from: owner })
                            });
                            it('owner renounced', async () => {
                                assert.equal(await this.proxyAdmin.owner(), ZERO_ADDRESS)
                            });
                        });
                    });
                    describe('upgradeability', () => {
                        describe('upgrade to new implementation', () => {
                            describe('non-functional', () => {
                                it('revert empty implementation address', async () => {
                                    await assertRevert(this.proxyAdmin.upgrade(this.proxy.address, ZERO_ADDRESS, { from: owner }))
                                });
                                it('revert from attacker', async () => {
                                    await assertRevert(this.proxyAdmin.upgrade(this.proxy.address, this.newTokenImplementation.address, { from: attacker }))
                                });
                            });
                            describe('functional', () => {
                                beforeEach(async () => {
                                    await this.proxyAdmin.upgrade(this.proxy.address, this.newTokenImplementation.address, { from: owner })
                                    this.token = await UpgradeExample.at(this.proxy.address)
                                });
                                it('implementation set', async () => {
                                    assert.equal(await this.proxyAdmin.getProxyImplementation(this.proxy.address), this.newTokenImplementation.address)
                                });
                                describe('new implementation func available', () => {
                                    beforeEach(async () => {
                                        await this.token.init(true, { from: owner })
                                    });
                                    it('bool set', async () => {
                                        assert.equal(await this.token.newBool(), true)
                                    });
                                    it('initializedV1 set', async () => {
                                        assert.equal(await this.token.initializedV1(), true)
                                    });
                                    it('revert re-initialization', async () => {
                                        await expectRevert(this.token.init(true), 'UpgradeExample: already initialized')
                                    });
                                    describe('initialize owner', () => {
                                        describe('transfer ownership of ownable', () => {
                                            beforeEach(async () => {
                                                await this.token.transferOwnership(newOwner, { from: owner })
                                            });
                                            it('new owner set', async () => {
                                                assert.equal(await this.token.owner(), newOwner)
                                            });
                                        });
                                    });
                                });
                                describe('old implementation func available', () => {
                                    beforeEach(async () => {
                                        await this.token.transfer(user, 100, { from: owner })
                                    });
                                    it('balance updated', async () => {
                                        assert.equal(await this.token.balanceOf(user), 100)
                                    });
                                    describe('batch transfer', () => {
                                        describe('non-functional', () => {
                                            it('revert when batch not equal', async () => {
                                                await expectRevert(this.token.batchTransfer([user_batch_1], [100, 100], { from: owner}), 'WOMToken: batch length not equal')
                                            });
                                            it('revert when batch greater than limit', async () => {
                                                await expectRevert(this.token.batchTransfer(LARGER_BATCH_ADDRESS, LARGER_BATCH_NUMBER, { from: owner}), 'WOMToken: batch is greater than limit')
                                            });
                                        });
                                        describe('functional', () => {
                                            beforeEach(async () => {
                                                await this.token.batchTransfer([user_batch_1, user_batch_2], [100, 100], { from: owner })
                                            });
                                            it('user 1 balance updated', async () => {
                                                assert.equal(await this.token.balanceOf(user_batch_1), 100)
                                            });
                                            it('user 2 balance updated', async () => {
                                                assert.equal(await this.token.balanceOf(user_batch_2), 100)
                                            });
                                        });
                                    });
                                    describe('transferFallBackToken', () => {
                                        beforeEach(async () => {
                                            this.mock = await ERC20Mock.new({ from: owner })
                                        });
                                        describe('when mock deployed', () => {
                                            beforeEach(async () => {
                                                await this.mock.mint(100, { from: owner })
                                            });
                                            describe('transfer into proxy', () => {
                                                beforeEach(async () => {
                                                    await this.mock.transfer(this.token.address, 100, { from: owner })
                                                });
                                                it('proxy balance updated', async () => {
                                                    assert.equal(await this.mock.balanceOf(this.token.address), 100)
                                                });
                                                describe('transfer out from proxy', async () => {
                                                    describe('functional', () => {
                                                        beforeEach(async () => {
                                                            await this.token.transferFallBackToken(this.mock.address, owner, 100, { from: owner })
                                                        });
                                                        it('proxy balance updated', async () => {
                                                            assert.equal(await this.mock.balanceOf(this.token.address), 0)
                                                        });
                                                        it('owner balance updated', async () => {
                                                            assert.equal(await this.mock.balanceOf(owner), 100)
                                                        });
                                                    });
                                                    describe('non-functional', () => {
                                                        it('revert when not owner', async () => {
                                                            await expectRevert(this.token.transferFallBackToken(this.mock.address, owner, 100, { from: attacker }), 'Ownable: caller is not the owner')
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                })
                            });
                        });
                        describe('upgrade to new implementation and call', () => {
                            beforeEach(async () => {
                                this.newData = encodeCall('init', ['bool'], [true])
                            });
                            describe('non-functional', () => {
                                it('revert empty implementation address', async () => {
                                    await assertRevert(this.proxyAdmin.upgradeAndCall(this.proxy.address, ZERO_ADDRESS, this.newData, { from: owner }))
                                });
                                it('revert from attacker', async () => {
                                    await assertRevert(this.proxyAdmin.upgradeAndCall(this.proxy.address, this.newTokenImplementation.address, this.newData, { from: attacker }))
                                });
                            });
                            describe('functional', () => {
                                beforeEach(async () => {
                                    await this.proxyAdmin.upgradeAndCall(this.proxy.address, this.newTokenImplementation.address, this.newData, { from: owner })
                                    this.token = await UpgradeExample.at(this.proxy.address)
                                });
                                it('bool set', async () => {
                                    assert.equal(await this.token.newBool(), true)
                                });
                                it('initializedV1 set', async () => {
                                    assert.equal(await this.token.initializedV1(), true)
                                });
                                it('revert re-initialization', async () => {
                                    await expectRevert(this.token.init(true), 'UpgradeExample: already initialized')
                                });
                            });
                        });
                    });
                });
            });
        });
    })
})