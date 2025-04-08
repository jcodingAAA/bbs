<template>
	<view class="">
		<view class="box">
			<view class="platform">
				<!-- 头部 -->
				<view class="platform_top">
					<view class="platform_top_box" v-for="(item,index) in lotteryTime.list" :key="index"
						:class="platformIndex == index ? 'active' : ''">
						<text class="platform_top_box_title"
							@click="platformSwitch(item.lotteryType,index)">{{item.lotteryName}}</text>
					</view>
				</view>
			</view>
			<view class="" style="width: 100%;" v-if="liveShow">
				<view class="tixing-btn" @click="showChange()" v-if="!videoShow">
					<view class="tixing">
						<view class="triangle-top"></view> 展开直播
					</view>
				</view>
				<view style="width: 100%;" v-if="videoShow">
						<div id="mui-player"></div>
					<!-- 	<view class="live-box" v-show="!liveShow">
					直播暂未开始!
				</view> -->
				</view>
				<view class="tixing-btn" @click="videoShow = false" v-if="videoShow">
					<view class="tixing">
						<view class="triangle-bottom"></view> 收起直播
					</view>
				</view>
			</view>
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
				<view class="platform_tips">
					第{{lastLotteryRecord.nextId}}期
					{{lastLotteryRecord.date}}
					{{lastLotteryRecord.day}}
					{{lastLotteryRecord.time}}
				</view>
			</view>
		</view>
		<view class="video_body">
			<view class="video_top">
				<view class="left">
					开奖回放
				</view>
				<view class="right">
					更多开奖回放>>
				</view>
			</view>
			<view class="video_content">
				<view class="video_content_box" v-for="(item,index) in videoData" :key="index"
					@click="goVideo(item.videoUrl,item.title)">
					<image :src="item.pictureUrl" mode="widthFix"></image>
					<view class="text">
						{{item.title}}
					</view>
				</view>
			</view>
		</view>
		<!-- 推荐信息 -->
		<view class="recommend_body">
			<view class="recommend_box" v-for="(item,index) in recommendData" :key="index">
				<view class="recommend_top">
					{{item.year}}
					<view class="text">
						第{{item.period}}期
					</view>
					推荐
				</view>
				<view class="recommend_content" v-for="(itemChild,indexChild) in item.detailList" :key="indexChild">
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

	</view>
</template>

