<template>
	<view class="my-account">
		<view class="wrapper">
		<!-- 	<view class="header">
				<view class="accountMain">
					<view class="account acea-row row-top row-between">
						<view class="assets">
							<view>总资产(元)</view>
							<view class="money">{{ now_money }}</view>
						</view>
						<navigator url="/pages/account/cash-out" class="recharge font-blue" v-if="canCash == '1'">提现
						</navigator>
						<navigator url="/pages/pay/pay" class="recharge font-blue" v-if="is_hide == '0'">充值</navigator>
					</view>
					<view class="cumulative acea-row row-top">
						<view class="item">
							<view>累计消费(元)</view>
							<view class="money">{{ orderStatusSum }}</view>
						</view>
					</view>
				</view>
			</view> -->
			<!-- <view class="nav acea-row row-middle">
				<view class="item" @click="goUserBill(0)">
					<view class="pictrue">
						<image src="/static/record1.png" />
					</view>
					<view>账单记录</view>
				</view>
				<view class="item" @click="goUserBill(1)">
					<view class="pictrue">
						<image src="/static/record2.png" />
					</view>
					<view>消费记录</view>
				</view>
				<view class="item" @click="goUserBill(2)" v-if="is_hide == '0'">
					<view class="pictrue">
						<image src="/static/record3.png" />
					</view>
					<view>充值记录</view>
				</view>
			</view> -->

			<view class="advert acea-row row-between-wrapper"></view>
			<!-- 积分区 -->
			<view class="header">
				<view class="another">
					<view class="account acea-row row-top row-between">
						<view class="assets">
							<view>总积分</view>
							<view class="money">{{ allIntegral }}</view>
						</view>
						<!-- <navigator @click="show = true" url="" class="recharge font-blue" v-if="exchange == '0'">兑换
						</navigator> -->
					</view>
					<view class="cumulative acea-row row-top">
						<view class="item">
							<view>累计使用</view>
							<view class="money">{{ consumer }}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="nav acea-row row-middle">
				<view class="item" @click="goUserIntegral(0)">
					<view class="pictrue">
						<image src="/static/record06.png" />
					</view>
					<view>积分记录</view>
				</view>
				<view class="item" @click="goUserIntegral(1)">
					<view class="pictrue">
						<image src="/static/record07.png" />
					</view>
					<view>支出记录</view>
				</view>
				<view class="item" @click="goUserIntegral(2)">
					<view class="pictrue">
						<image src="/static/record08.png" />
					</view>
					<view>收入记录</view>
				</view>
			</view>

			<!-- 兑换弹窗 -->
			<u-popup v-model="show" mode="center" border-radius="14">
				<view class="informationShow-box">
					<view class="flex-items flex-column informationShow-centent">
						<view class="mar-top-60">
							<label class="title">兑换余额</label>
						</view>
						<view class="flex-items flex-row mar-top-60">
							<view class="fs26">我的积分</view>
							<input class="remark mar-left-20 fs26" v-model="allIntegral" disabled="disabled" />
						</view>
						<view class="flex-items flex-row mar-top-30 ">
							<label class="fs26">可兑换额</label>
							<input class="nick mar-left-20 fs26" v-model="canRecharge" disabled="disabled" />
						</view>
						<view class="flex-items flex-row mar-top-30 ">
							<label class="fs26">兑换余额</label>
							<input class="nick mar-left-20 fs26" v-model="rechargeValue" type="number" />
						</view>
						<view class="flex-items flex-row mar-top-30 ">
							<label class="tipTxt">{{integral}}积分可兑换1元</label>
						</view>

						<view class="flex-row-plus massageDes-but">
							<view class="exitBut" @click="cancelSubmit">取消</view>
							<view class="submitbut" @click="submit">提交</view>
						</view>
					</view>
				</view>
			</u-popup>
		</view>

	</view>


</template>
<script>
	export default {
		name: 'account',

		props: {},
		data: function() {
			return {
				is_hide: '0',
				exchange: '0',
				now_money: 0,
				orderStatusSum: 0,
				recharge: 0,
				show: false,
				integral: 0, //积分兑换余额的比例
				allIntegral: 0, //用户总积分
				consumer: 0, //消费积分
				canRecharge: 0, //可以兑换的金额
				rechargeValue: '', //用户要兑换的金额
				canCash: '0'
			}
		},
		onShow: function() {
			this.getIndex()
		},
		methods: {
			goUserBill(types) {
				uni.navigateTo({
					url: '/pages/bill/bill?types=' + types
				});
			},
			goUserIntegral(type) {
				uni.navigateTo({
					url: '/pages/sign/integral?type=' + type
				});
			},
			getIndex: function() {
				let that = this
				this.$H.post('user/bill').then(
					res => {
						that.now_money = res.result.nowMoney
						that.orderStatusSum = res.result.orderStatusSum
						this.is_hide = res.result.isHide
						this.exchange = res.result.exchange
						this.consumer = res.result.consumer
						this.integral = res.result.integral
						this.allIntegral = res.result.allIntegral
						this.canRecharge = res.result.allIntegral / res.result.integral
						this.canCash = res.result.canCash
					},
					err => {
						uni.showToast({
							title: err.msg,
							icon: 'none',
							duration: 2000,
						})
					}
				)
			},
			cancelSubmit() {
				this.show = false;
			},
			//兑换
			submit() {
				if (this.canRecharge <= 0) {
					this.$u.toast('可兑换金额不足');
				}
				if (!this.rechargeValue) {
					this.$u.toast('请输入兑换金额');
					return;
				}
				var ret = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
				if (!ret.test(this.rechargeValue)) {
					this.$u.toast('输入金额不合法');
					return;
				}
				if (this.rechargeValue > this.canRecharge) {
					this.$u.toast('不能高于可兑换金额');
					return;
				}
				uni.showLoading({
					mask: true,
					title: '兑换中'
				});
				this.$H.post('bill/exchange', {
					rechargeValue: this.rechargeValue
				}).then(res => {
					if (res.code == 0) {
						uni.redirectTo({
							url: '/pages/bill/bill?types=0'
						})
					}
					uni.hideLoading();
				});


			},
		},
	}
