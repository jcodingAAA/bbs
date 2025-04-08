<template>
	<view>
		<view class="back-wrap">
			<!-- 头部 -->
			<view class="page-top" :style="{ paddingTop: statusBarHeight+'px',}">
				<view class="setting setting-o" :style="{ paddingTop: statusBarHeight+'px'}">
					<view class="setting-inner" :style="{height: navHeight-statusBarHeight+'px'}">
						<image @click="onBack()" src="/static/images/back.png"
							style="width: 32rpx;height: 28rpx;opacity: 1;"></image>
					</view>
				</view>
				<view class="setting" :style="{ paddingTop: statusBarHeight+'px', opacity: navOpacity}">
					<view class="setting-inner" :style="{height: navHeight-statusBarHeight+'px'}">
						<image @click="onBack()" :src="$IMG+'/img/back.png'"
							style="width: 32rpx;height: 28rpx;opacity: 1;"></image>
						<view class="nav-nickname" :style="{ opacity: navOpacity}">
							{{ userInfo.username }}
						</view>
					</view>
				</view>

				<view class="avatar">
					<image :src="userInfo.avatar"
						style="width: 120rpx;height: 120rpx;border-radius: 128rpx;border: 1rpx solid #ffffff;">
					</image>
				</view>
				<view>
					<view style="font-size: 34rpx;font-weight: 600;line-height: 48rpx;margin-top: 30rpx;">
						{{ userInfo.username }}
						<image src="@/static/vip/vipIcon.png" class="image3" v-if="userInfo.vip==1" />
					</view>

					
					<view style="font-size: 24rpx;line-height: 33rpx;margin-top: 16rpx;">{{ userInfo.intro }}</view>
				</view>
				<!-- 圈子&关注&粉丝&编辑资料 按钮 -->
				<view class="some-btn">
					<view class="num-name">
						<view class="num">
							{{userInfo.postNum || 0}}
						</view>
						<view class="name">
							帖子
						</view>
					</view>
					<view class="num-name" @click="getFollow">
						<view class="num">
							{{ userInfo.follow || 0 }}
						</view>
						<view class="name">
							关注
						</view>
					</view>
					<view class="num-name" @click="getFans">
						<view class="num">
							{{ userInfo.fans || 0 }}
						</view>
						<view class="name">
							粉丝
						</view>
					</view>

					<view v-if="currUid==uid" @click="goPersonalData()" class="edit-btn">
						编辑资料
					</view>
					<view v-else>
						<view v-if="!userInfo.isFollow" @click="follow" class="watch-btn">
							关注
						</view>
						<view v-else @click="cancelFollow" class="follow-btn">
							已关注
						</view>
					</view>
					<view v-if="currUid!=uid&&!userInfo.isFriend" class="chatButton" @click="open()">
						加好友
					</view>
					<view v-if="currUid!=uid&&userInfo.isFriend" class="chatButton" @click="gotoChat()">
						聊天
					</view>

				</view>

			</view>
			<!-- 中间 -->
			<view class="page-mid" v-if="currUid==uid">
				<view @click="goFollow()" class="one-btn">
					<view class="top">
						我的关注
					</view>
					<view class="bottom">
						关注的人
					</view>
				</view>
				<view @click="goAccount()" class="one-btn">
					<view class="top">
						我的账户
					</view>
					<view class="bottom">
						充值/消费
					</view>
				</view>
				<view @click="goIntegral()" class="one-btn">
					<view class="top">
						我的积分
					</view>
					<view class="bottom">
						签到/消耗
					</view>
				</view>
			</view>
			<!-- 底部 -->
			<view class="page-bottom">
				<view class="tabs" :style="{top: navHeight*2 + 'rpx'}">
					<!-- #ifdef APP-PLUS -->
					<u-tabs :list="tabList" font-size="28" name="tabName" bg-color="#fff" :current="current"
						@change="tabChange" inactive-color="#949494" bar-height="6" bar-width="20">
					</u-tabs>
					<!-- #endif -->
					<!-- #ifndef APP-PLUS -->
					<u-tabs :list="tabList" font-size="28" name="tabName" bg-color="#fff" :current="current"
						@change="tabChange" inactive-color="#949494" bar-height="6" bar-width="20" height="40">
					</u-tabs>
					<!-- #endif -->

				</view>
				<view v-if="current === 0">
					<view class="f-wrap u-skeleton-fillet">
						<view class="title">基本信息</view>
						<view class="info-c">
							<view v-if="userInfo.type === 1" class="level-box">
								<view class="level">
									<u-icon name="level"></u-icon>
								</view>
								<text>{{appName}}官方账号</text>
							</view>
							<text>性别：{{userInfo.gender}}</text>
							
							
							<text v-if="userInfo.city">IP属地：{{userInfo.city}}</text>
							<text>个性签名：{{userInfo.intro}}</text>
							<text>
								经验等级：<text style="color:#ffb254;">LV{{ userInfo.level }}</text>
								<image style="height: 22rpx;margin-left:10rpx ;" mode="heightFix" v-if="userInfo.level"
									:src="$IMG+'/vip/level_'+userInfo.level+'.png'" class="level-img-2" />
							</text>
							
						</view>
					</view>

					<view class="f-wrap u-skeleton-fillet">
						<view class="title">标签</view>
						<view class="tag-box">
							<view v-for="(item,index) in userInfo.tagStr" :key="index" class="tag">{{item}}</view>
						</view>
					</view>
					<view v-if="createTopicList.length > 0" class="f-wrap u-skeleton-fillet">
						<view class="title">创建的圈子</view>
						<topic-list :list="userInfo.createTopicList" loadStatus="none"></topic-list>
					</view>
				</view>
				<view v-if="current === 1">
					<!-- #ifdef H5 -->
					<view v-if="postList.length ==0" style="background-color: #f7f7f7;height: 160rpx;"></view>
					<!-- #endif -->
					<post-list :list="postList" :loadStatus="loadStatus"></post-list>
				</view>
				<view v-if="current === 2">
					<topic-list :list="topicList"></topic-list>
				</view>
			</view>
		</view>

		<!-- 填写信息弹窗 -->
		<u-popup v-model="openPop" mode="center" border-radius="14">
			<view class="informationShow-box">
				<view class="flex-items flex-column informationShow-centent">
					<view class="mar-top-60">
						<label class="title">申请好友</label>
					</view>
					<view class="flex-items flex-row mar-top-60">
						<view class="fs26">备注</view>
						<input class="remark mar-left-20 fs26" v-model="message" />
					</view>
					<view class="flex-items flex-row mar-top-30 ">
						<label class="fs26">对方</label>
						<input class="nick mar-left-20 fs26" v-model="notation" disabled="disabled" />
					</view>
					<view class="flex-row-plus massageDes-but">
						<view class="exitBut" @click="outPop">取消</view>
						<view class="submitbut" @click="submitPop">提交</view>
					</view>
				</view>
			</view>
		</u-popup>
		<!-- 自定义加载 -->
		<toast  color="#fff" type="round"></toast>
	</view>
