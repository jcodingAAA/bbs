<template>
	<view class="">
		<view id="navbar" class="lf-nav" :style="{paddingTop:statusBarHeight +'px'}">
			<view class="lf-all">
				<view class="lf-all-nav" :style="{height: navigationBarHeight+'px'}">
					<u-icon name="arrow-left" size="28rpx" @click="goBack" />
					<text style="font-size: 28rpx;">{{lastLotteryRecord.title}}回放视频</text>
					<view class="" style="width: 50rpx;">
						<u-icon name="calendar" size="28rpx" color="#07C160" @click="yearPicker" v-if="topSwitch" />
					</view>
				</view>
			</view>
		</view>
		<video :src="lastLotteryRecord.videoUrl" style="width: 100%;" class="lf-top"></video>
		<view class="box">
			<!-- 内容 -->
			<view class="platform_content">
				<view class="platform_content_top">
					<view class="platform_content_left">第<view style="color: #07C160;margin: 0 4rpx;">
							{{lastLotteryRecord.id}}
						</view>期开奖结果</view>
					<view class="platform_content_right" @click="goHistory()">
						历史记录
					</view>
				</view>
				<view class="platform_data">
					<view class="platform_data_box" v-for=" (item,index) in lastLotteryRecord.numberList" :key="index">
						<view style="font-size: 40rpx;font-weight: bold;margin-top: 8rpx;margin-right: 15rpx;"
							v-if="index == lastLotteryRecord.numberList.length - 1">
							+
						</view>
						<view class="platform_data_ball">
							<view class="number"
								:class="item.color == '1' ? 'ball_red' : item.color == '2' ? 'ball_blue' : 'ball_green'">
								<view class="ball_big">
									{{item.number}}
								</view>
								<view class="ball_small">

								</view>
							</view>
							<view class="text">
								{{item.wuXing}}/{{item.shengXiao}}
							</view>
						</view>
					</view>
				</view>
			</view>
		
		</view>
		<!-- 首页轮播 -->
		<view class="banner">
			<swiper class="swiper" circular :indicator-dots="true" :autoplay="true" :interval="5000" :duration="500"
				:indicator-active-color="'#ffffff'">
				<swiper-item v-for="(item,index) in listWheelAdvert" :key="item.id" @click="goUrl(item)">
					<image :src="item.img" style="width: 100%;" mode="widthFix"></image>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	import allData from './data.js'
	export default {
		data() {
			return {
				platformIndex: 0,
				lastLotteryRecord: {},
				listWheelAdvert: [],
			}
		},
		onLoad(option) {
			this.navigationBarHeight = getApp().globalData.navigationBarHeight;
			this.statusBarHeight = getApp().globalData.statusBarHeight;
			const lotteryTypeId = uni.getStorageSync('lotteryTypeId')
			if (lotteryTypeId) {
				this.lotteryTypeId = lotteryTypeId
			}
			const item = JSON.parse(decodeURIComponent(option.item));
			this.lastLotteryRecord = item
			this.getBanner()
		},
		onReachBottom() {
		},
		onShow() {},
		methods: {
			// 开奖记录
			getBanner() {
				this.$H.post('link/list', {
						cateId: 0,
						page: 1,
					})
					.then(res => {
						if (res.code == "0") {
							this.listWheelAdvert = res.result
						}
					});
			},
			goBack() {
				uni.navigateBack({
					delta: 1
				});
			},
			goUrl(item)  {
				if(item.url) {
					uni.navigateTo({
						url: item.url
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.index-con {
		background-color: white;
	}
	
	.lf-nav {
		width: 100%;
		border: 1px solid #fcfcfc;
		background-color: #ffffff;
		position: fixed;
		top: 0;
		z-index: 8;
	}
	
	.lf-all {
		display: flex;
		flex-direction: column;
	}
	
	.lf-all-nav {
		display: flex;
		justify-content: space-between;
		margin: 0 15rpx;
		align-items: center;
	}
	
	.lf-top {
		/* #ifdef H5*/
		margin-top: 90rpx;
		/* #endif */
		/* #ifdef MP */
		margin-top: 242rpx;
		/* #endif */
		/* #ifdef APP-PLUS */
		margin-top: 242rpx;
		/* #endif */
	
	}
	
	.box {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 24rpx 8rpx;
		background-color: #f5f5f5;

		.platform {
			width: 99%;

			.platform_top {
				display: flex;
				justify-content: space-between;

				.platform_top_box {
					width: 100%;
					display: flex;
					flex-direction: column;
					align-items: center;
					background-color: white;
					border: 1px solid #07C160;

					.platform_top_box_title {
						font-size: 28rpx;
						font-weight: bold;
					}

					.platform_top_box_text {
						font-size: 20rpx;
					}
				}

				.active {
					background-color: #07C160;

					text {
						color: white
					}
				}
			}
		}

		.platform_content {
			border: 1px solid #07C160;
			padding-bottom: 24rpx;
			width: 99.2%;

			.platform_content_top {
				display: flex;
				justify-content: space-between;
				padding: 16rpx 24rpx;
				align-items: center;

				.platform_content_left {
					display: flex;
					font-size: 25rpx;
					color: #666;
				}

				.platform_content_right {
					color: #07C160;
					font-size: 25rpx;
				}
			}
		}

		.platform_data {
			width: 100%;
			display: flex;
			padding: 0 24rpx;
			justify-content: space-between;
			align-items: center;

			.platform_data_box {
				display: flex;

				.platform_data_ball {
					.number {
						width: 88rpx;
						height: 88rpx;
						border-radius: 50rpx;
						position: relative;

						.ball_big {
							width: 72rpx;
							height: 72rpx;
							border-radius: 50rpx;
							background-color: white;
							position: absolute;
							top: 4rpx;
							left: 4rpx;
							text-align: center;
							line-height: 72rpx;
							color: #666;
							font-weight: bold;
							font-size: 38rpx;
						}

						.ball_small {
							width: 20rpx;
							height: 20rpx;
							background-color: white;
							position: absolute;
							bottom: 8rpx;
							right: 10rpx;
							border-radius: 50%;
							transform: rotate(135deg) scale(1, 0.5);
						}
					}

					.ball_red {
						background-color: rgb(255, 51, 51);
					}

					.ball_blue {
						background-color: rgb(51, 153, 255);
					}

					.ball_green {
						background-color: rgb(19, 203, 70);
					}
				}

				.text {
					text-align: center;
					font-size: 26rpx;
					color: #666;
					margin-top: 6rpx;
				}
			}
		}

		.platform_tips {
			text-align: center;
			color: #eb5252;
			font-size: 26rpx;
			margin-top: 10rpx;
		}

	}

	.video_body {
		width: 99%;

		.video_top {
			padding: 16rpx;
			width: 100%;
			display: flex;
			justify-content: space-between;
			font-size: 26rpx;

			.right {
				color: #07C160;
			}
		}

		.video_content {
			width: 100%;
			display: flex;
			flex-flow: wrap;
			justify-content: space-around;

			.video_content_box {
				width: 47%;
				box-shadow: 0px 5rpx 5rpx #cccccc;
				margin-bottom: 14rpx;
				text-align: center;

				image {
					width: 100%;
				}

				.text {
					height: 60rpx;
					line-height: 60rpx;
					font-size: 28rpx;
				}
			}
		}
	}

	.recommend_body {
		width: 100%;

		.recommend_box {
			width: 100%;

			.recommend_top {
				display: flex;
				background-color: rgb(234, 244, 254);
				padding-left: 8rpx;
				font-size: 26rpx;

				.text {
					color: #07C160;
					margin-left: 8rpx;
				}
			}

			.recommend_content {
				padding: 0 16rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 60rpx;
				line-height: 60rpx;

				.left {
					display: flex;
					font-size: 26rpx;

					.left_text {
						margin-left: 12rpx;
					}
				}

				.right {
					.right_box {
						font-size: 26rpx;
						padding: 0 14rpx;
						background-color: #eb5252;
						color: white;
						border-radius: 50rpx;
						height: 34rpx;
						line-height: 34rpx;
					}
				}
			}
		}
	}
	.banner {
		margin-top: 105rpx;
	}
</style>