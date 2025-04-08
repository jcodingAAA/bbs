<template>
	<view>
		<view class="mask"></view>
		<view>
			<view class="messBox">
				<view class="wrapBox">
					<view class="title">重要通知</view>
					<view class="desc">
						<swiper class="swiper" circular :indicator-dots="true" :autoplay="true" :interval="5000"
							:duration="500" :indicator-active-color="'#07C160'">
							<swiper-item v-for="(item,index) in content" :key="index">
								<image :src="item.picUrl" style="width: 100%;" mode="widthFix"></image>
								<view style="font-size: 28rpx;line-height: 36rpx;padding-bottom: 40rpx;">{{item.content}}</view>
							</swiper-item>
						</swiper>
					</view>
					<view class="btn">
						<view class="left" @click="closePop('left')">
							关闭
						</view>
						<view class="right" @click="closePop('right')">
							不再提示
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: ''
			},
			content: {
				type: Array,
				default: []
			}
		},
		data() {
			return {};
		},
		methods: {
			closePop(text) {
				if(text == 'right') {
					uni.setStorageSync('bulletin','0')
				}
				this.$emit('closePop');
			},

		}
	}
</script>

<style lang="scss">
	.mask {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 888;
		background-color: rgba(0, 0, 0, 0.6);
	}

	.btn {
		width: 100%;
		display: flex;
		justify-content: center;
		padding-bottom: 20rpx;
		view {
			width: 200rpx;
			font-size: 30rpx;
			text-align: center;
		}
		.left {
			border-right: 1px solid #cccccc;
			color: #cfcfcf;
			
		}
		.right {
			color: #07C160;
		}
	}


	.messBox {
		position: fixed;
		top: 12%;
		z-index: 998;
		width: 90%;
		left: 5%;
		padding: 10rpx 0rpx;

		.wrapBox {
			background-color: #fff;
			border-radius: 20rpx;
			overflow: hidden;

			.title {
				background-color: #07C160;
				line-height: 80rpx;
				color: white;
				text-align: center;
				font-size: 32rpx;
				font-weight: bold;
			}

			.desc {
				height: 900rpx;
				padding: 0 16rpx;
				margin-top: 20rpx;
				font-size: 30rpx;
			}
		}
	}

	.swiper {
		height: 100%;
	}

	.desc {
		height: 230rpx;
		overflow: scroll;
		margin-top: 10rpx;
		font-size: 30rpx;
		color: #666;
		line-height: 50rpx;
	}

	.btnbox {
		display: flex;
		justify-content: space-around;
		margin: 40rpx 0rpx 20rpx 0rpx;
		margin-top: 50rpx;

		.btnno {
			padding: 10rpx 30rpx;
			background-color: #f8f8f8;
			border-radius: 10rpx;
			font-size: 30rpx;
			color: #666;
		}

		.btnUp {
			padding: 10rpx 30rpx;
			background-color: #4884FF;
			border-radius: 10rpx;
			font-size: 30rpx;
			color: #fff;
		}
	}
</style>