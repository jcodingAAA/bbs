<template>
	<view>
		<view class="login">
			<image class="logo" :src="shareCover"></image>
			<text class="txt1">申请获取手机号登录</text>
			<text class="txt2">根据《网络安全法》等规定发帖评论等需要先绑定手机号哦</text>
			<button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber"
				style="background: #323232;color: #fff;margin-left: 20rpx;margin-right: 20rpx;border-radius: 40rpx;margin-bottom: 16rpx;">
				手机号授权</button>
			<text class="txt3" @click="goBack">暂不登录</text>
		</view>
		<weixinLogin :showPop="showPop" @info="updateWxInfo" @close="closePop"></weixinLogin>
		<!-- 用户隐私协议 -->
		<u-popup mode="center" mask-close-able="false" v-model="showPrivacy">
			<view class="popup-box">
				<view class="lf_privacy_title">
					{{title}}
				</view>
				<view class="lf_privacy_content">
					<text class="lf_privacy_txt">{{desc1}}</text>
					<text class="lf_privacy_txt lf_privacy_color" @click="openPrivacyContract">
						{{urlTitle}}
					</text>
					<text class="lf_privacy_txt">{{desc2}}</text>
				</view>
				<view class="lf_privacy_btn">
					<button class="lf_privacy_btn_refuse" @click="handleDisagree">拒绝</button>
					<button id="agree-btn" type="default" open-type="agreePrivacyAuthorization"
						class="lf_privacy_btn_refuse agree"
						@agreeprivacyauthorization="handleAgreePrivacyAuthorization">同意</button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import websocket from '@/utils/websocket.js';
	import $store from '@/store/index.js';
	import weixinLogin from "@/components/weixin-login/weixin-login.vue"
	export default {
		components: {
			weixinLogin
		},
		data() {
			return {
				domain: this.$H.domain,
				shareCover: "",
				showPop: false,
				showPrivacy: false,
				title: "用户隐私保护提示",
				desc1: "感谢您使用本产品，您使用本产品前应当仔细阅读并同意",
				urlTitle: "《小程序隐私保护指引》",
				desc2: "当您点击同意并开始使用产品服务时，即表示你已理解并同意该条款内容，该条款将对您产生法律约束力。如您拒绝，将无法更好的体验产品。",

			};
		},

		onLoad() {
			this.getSysInfo();
			if (wx.getPrivacySetting) {
				wx.getPrivacySetting({
					success: res => {
						console.log("是否需要授权：", res.needAuthorization, "隐私协议的名称为：", res.privacyContractName)
						if (res.needAuthorization) {
							this.showPrivacy = true
						} else {
							//如果已经授权过的话，那么直接走登录流程
							this.login();
						}
					},
					fail: () => {},
					complete: () => {},
				})
			}else{
				this.login();
			}
		},
		onShow() {

		},
		methods: {
			openPrivacyContract() {
				uni.openPrivacyContract({});
			},
			handleAgreePrivacyAuthorization() {
				this.showPrivacy = false;
				this.login()
			},
			handleDisagree() {
				this.showPrivacy = false;
				uni.switchTab({
					url: '/pages/index/index'
				});
			},
			goBack() {
				uni.reLaunch({
					url: '/pages/index/index'
				});
			},
			getSysInfo() {
				this.$H.get("system/miniConfig").then(res => {
					this.shareCover = res.result.intro;
				})
			},
			async login() {
				let that = this;
				let loginCode = await this.getLoginCode();
				that.$H.post('user/miniWxLogin', {
					code: loginCode,
				}).then(res2 => {
					if (res2.code === 0) {
						uni.setStorageSync("hasLogin", true);
						uni.setStorageSync("token", res2.token);
						$store.state.token = res2.token;
						that.getUserInfo();
					} else if (res2.code == 999) {
						console.log('手机号待获取')
						uni.hideLoading();
					}

				})
			},
			getUserInfo() {
				uni.showLoading({
					title: "自动登陆中"
				})
				this.$H.get("user/userInfo").then(res => {
					$store.state.loginUserInfo = res.result;
					uni.setStorageSync("userInfo", res.result)
					//连接websocket
					websocket.initConnect();
					//获取好友列表
					$store.dispatch('getFriendList');
					///获取通知消息
					$store.dispatch('getNoticeList');
					uni.hideLoading()
					let name = res.result.username
					//如果微信名称是默认的，那么需要弹框提醒用户设置昵称和用户名
					if (name.includes("LF_")) {
						this.showPop = true
					} else {
						uni.navigateBack()
					}

				})
			},
			getLoginCode() {
				return new Promise((resolve, reject) => {
					uni.login({
						provider: 'weixin',
						success: function(loginRes) {
							resolve(loginRes.code);
						}
					});
				});
			},

			getPhoneNumber(e) {
				if (e.detail.errMsg === "getPhoneNumber:ok") {
					console.log(e)
					uni.login({
						provider: 'weixin',
						success: (res) => {
							this.$H.post('user/getSessionKey', {
								code: res.code
							}).then(res1 => {
								if (res1.code == 0) {
									this.$H.post('user/bindWxPhone', {
										wechatOpenId: res1.openid,
										sessionKey: res1.session_key,
										encryptedData: e.detail.encryptedData,
										iv: e.detail.iv,
									}).then(res2 => {
										uni.setStorageSync("hasLogin", true);
										uni.setStorageSync("token", res2.result.token);
										this.showPop = true
									})
								}
							})

						},
						fail: () => {
							uni.showToast({
								title: "微信登录授权失败",
								icon: "none"
							});
						}
					})
				} else {
					uni.showToast({
						title: "获取手机授权失败",
						icon: "none"
					});
				}

			},
			closePop() {
				this.showPop = false
				uni.navigateBack()
			},
			updateWxInfo(obj) {
				var that = this;
				this.$H.post("user/userInfoEdit", {
					avatar: obj.avatarUrl,
					username: obj.nickName
				}).then(res => {
					if (res.code == 0) {
						that.userInfo()
					}
				})

			},
			userInfo() {
				this.$H.get("user/userInfo").then(res => {
					$store.state.loginUserInfo = res.result
					uni.setStorageSync("userInfo", res.result)
					this.showPop = false
					uni.navigateBack()
				})
			},

		}
	}