</template>
<script>
	import postList from '@/components/post-list/post-list.vue';
	import topicList from '@/components/topic-list/topic-list.vue';
	import {
		mapGetters
	} from 'vuex';
	import $store from '@/store/index.js';
	import websocket from '@/utils/websocket.js';
	export default {
		computed: {
			...mapGetters(['friendList', 'loginUserInfo', 'sessionList'])
		},
		components: {
			postList,
			topicList
		},
		data() {
			return {
				$IMG: this.$IMG,
				loading: true,
				background: {
					backgroundColor: 'unset'
				},
				tabList: [{
						tabName: '主页'
					}, {
						tabName: '帖子'
					},
					// {
					// 	tabName: '加入圈子'
					// }
				],
				current: 0,
				uid: 0,
				postList: [],
				topicList: [],
				userInfo: {},
				userJson: "",
				loadStatus: "loading",
				page: 1,
				currUid: 0,
				statusBarHeight: 0,
				navHeight: 0,
				navOpacity: 0,
				createTopicList: [],
				notation: '',
				message: '',
				openPop: false,
				appName: this.$c.miniappName
			};
		},
		onLoad(options) {
			
			this.navHeight = getApp().globalData.navHeight;
			this.statusBarHeight = getApp().globalData.statusBarHeight;
			if (options.uid) {
				this.uid = options.uid;
			} else {
				if (uni.getStorageSync('userInfo').uid) {
					this.uid = uni.getStorageSync('userInfo').uid;
				}
			}
			if (uni.getStorageSync('userInfo').uid) {
				this.currUid = uni.getStorageSync('userInfo').uid;
			}
			if (!$store.state.isSocketOpen) {
				websocket.initConnect()
			}
		},
		onShow() {
			if (uni.getStorageSync('hasLogin')) {
				this.getUserInfo();
				if (uni.getStorageSync('userInfo').uid) {
					this.currUid = uni.getStorageSync('userInfo').uid;
				}
			} else {
				this.$f.toast('请先登录哦')
				setTimeout(function() {
					uni.navigateTo({
						url:"/pages/user/go-login"
					})
				}, 1500);
			}
			if (!$store.state.isSocketOpen && uni.getStorageSync('hasLogin')) {
				websocket.initConnect()
			}
		},
		onReachBottom() {
			if (this.current == 1) {
				this.page++;
				this.getPostList();
			}
		},
		methods: {
			getFollow() {
				if (this.userInfo.isWatch) {
					this.$f.toast('TA设置了私密哦')
					return
				}
				this.$f.jump('/pages/my/follow?uid=' + this.userInfo.uid)
			},
			getFans() {
				if (this.userInfo.isFan) {
					this.$f.toast('TA设置了私密哦')
					return
				}
				this.$f.jump('/pages/my/fans?uid=' + this.userInfo.uid)
			},
			onBack() {
				let pages = getCurrentPages();
				if (pages.length > 1) {
					uni.navigateBack();
				} else {
					uni.switchTab({
						url: '/pages/index/index'
					});
				}
			},
			follow() {
				this.$H.post('user/addFollow', {
					id: this.userInfo.uid
				}).then(res => {
					if (res.code === 0) {
						this.userInfo.isFollow = true;
					} else {
						this.$u.toast(res.msg);
					}
				})
			},
			cancelFollow() {
				this.$H.post('user/cancelFollow', {
					id: this.userInfo.uid
				}).then(res => {
					if (res.code === 0) {
						this.userInfo.isFollow = false;
					}
				})
			},
			tabChange(index) {
				this.current = index;
				if (index === 1) {
					this.postList = [];
					this.getPostList();
				}
				if (index === 2) {
					this.getTopicList();
				}
			},
			getPostList() {
				if (this.userInfo.isPost) {
					this.$f.toast('TA设置了私密哦')
					this.postList = []
					this.loadStatus = "nomore";
					return
				}
				this.loadStatus = "loading";
				this.$H.post('post/getListByUid', {
					page: this.page,
					uid: this.uid,
					myUid: this.currUid
				}).then(res => {
					this.postList = this.postList.concat(res.result.data);
					if (res.result.current_page >= res.result.total || res.result.last_page === 0) {
						this.loadStatus = "nomore";
					} else {
						this.loadStatus = "loadmore"
					}
					//如果包含私密圈帖子 进行提示
					if(res.result.last_page < this.userInfo.postNum && res.result.current_page === 1){
						this.$u.toast('仅展示可见帖子')
					}
				})
			},
			getTopicList() {
				this.$H.post('topic/userJoinTopic', {
					uid: this.uid
				}).then(res => {
					this.topicList = res.result.data;
				})
			},
			getUserInfo() {
				this.$loading(true);
				this.$H.post('user/userInfoById', {
					uid: this.uid
				}).then(res => {
					this.userInfo = res.result;
					if (res.result.gender === 1) {
						this.userInfo.gender = '男'
					} else if (res.result.gender === 2) {
						this.userInfo.gender = '女'
					} else {
						this.userInfo.gender = '保密'
					}
					if (this.userInfo.createTopicList != null) {
						this.createTopicList = this.userInfo.createTopicList
					}

					let user = {
						uid: res.result.uid,
						username: res.result.username,
						avatar: res.result.avatar,
					}
					this.userJson = JSON.stringify(user)
					uni.setNavigationBarTitle({
						title: this.userInfo.username
					});
					this.loading = false;
					this.$loading(false);
				})
			},
			goPersonalData() {
				uni.navigateTo({
					url: '/pages/user/edit-info/edit'
				});
			},
			onPageScroll(e) {
				// 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
				this.scrollTop = e.scrollTop;
				// 滚动175rpx显示nav
				this.navOpacity = e.scrollTop / 50;
			},
			goIntegral() {
				uni.navigateTo({
					url: '/pages/sign/integral'
				})
			},
			goAccount() {
				uni.navigateTo({
					url: '/pages/account/account'
				})
			},
			goFollow() {
				uni.navigateTo({
					url: '/pages/my/follow'
				})
			},
			open() {
				this.openPop = true
				this.notation = this.userInfo.username
				//处理偶尔取不到当前用户信息的问题
				if (!this.loginUserInfo.username) {
					if (uni.getStorageSync('userInfo').username) {
						this.$store.state.loginUserInfo = uni.getStorageSync('userInfo')
					} else {
						this.$H.get('user/userInfo').then(res => {
							this.$store.state.loginUserInfo = res.result;
							this.message = '你好,我是' + res.result.username
						});
					}
				}
				this.message = '你好,我是' + this.$store.state.loginUserInfo.username

			},
			outPop() {
				this.openPop = false
			},
			//发送好友申请
			submitPop() {
				if (this.notation.trim() === '') {
					uni.showToast({
						title: '备注不允许为空',
						icon: 'none'
					})
					return
				}
				if (this.notation.trim().length > 20 || this.message.trim().length > 20) {
					uni.showToast({
						title: '字数不要超过20个字',
						icon: 'none'
					})
					return
				}
				if (!$store.state.isSocketOpen) {
					websocket.initConnect()
				}
				if (!this.loginUserInfo.uid) {
					uni.showToast({
						title: '你的账号信息过期请重新登录',
						icon: 'none'
					})
					return
				}
				//构造websocket消息
				let m = {
					senderId: this.loginUserInfo.uid,
					senderName: this.loginUserInfo.username,
					senderAvatar: this.loginUserInfo.avatar,
					receiverId: this.userInfo.uid,
					notation: this.notation.trim(),
					applyMessage: this.message.trim()
				}
				let msg = {
					type: 'person-apply',
					data: m
				}
				let that = this
				uni.sendSocketMessage({
					data: JSON.stringify(msg),
					success() {
						uni.showToast({
							icon: 'success',
							title: '发送成功'
						})
						that.openPop = false
					},
					fail(res) {
						websocket.initConnect()
						setTimeout(function() {
							that.retrySubmit();
						}, 1200);
					}
				})
			},
			//尝试重连
			retrySubmit() {
				console.log('尝试重连')
				let m = {
					senderId: this.loginUserInfo.uid,
					senderName: this.loginUserInfo.username,
					senderAvatar: this.loginUserInfo.avatar,
					receiverId: this.userInfo.uid,
					notation: this.notation.trim(),
					applyMessage: this.message.trim()
				}
				let msg = {
					type: 'person-apply',
					data: m
				}
				let that = this
				uni.sendSocketMessage({
					data: JSON.stringify(msg),
					success() {
						uni.showToast({
							icon: 'success',
							title: '发送成功'
						})
						that.openPop = false
					},
					fail(res) {
						uni.showToast({
							icon: 'none',
							title: '发送失败,请重试'
						})
						websocket.initConnect()
					}
				})
			},
			//跳转聊天页面
			gotoChat() {
				for (let i = 0; i < this.sessionList.length; i++) {
					if (this.sessionList[i].chattingUserId == this.userInfo.uid) {
						$store.state.chattingUserInfo = this.sessionList[i]
						break;
					}
				}
				this.$H.post('chat/list', {
					sessionId: $store.state.chattingUserInfo.sessionId,
					pageNum: 1,
					pageSize: 20
				}).then(res => {
					if (res.code == 0) {
						let data = res.data
						for (let i = 0; i < $store.state.personMessage.length; i++) {
							if ($store.state.personMessage[i].sessionId == data.sessionId) {
								let current = Number(data.pageInfo.current)
								let total = Number(data.pageInfo.total)
								let size = Number(data.pageInfo.size)
								$store.state.personMessage[i].lastMessageId = data.pageInfo.records
									.length != 0 ? data.pageInfo.records[0].id : 0
								$store.state.personMessage[i].list = data.pageInfo.records.reverse()
								$store.state.personMessage[i].pageNum = current
								$store.state.personMessage[i].hasNextPage = current * size < total
								break;
							}
						}
						uni.navigateTo({
							url: '/pages/im/chat/chat'
						})
					} else {
						uni.showToast({
							icon: 'none',
							mask: '消息加载失败'
						})
					}
				})

			},
		}
	}