<script>
	import 'mui-player/dist/mui-player.min.css'
	import MuiPlayer from 'mui-player';
	import dayjs from 'dayjs'
	import Hls from 'hls.js'
	import allData from './data.js'
	export default {
		data() {
			return {
				timeShow: false,
				platformIndex: 0,
				videoShow: false,
				liveShow: false,
				showTag: false,
				showNotice: false,
				lotteryTime: {
					list: [],
				},
				getRecommendInfo: {
					page: 1,
					size: 10
				},
				getVideoInfo: {
					page: 1,
					size: 10
				},
				lastLotteryRecord: {},
				lotteryData: [],
				lotteryTypeId: null,
				// 数据假
				videoData: [],
				recommendData: [],
				mp: null,
				liveUrl: "",
				pageIndex: 0
			}
		},
		onLoad() {
			const lotteryTypeId = uni.getStorageSync('lotteryTypeId')
			if (lotteryTypeId) {
				this.lotteryTypeId = lotteryTypeId
			}
			// 开奖记录
			this.getLotteryRecord()
			// this.getRecommend()
			// this.getLive()
		},
		onReachBottom() {
			this.getRecommendInfo.page++;
			this.getRecommend('bottom')
		},
		onShow() {


		},
		onUnload() {
			if (this.mp) {
				this.mp.destroy()
			}
		},


		methods: {
			// 开奖记录
			getLotteryRecord() {
				this.$H.post('home/lotteryRecord/last', {})
					.then(res => {
						if (res.code == "0") {
							let platformIndex = null
							const data = res.data
							data.forEach((item, index) => {
								if (item.lotteryVO.lotteryTypeId == this.lotteryTypeId) {
									platformIndex = index
								}
								this.lotteryTime.list.push({
									lotteryName: item.name,
									lotteryTime: item.lotteryVO.lotteryTime.split(' ')[0],
								})
							})
							this.lotteryData = data
							this.platformSwitch('', platformIndex)
						}
					});
			},
			getRecommend(item) {
				this.$H.get('lottery/video/recommend/page', {
						lotteryTypeId: this.lotteryTypeId,
						...this.getRecommendInfo
					})
					.then(res => {
						if (res.code == "0") {
							if (item && item == 'bottom') {
								this.recommendData = this.recommendData.concat(res.data.data);
							} else {
								this.recommendData = res.data.data
							}
						}
					});
			},
			getVideo() {
				this.$H.get('lottery/video/video/page', {
						lotteryTypeId: this.lotteryTypeId,
						...this.getVideoInfo
					})
					.then(res => {
						if (res.code == "0") {
							this.videoData = res.data.data
						}
					});
			},
			getLive() {
				this.$H.get('lottery/video/live', {
						lotteryTypeId: this.lotteryTypeId,
					})
					.then(res => {
						if (res.code == "0") {
							this.liveUrl = res.data.liveUrl
							// this.$nextTick(() => {
							// 	// 初始化 MuiPlayer 插件，MuiPlayer 方法传递一个对象，该对象包括所有插件的配置
							// 	this.mp = new MuiPlayer({
							// 		container: document.getElementById("mui-player"),
							// 		src: "https://cph-msl.akamaized.net/hls/live/2000341/test/master.m3u8",
							// 		live: true,
							// 		parse: {
							// 			type: 'hls',
							// 			loader: Hls,
							// 			config: { // hls config to：https://github.com/video-dev/hls.js/blob/HEAD/docs/API.md#fine-tuning
							// 				debug: false,
							// 			},
							// 		},
							// 		pageHead: false,
							// 	});
							// })
						}
					});
			},
			platformSwitch(type, index = 0) {
				this.platformIndex = index
				const time = this.lotteryData[this.platformIndex].lotteryVO.nextLotteryTime.split(' ')
				this.lastLotteryRecord = {
					id: this.lotteryData[this.platformIndex].lotteryVO.period,
					nextId: Number(this.lotteryData[this.platformIndex].lotteryVO.period) + 1,
					date: time[0],
					day: this.$f.getWeek(time[0]),
					time: time[1].split(':')[0] + '点' + time[1].split(':')[1] + '分',
					numberList: this.lotteryData[this.platformIndex].lotteryVO.numberList
				}
				this.videoShow = false
				uni.setStorageSync('lotteryTypeId', this.lotteryData[this.platformIndex].lotteryVO.lotteryTypeId)
				this.lotteryTypeId = this.lotteryData[this.platformIndex].lotteryVO.lotteryTypeId
				this.getVideo()
				const date1 = dayjs(this.lotteryData[this.platformIndex].lotteryVO.nextLotteryTime);
				const date2 = dayjs(new Date());

				// 计算两个日期之间的差值（单位为分钟）
				const diffInMinutes = date2.diff(date1, 'minute');
				console.log(diffInMinutes)
				if (diffInMinutes > 20) {
					this.liveShow = true
					this.getLive()
				} else {
					this.liveShow = false
				}
				this.getRecommend()
			},
			showChange() {
				this.videoShow = true
				this.$nextTick(() => {
					// 初始化 MuiPlayer 插件，MuiPlayer 方法传递一个对象，该对象包括所有插件的配置
					this.mp = new MuiPlayer({
						container: document.getElementById("mui-player"),
						src: this.liveUrl,
						live: true,
						parse: {
							type: 'hls',
							loader: Hls,
							config: { // hls config to：https://github.com/video-dev/hls.js/blob/HEAD/docs/API.md#fine-tuning
								debug: false,
							},
						},
						pageHead: false,
					});
				})
			},
			goHistory() {
				uni.navigateTo({
					url: '/pages/lottery-history/lottery-history'
				})
			},
			goVideo(url, title) {
				uni.navigateTo({
					url: '/pages/lottery-venue/video?item=' + encodeURIComponent(JSON.stringify({
						...this.lastLotteryRecord,
						videoUrl: url,
						title: title
					}))
				})
			},
			refresh() {

			},
			//弹窗公告
			getPop() {

			},
			toSearch() {
				this.$f.jump('/pages/search/search')
			},
			closePop() {
				this.showNotice = false
			},
		}
	}
</script>

<style lang="scss" scoped>
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
			justify-content: space-between;
			padding: 0 24rpx;

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

	.live-box {
		width: 100%;
		height: 400rpx;
		background-color: #cccccc;
		text-align: center;
		line-height: 400rpx;
	}

	.tixing-btn {
		width: 100%;
		display: flex;
		justify-content: center;
		margin-top: 20rpx;

		.tixing {
			display: flex;
			align-items: center;
			color: white;
			padding: 4rpx 28rpx;
			font-size: 28rpx;
			background-image: url('../../static/icon/icon_tixing.png');
			background-size: 100% 100%;
		}
	}

	.triangle-top {
		width: 0;
		height: 0;
		border-top: 10rpx solid white;
		border-right: 10rpx solid transparent;
		border-left: 10rpx solid transparent;
		border-bottom: 10rpx solid transparent;
		margin-top: 20rpx;
	}

	.triangle-bottom {
		width: 0;
		height: 0;
		border-top: 10rpx solid transparent;
		border-right: 10rpx solid transparent;
		border-left: 10rpx solid transparent;
		border-bottom: 10rpx solid white;
	}
</style>