</script>

<style lang="scss" scoped>
	.login {
		display: flex;
		flex-direction: column;
		padding: 100rpx;
	}

	.login .logo {
		width: 230rpx;
		height: 230rpx;
		margin: 50rpx auto;
	}

	.login .txt1 {
		margin-bottom: 10rpx;
	}

	.login .txt2 {
		margin-bottom: 50rpx;
	}

	.login .txt3 {
		color: #8c8c8c;
		margin-bottom: 90rpx;
		text-align: center;
	}

	.user-avatar {
		width: 160rpx;
		height: 160rpx;
		border-radius: 50%;
		overflow: hidden;
		margin: 50rpx auto;
	}

	.user-name {
		font-size: 35rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #000;
		margin: 50rpx auto;
	}

	.popup-box {
		width: 80vw;
		overflow: hidden;
		background: #ffffff;
		padding: 30rpx;
		border-radius: 24rpx;

		.lf_privacy_title {
			font-size: 48rpx;
			font-family: Source Han Sans CN-Bold, Source Han Sans CN;
			font-weight: bold;
			color: #000000;
			line-height: 56rpx;
			text-align: center;
		}

		.lf_privacy_content {
			margin-top: 48rpx;
			text-indent: 2em;

			.lf_privacy_txt {
				font-size: 28rpx;
				font-family: Source Han Sans CN-Normal, Source Han Sans CN;
				font-weight: 400;
				color: #000000;
				line-height: 33rpx;
			}
		}

		.lf_privacy_btn {
			display: flex;
			justify-content: space-evenly;
			align-items: center;
			margin-top: 48rpx;

			.lf_privacy_btn_refuse {
				padding: 0 60rpx;
				margin: 0;
				background: none;
				font-size: 32rpx;
				font-family: Source Han Sans CN-Normal, Source Han Sans CN;
				font-weight: 400;
				color: #000000;
				line-height: 80rpx;
			}

			.agree {
				color: #ffffff;
				background: #00aa00;
			}
		}

		.lf_privacy_color {
			color: #aaaaff !important;
		}
	}
</style>