</script>
<style lang="scss" scoped>
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

	.tipTxt {
		color: #888283;
		font-size: 22upx;
	}

	.title {
		font-size: 36upx;
		font-weight: 200;
	}
</style>

<style lang="less" scoped>
	.my-account .wrapper {
		background-color: #fff;
		padding: 0.32 * 100rpx 0 0.34 * 100rpx 0;
		margin-bottom: 0.14 * 100rpx;
	}

	.my-account .wrapper .header {
		width: 6.9 * 100rpx;
		height: 3.3 * 100rpx;
		background-image: linear-gradient(to right, #7e97f2 0%, #0b96f9 100%);
		background-image: -moz-linear-gradient(to right, #eb3729 0%, #eb3729 100%);
		border-radius: 0.16 * 100rpx;
		margin: 0 auto;
		color: rgba(255, 255, 255, 0.6);
		font-size: 0.24 * 100rpx;
	}

	.my-account .wrapper .header .accountMain {
		background-image: url('https://demo.linfeng.tech/resource/images/white-bg.png');
		background-repeat: no-repeat;
		background-size: 100%;
		height: 100%;
		width: 100%;
		padding: 0.36 * 100rpx 0 0.29 * 100rpx 0;
	}

	.my-account .wrapper .header .accountMain .account {
		padding: 0 0.35 * 100rpx;
	}

	.my-account .wrapper .header .accountMain .account .assets .money {
		font-size: 0.72 * 100rpx;
		color: #fff;
		font-family: 'GuildfordProBook 5';
		margin-top: 0.1 * 100rpx;
		height: 0.75 * 100rpx;
		line-height: 0.75 * 100rpx;
	}

	.my-account .wrapper .header .accountMain .account .recharge {
		font-size: 0.28 * 100rpx;
		width: 1.5 * 100rpx;
		height: 0.54 * 100rpx;
		border-radius: 0.27 * 100rpx;
		background-color: #fff9f8;
		text-align: center;
		line-height: 0.54 * 100rpx;
	}

	.my-account .wrapper .header .accountMain .cumulative {
		margin-top: 0.46 * 100rpx;
	}

	.my-account .wrapper .header .accountMain .cumulative .item {
		flex: 1;
		-o-flex: 1;
		-ms-flex: 1;
		padding-left: 0.35 * 100rpx;
	}

	.my-account .wrapper .header .accountMain .cumulative .item .money {
		font-size: 0.48 * 100rpx;
		font-family: 'GuildfordProBook 5';
		color: #fff;
		margin-top: 0.06 * 100rpx;
	}

	.my-account .wrapper .header .another {
		width: 6.9 * 100rpx;
		height: 3.3 * 100rpx;
		background-image: linear-gradient(to right, #aaaaff 0%, #ffaa7f 100%);
		background-image: -moz-linear-gradient(to right, #eb3729 0%, #eb3729 100%);
		border-radius: 0.16 * 100rpx;
		margin: 0 auto;
		color: rgba(255, 255, 255, 0.6);
		font-size: 0.24 * 100rpx;
	}

	.my-account .wrapper .header .another {
		background-repeat: no-repeat;
		background-size: 100%;
		height: 100%;
		width: 100%;
		padding: 0.36 * 100rpx 0 0.29 * 100rpx 0;
	}

	.my-account .wrapper .header .another .account {
		padding: 0 0.35 * 100rpx;
	}

	.my-account .wrapper .header .another .account .assets .money {
		font-size: 0.72 * 100rpx;
		color: #fff;
		font-family: 'GuildfordProBook 5';
		margin-top: 0.1 * 100rpx;
		height: 0.75 * 100rpx;
		line-height: 0.75 * 100rpx;
	}

	.my-account .wrapper .header .another .account .recharge {
		font-size: 0.28 * 100rpx;
		width: 1.5 * 100rpx;
		height: 0.54 * 100rpx;
		border-radius: 0.27 * 100rpx;
		background-color: #fff9f8;
		text-align: center;
		line-height: 0.54 * 100rpx;
	}

	.my-account .wrapper .header .another .cumulative {
		margin-top: 0.46 * 100rpx;
	}

	.my-account .wrapper .header .another .cumulative .item {
		flex: 1;
		-o-flex: 1;
		-ms-flex: 1;
		padding-left: 0.35 * 100rpx;
	}

	.my-account .wrapper .header .another .cumulative .item .money {
		font-size: 0.48 * 100rpx;
		font-family: 'GuildfordProBook 5';
		color: #fff;
		margin-top: 0.06 * 100rpx;
	}

	.my-account .wrapper .nav {
		height: 1.55 * 100rpx;
		border-bottom: 1px solid #f5f5f5;
	}

	.my-account .wrapper .nav .item {
		flex: 1;
		-o-flex: 1;
		-ms-flex: 1;
		text-align: center;
		font-size: 0.26 * 100rpx;
		color: #999;
	}

	.my-account .wrapper .nav .item .pictrue {
		width: 0.44 * 100rpx;
		height: 0.44 * 100rpx;
		margin: 0 auto;
		margin-bottom: 0.2 * 100rpx;
	}

	.my-account .wrapper .nav .item .pictrue image {
		width: 100%;
		height: 100%;
	}

	.my-account .wrapper .advert {
		padding: 0 0.3 * 100rpx;
		margin-top: 0.3 * 100rpx;
	}

	.my-account .wrapper .advert .item {
		background-color: #fff6d1;
		width: 3.32 * 100rpx;
		height: 1.18 * 100rpx;
		border-radius: 0.1 * 100rpx;
		padding: 0 0.27 * 100rpx 0 0.25 * 100rpx;
		font-size: 0.24 * 100rpx;
		color: #e44609;
	}

	.my-account .wrapper .advert .item.on {
		background-color: #fff3f3;
		color: #e96868;
	}

	.my-account .wrapper .advert .item .pictrue {
		width: 0.78 * 100rpx;
		height: 0.78 * 100rpx;
	}

	.my-account .wrapper .advert .item .pictrue image {
		width: 100%;
		height: 100%;
	}

	.my-account .wrapper .advert .item .text .name {
		font-size: 0.3 * 100rpx;
		font-weight: bold;
		color: #f33c2b;
		margin-bottom: 0.07 * 100rpx;
	}

	.my-account .wrapper .advert .item.on .text .name {
		color: #f64051;
	}

	.my-account .wrapper .list {
		padding: 0 0.3 * 100rpx;
	}

	.my-account .wrapper .list .item {
		margin-top: 0.44 * 100rpx;
	}

	.my-account .wrapper .list .item .picTxt .iconfont {
		width: 0.82 * 100rpx;
		height: 0.82 * 100rpx;
		border-radius: 50%;
		background-image: linear-gradient(to right, #ff9389 0%, #f9776b 100%);
		background-image: -moz-linear-gradient(to right, #ff9389 0%, #f9776b 100%);
		text-align: center;
		line-height: 0.82 * 100rpx;
		color: #fff;
		font-size: 0.4 * 100rpx;
	}

	.my-account .wrapper .list .item .picTxt .iconfont.yellow {
		background-image: linear-gradient(to right, #ffccaa 0%, #fea060 100%);
		background-image: -moz-linear-gradient(to right, #ffccaa 0%, #fea060 100%);
	}

	.my-account .wrapper .list .item .picTxt .iconfont.green {
		background-image: linear-gradient(to right, #a1d67c 0%, #9dd074 100%);
		background-image: -moz-linear-gradient(to right, #a1d67c 0%, #9dd074 100%);
	}

	.my-account .wrapper .list .item .picTxt {
		width: 4.28 * 100rpx;
		font-size: 0.3 * 100rpx;
		color: #282828;
	}

	.my-account .wrapper .list .item .picTxt .text {
		width: 3.17 * 100rpx;
	}

	.my-account .wrapper .list .item .picTxt .text .infor {
		font-size: 0.24 * 100rpx;
		color: #999;
		margin-top: 0.05 * 100rpx;
	}

	.my-account .wrapper .list .item .bnt {
		font-size: 0.26 * 100rpx;
		color: #282828;
		width: 1.56 * 100rpx;
		height: 0.52 * 100rpx;
		border: 1px solid #ddd;
		border-radius: 0.26 * 100rpx;
		text-align: center;
		line-height: 0.5 * 100rpx;
	}

	.my-account .wrapper .list .item .bnt.end {
		font-size: 0.26 * 100rpx;
		color: #aaa;
		background-color: #f2f2f2;
		border-color: #f2f2f2;
	}

	.my-account .wrapper .integralShow {
		margin-top: 100rpx;
	}

	.my-account .wrapper .integralShow .buttonShow {
		margin-top: 80rpx;
	}

	.my-account .wrapper .integralShow .tipTxt {
		align-items: center;
		font-size: 30rpx;
		color: #aaaaff;
		margin-top: 30rpx;
	}

	.font-blue {
		color: #64B5F6 !important;
	}
</style>