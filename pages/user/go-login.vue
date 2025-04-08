<template>
	<view class="container flex-items-plus flex-column">
		<view class="login-logoBox">
			<image class="login-logo" :src="logoUrl"></image>
		</view>
		<view class="loginTitle-text flex-column-plus flex-items font-color-666 fs26">
			<text>为了给您提供更好的服务</text>
			<text>我们需要您的授权</text>
		</view>
		<view>
			<!-- #ifdef H5 || APP-PLUS -->
			<view class="loginBut" @click="goMobileLogin">手机号登录</view>
			<view v-if="emailLogin=='1'&&openEmailRegister=='0'" class="loginButton" @click="goEmailLogin">邮箱登录</view>
			<view v-if="emailLogin=='1'&&openEmailRegister=='1'" class="loginButton" @click="goEmailLogin">邮箱登录/注册</view>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<view class="loginBut" @click="goWxLogin">微信登录</view>
			<!-- #endif -->
		</view>
		<!-- #ifdef H5 || APP-PLUS -->
		<view class="flex-row-plus mar-top-30">
			<text class="font-colors">还没有账号，</text>
			<view class="register-text" @click="goRegister">去注册</view>
		</view>
		<!-- #endif -->
		<view class="flex-row-plus mar-top-60">
			<text class="font-colors" @click="goBack">——暂不登录，再看看——</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				logoUrl: "",
				emailLogin: "",
				openEmailRegister: ""
			}
		},
		onLoad(options) {
			this.getSysInfo();
		},
		onShow() {
			uni.hideLoading()
		},

		methods: {
			getSysInfo() {
				this.$H.get('system/config').then(res => {
					this.logoUrl = res.logoUrl;
					this.emailLogin = res.emailLogin;
					this.openEmailRegister = res.openEmailRegister;
				});
			},
			goMobileLogin() {
				uni.navigateTo({
					url: './sms-login'
				})
			},
			goRegister() {
				uni.navigateTo({
					url: 'register'
				})
			},
			goBack(){
				uni.switchTab({
					url: '/pages/index/index'
				})
			},
			goEmailLogin() {
				uni.navigateTo({
					url: './email-login'
				})
			},
			goWxLogin() {
				uni.navigateTo({
					url: './login'
				})
			}


		}
	}
</script>

<style lang="scss">
	.container {
		background-color: #FFFFFF;
		height: 100vh;

		.login-logoBox {
			margin-top: -200rpx;

			.login-logo {
				width: 200rpx;
				height: 200rpx;
			}
		}

		.loginTitle-text {
			margin-top: 100rpx;
		}

		.goToHome {
			background: none;
			border: none;
			width: auto;
			margin-top: 50rpx;
			color: #999999;
			text-decoration: underline;

			&:after {
				display: none;
			}
		}

		.loginWxBut {
			background: #333333;
			color: #efece8;
			height: 88rpx;
			width: 600rpx;
			text-align: center;
			line-height: 88rpx;
			margin-top: 49rpx;
		}

		.loginBut {
			background-color: #333333;
			color: #efece8;
			height: 88rpx;
			width: 600rpx;
			text-align: center;
			line-height: 88rpx;
			margin-top: 30rpx;
			border-radius: 10rpx;
		}

		.loginButton {
			background-color: #959292;
			color: #efece8;
			height: 88rpx;
			width: 600rpx;
			text-align: center;
			line-height: 88rpx;
			margin-top: 30rpx;
			border-radius: 10rpx;
		}

		.register-text {
			color: #8b857d;
		}
	}
</style>
<style scoped>
	.loginWxBut::after {
		border-radius: 0 !important;
	}

	.flex-column-plus {
		display: flex;
		flex-direction: column
	}


	.fs28 {
		font-size: 28upx;
	}


	.font-colors {
		color: #adaca9;
	}

	.font-color-666 {
		color: #6887a9;
	}
</style>