</script>
<style>
	page {
		background-color: #f5f5f5;
	}
</style>
<style lang="scss" scoped>
	.back-wrap {
		background: url('https://demo.linfeng.tech/resource/images/user-bg.png') no-repeat;
		background-size: 750rpx 700rpx;
		padding-bottom: 80rpx;
	}

	.page-top {
		width: 750rpx;
		// height: 700rpx;
		padding: 30rpx;
		color: #ffffff;

		.setting {
			z-index: 999;
			background-color: #ffffff;
			width: 750rpx;
			position: fixed;
			top: 0;
			left: 0;
			padding-left: 50rpx;

			.setting-inner {
				display: flex;
				align-items: center;

				.nav-nickname {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 590rpx;
					font-size: 24rpx;
					font-weight: 500;
					color: #000000;
				}
			}

		}

		.setting-o {
			background-color: transparent;
		}

		.avatar {
			margin-top: 115rpx;
		}

		.some-btn {
			display: flex;
			align-items: center;
			margin-top: 100rpx;

			.num-name {
				width: 116rpx;

				.num {
					font-size: 32rpx;
					font-weight: 600;
					line-height: 45rpx;
				}

				.name {
					margin-top: 2rpx;
					font-size: 20rpx;
					line-height: 28rpx;
				}
			}

			.edit-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				margin-left: 150rpx;
				width: 184rpx;
				height: 64rpx;
				background-color: rgba(0, 0, 0, 0.6);
				border: 2rpx solid rgba(255, 255, 255, 0.6);
				border-radius: 100rpx;
				font-size: 24rpx;
				font-weight: 600;
			}

			.watch-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				margin-left: 60rpx;
				width: 124rpx;
				height: 54rpx;
				background-color: rgba(0, 0, 0, 0.6);
				border: 2rpx solid rgba(255, 255, 255, 0.6);
				border-radius: 100rpx;
				font-size: 24rpx;
				font-weight: 600;
			}

			.follow-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				margin-left: 60rpx;
				width: 124rpx;
				height: 54rpx;
				background-color: #f5f5f5;
				color: #544949;
				border: 2rpx solid rgba(255, 255, 255, 0.6);
				border-radius: 100rpx;
				font-size: 24rpx;
				font-weight: 600;
			}

			.chatButton {
				display: flex;
				align-items: center;
				justify-content: center;
				margin-left: 10rpx;
				width: 124rpx;
				height: 54rpx;
				background-color: #5f6166;
				border: 2rpx solid rgba(172, 172, 172, 0.6);
				border-radius: 100rpx;
				font-size: 24rpx;
				font-weight: 600;
			}
		}
	}

	.page-mid {
		display: flex;
		justify-content: space-around;
		padding-top: 50rpx;
		margin-top: 42rpx;
		width: 750rpx;
		height: 180rpx;
		background-color: #F9F9F9;
		border-top-left-radius: 30rpx;
		border-top-right-radius: 30rpx;

		// transform: translateY(-108rpx);
		.one-btn {
			display: flex;
			flex-direction: column;
			align-items: center;

			.top {
				font-size: 28rpx;
				font-weight: 600;
				color: #333333;
				line-height: 40rpx;
			}

			.bottom {
				margin-top: 10rpx;
				font-size: 24rpx;
				line-height: 33rpx;
				color: #999999;
			}
		}
	}

	.page-bottom {

		// transform: translateY(-108rpx);
		.tabs {
			background-color: #ffffff;
			position: sticky;
			top: 82rpx;
			z-index: 99;
			display: flex;
			justify-content: center;
			padding-top: 60rpx;
			width: 750rpx;
		}
	}

	.f-wrap {
		margin-bottom: 30rpx;
	}

	.avatar {
		width: 130rpx;
		height: 130rpx;
		border-radius: 50%;
		border: 2px solid #FFFFFF;
		z-index: 999;
	}

	.tab-box {
		margin-top: 30rpx;
		margin-bottom: 30rpx;
	}

	.info-c {
		display: flex;
		flex-direction: column;
	}

	.info-c>text {
		margin-bottom: 20rpx;
		color: #999;
	}

	.info-c .level-box {
		margin-bottom: 20rpx;
		display: flex;
		align-items: center;
		color: #999;

		.level {
			font-size: 20rpx;
			color: #fff;
			padding: 5rpx 10rpx;
			background-color: $themes-color;
			border-radius: 10rpx;
			margin-right: 10rpx;
		}
	}

	/* 标签 */
	.tag-box {}

	.tag-box .tag {
		padding: 10rpx 20rpx;
		border-radius: 20rpx;
		font-size: 24rpx;
		display: inline-block;
		margin-right: 20rpx;
		margin-bottom: 20rpx;
		background-color: #ffebe5;
	}

	.tag-box .tag:nth-child(2n) {
		background-color: #ecf9f2;
	}

	.tag-box .tag:nth-child(3n) {
		background-color: #fff7e5;
	}

	.tag-box .tag:nth-child(5n) {
		background-color: #b3e0ff;
	}

	.image3 {
		width: 75rpx;
		height: 30rpx;
		margin-left: 5rpx;
	}

	.title {
		font-size: 36upx;
		font-weight: 200;
	}

	

	.informationShow-box {
		.flex-items {
			input {
				padding-left: 16upx;
			}
		}

		.phoneStyle {
			input {
				background: #EEEEEE;
				color: #999999;
			}
		}

		.informationShow-centent {
			width: 520upx;
			height: 550upx;

			.remark {
				border: 1upx solid #DDDDDD;
				width: 300upx;
				height: 48upx;
			}

			.nick {
				border: 1upx solid #DDDDDD;
				width: 300upx;
				height: 48upx;
			}

			.massageDes-but {
				position: absolute;
				bottom: 0;
			}

			.exitBut {
				border: 1upx solid #E5E5E5;
				width: 260upx;
				height: 90upx;
				text-align: center;
				line-height: 90upx;
			}

			.submitbut {
				background-color: #323232;
				width: 260upx;
				height: 90upx;
				text-align: center;
				line-height: 90upx;
				color: #FFFFFF;
			}
		}
	}
</style>