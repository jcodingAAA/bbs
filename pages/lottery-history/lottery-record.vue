<template>
	<view class="index-con">
		<!-- 信息 -->
		<view class="box lf-top" style="padding-top: 0;">
			<view class="lottery">
				<!-- 内容 -->
				<view class="platform_body">
					<view class="platform_title">
						<view class="text">
							第{{data.period}}期最新开奖结果
						</view>
						<view class="date">
							{{data.lotteryTime.split(' ')[0]}}
						</view>
					</view>
					<view class="platform_content">
						<view class="platform_data">
							<view class="platform_data_box" v-for=" (itemChild,index) in data.numberList" :key="index">
								<view style="font-size: 40rpx;font-weight: bold;margin-top: 8rpx;margin-right: 15rpx;"
									v-if="index == data.numberList.length - 1">
									+
								</view>
								<view class="platform_data_ball">
									<view class="number"
										:class="itemChild.color == '1' ? 'ball_red' : itemChild.color == '2' ? 'ball_blue' : 'ball_green'">
										<view class="ball_big">
											{{itemChild.number}}
										</view>
										<view class="ball_small">

										</view>
									</view>
									<view class="text">
										{{itemChild.wuXing}}/
										{{itemChild.shengXiao}}
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="introduce-body">
				<view class="introduce-box">
					特码单双: {{recordData.specialOdevity}}
				</view>
				<view class="introduce-box right">
					特码大小:{{recordData.specialSize}}
				</view>
				<view class="introduce-box">
					总和大小:{{recordData.totalSize}}
				</view>
				<view class="introduce-box right">
					总和单双:{{recordData.totalOdevity}}
				</view>
			</view>
			<!-- 推荐信息 -->
			<view class="recommend_body" v-if="recordData.recommend && recordData.recommend.year">
				<view class="recommend_box">
					<view class="recommend_top">
						{{recordData.recommend.year}} <view class="text">
							第{{recordData.recommend.period}}期
						</view> 
						推荐
					</view>
					<view class="recommend_content" v-for="(itemChild,indexChild) in recordData.recommend.detailList" :key="indexChild">
						<view class="left">
							{{itemChild.name}}:
							<view class="left_text" v-for="(itemVal,indexVal) in itemChild.valueList" :key="indexVal">
								{{itemVal}}
							</view>
						</view>
						<view class="right">
							<view class="right_box" v-if="itemChild.right == 1">
								中奖
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 详情信息 -->
			<view class="recommend_body">
				<view class="recommend_box" v-for="(item,index) in recordData.detailList" :key="index">
					<view class="recommend_content">
						<view class="left">
							{{item.key}}:
							<view class="left_text" >
								{{item.value}}
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>

</template>
<script>
	export default {
		data() {
			return {
				data: {},
				recordData: {}
				// 数据假
			};
		},
		onLoad(option) {
			if(option.item) {
				const item = JSON.parse(decodeURIComponent(option.item));
				this.data = item
				console.log(item)
				this.getDetails()
			}
			// 开奖记录

			// this.getLotteryRecord()
		},
		onShow() {

		},

		methods: {
			// 开奖记录
			getDetails() {
				this.$H.get('home/lotteryRecord/details', {
						lotteryId: this.data.id
					})
					.then(res => {
						if (res.code == "0") {
							this.recordData = res.data
						}
					});
			},
		}
	};
</script>

<style lang="scss" scoped>
	.index-con {
		background-color: white;
	}

	.box {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 8rpx;
		background-color: white;

		.platform {
			width: 99%;

			.active {
				background-color: #07C160;

				text {
					color: white
				}
			}
		}
	}


	.lottery {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}


	.platform_body {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;

		.platform_title {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 28rpx;

			.date {
				font-size: 24rpx;
				color: #888888;
			}
		}
	}

	.platform_content {
		background-color: white;
		border: 1px solid #07C160;
		padding: 20rpx 0;
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
				font-size: 26rpx;
				color: #666;
				margin-top: 6rpx;
				display: flex;
				justify-content: center;
			}
		}
	}
	.introduce-body {
		width: 100%;
		margin-top: 12rpx;
		border-top: 1px solid #f5f5f5;
		padding: 12rpx 36rpx;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		.introduce-box {
			width: 50%;
			font-size: 28rpx;
			margin-top: 12rpx;
		}
		.right {
			text-align: right;
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
</style>