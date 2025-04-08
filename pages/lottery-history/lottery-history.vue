<template>
	<view class="index-con" :style="{paddingTop:navbarHeight +'px'}">
		<!-- 头部信息 -->
		<view id="navbar" class="lf-nav" :style="{paddingTop:statusBarHeight +'px'}">
			<view class="lf-all">
				<view class="lf-all-nav" :style="{height: navigationBarHeight+'px'}">
					<u-icon name="arrow-left" size="28rpx" @click="goBack" />
					<text style="font-size: 28rpx;">历史开奖</text>
					<view class="" style="width: 50rpx;">
						<u-icon name="calendar" size="28rpx" color="#07C160" @click="yearPicker" v-if="topSwitch" />
					</view>
				</view>
			</view>
		</view>
		<!-- 信息 -->
		<view class="box lf-top" style="padding-top: 0;">
			<view class="top_switch">
				<view class="left" :style="{color: topSwitch ? '#07C160' : ''}" @click="switchChange(true)">
					开奖记录
				</view>
				<view class="right" :style="{color: !topSwitch ? '#07C160' : ''}" @click="switchChange(false)">
					开奖日期
				</view>
			</view>
			<view class="lottery" v-if="topSwitch">
				<view class="data_sort">
					<view class="title">
						{{ year }}年历史开奖结果
					</view>
					<view class="sort_box">
						<view class="" v-if="sortSwitch" @click="sortChange(2)">
							降序
						</view>
						<view class="" v-else @click="sortChange(1)">
							升序
						</view>
						<view :style="{background: fiveSwicth ? '#07C160' : '',color: fiveSwicth ? 'white' : ''}"
							@click="fiveSwicthChange()">
							五行
						</view>
						<view>
							<uni-data-select v-model="numSort" :clear="false" :localdata="sortOptions"
								@change="numSortChange"></uni-data-select>
						</view>
					</view>
				</view>
				<!-- 内容 -->
				<view class="platform_body" v-for=" (item,index) in lotteryData" :key="item.id" @click="goRecord(item)">
					<view class="platform_title">
						<view class="text">
							第{{item.period}}期最新开奖结果
						</view>
						<view class="date">
							{{item.lotteryTime.split(' ')[0]}}
						</view>
					</view>
					<view class="platform_content">
						<view class="platform_data">
							<view class="platform_data_box" v-for=" (itemChild,index) in item.numberList" :key="index">
								<view style="font-size: 40rpx;font-weight: bold;margin-top: 8rpx;margin-right: 15rpx;"
									v-if="index == item.numberList.length - 1">
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
										<view v-if="fiveSwicth">
											{{itemChild.wuXing}}/
										</view>
										{{itemChild.shengXiao}}
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="ottery_date" v-else>
				<view class="tips_box">
					<view class="tips">
						<view class="title">
							简介
						</view>
						<view class="text">
							搅珠日期对照表，可查看当月及下一个月的搅珠开奖日期
						</view>
					</view>
				</view>
				<view class="date">
					<ren-calendar ref='ren' :markDays='markDays' :collapsible="false"
						@onDayClick='onDayClick'></ren-calendar>
					<view class="check_date">选中日期：{{curDate}}</view>
				</view>
			</view>
		</view>
		<!-- 返回顶部 -->
		<lf-back-top :show-tag="showTag"></lf-back-top>
		<!-- 自定义加载 -->
		<toast color="#fff" type="rotate3"></toast>
		<!-- 年份选择 -->
		<u-picker v-model="yearShow" mode="time" :params="{year:true}" :end-year="nowYear" @confirm="yearChange"
			title="年份选择" :default-time="`${year}-01-01`"></u-picker>
	</view>

</template>
<script>
	import renCalendar from '@/components/ren-calendar/ren-calendar.vue'
	export default {
		components: {
			renCalendar
		},
		data() {
			return {
				navbarHeight: 0,
				navigationBarHeight: 0,
				statusBarHeight: 0,
				platformIndex: 0,
				page: 1,
				showTag: false,
				topSwitch: true,
				sortSwitch: true,
				lastLotteryRecord: {},
				lotteryData: [],
				year: null,
				numSort: '',
				timeSort: 2,
				fiveSwicth: true,
				yearShow: false,
				nowYear: null,
				sortOptions: [{
						text: '默认排序',
						value: '',
					},
					{
						text: '平码升序',
						value: 1,
					},
					{
						text: '平码降序',
						value: 2,
					}
				],
				// 开奖日期
				curDate: '',
				markDays: []
				// 数据假
			};
		},
		onLoad() {
			this.navigationBarHeight = getApp().globalData.navigationBarHeight;
			this.statusBarHeight = getApp().globalData.statusBarHeight;
			this.year = new Date().getFullYear()
			this.nowYear = new Date().getFullYear()
			// 开奖记录

			this.getLotteryRecord()
		},
		onReady() {
			let today = this.getToday().date;
			this.curDate = today;
			this.markDays.push(today);
		},
		onShow() {

		},
		onReachBottom() {
			this.page++;
			this.getLotteryRecord('bottom');
		},
		onPullDownRefresh() {
			this.getLotteryRecord()
			uni.stopPullDownRefresh();
		},
		onPageScroll: function onPageScroll(e) {
			if (e.scrollTop > 750) {
				this.showTag = true
			} else {
				this.showTag = false
			}
		},

		methods: {
			// 开奖记录
			getLotteryRecord(item) {
				let lotteryTypeId = ''
				if (uni.getStorageSync('lotteryTypeId')) {
					lotteryTypeId = uni.getStorageSync('lotteryTypeId')
				}
				this.$H.get('home/lotteryRecord/history', {
						lotteryTypeId,
						page: this.page,
						size: 10,
						year: this.year,
						numSort: this.numSort,
						timeSort: this.timeSort
					})
					.then(res => {
						if (res.code == "0") {
							if(item == "bottom") {
								this.lotteryData = this.lotteryData.concat(res.data);
							}else {
								this.lotteryData = res.data;
							}
						}
						console.log(res)
					});
			},
			sortChange(sort) {
				this.sortSwitch = !this.sortSwitch
				this.timeSort = sort
				this.getLotteryRecord()
			},
			fiveSwicthChange() {
				this.fiveSwicth = !this.fiveSwicth
			},
			switchChange(bool) {
				this.topSwitch = bool
			},
			numSortChange(query) {
				this.numSort = query
				this.getLotteryRecord()
			},
			yearPicker() {
				this.yearShow = true
			},
			yearChange(date) {
				this.year = date.year
				this.getLotteryRecord()
			},
			onDayClick(data) {
				this.curDate = data.date;
			},
			goBack() {
				uni.navigateBack({
					delta: 1
				});
			},
			getToday() {
				let date = new Date();
				let y = date.getFullYear();
				let m = date.getMonth();
				let d = date.getDate();
				let week = new Date().getDay();
				let weekText = ['日', '一', '二', '三', '四', '五', '六'];
				let formatWeek = '星期' + weekText[week];
				let today = {
					date: y + '-' + this.formatNum(m + 1) + '-' + this.formatNum(d),
					week: formatWeek
				};
				return today;
			},
			// 获取当前月份数据
			formatNum(num) {
				let res = Number(num);
				return res < 10 ? '0' + res : res;
			},
			goRecord(item) {
				uni.navigateTo({
					url: '/pages/lottery-history/lottery-record?item='+ encodeURIComponent(JSON.stringify({...item}))
				})
			}
		}
	};
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

	.top_switch {
		width: 100%;
		display: flex;
		height: 80rpx;
		font-size: 24rpx;

		view {
			width: 50%;
			line-height: 80rpx;
			text-align: center;
		}
	}

	.lottery {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.ottery_date {
		width: 95%;
		padding: 20rpx 0;

		.tips_box {
			background-color: #eeeeee;

			.tips {
				background-image: url('../../static/images/kuang_kuang.png');
				padding: 30rpx 20rpx;
				background-size: 100% 100%;
				text-align: center;

				.title {
					font-size: 28rpx;
					margin-bottom: 20rpx;
				}

				.text {
					font-size: 24rpx;
				}
			}

		}

		.date {
			margin-top: 24rpx;
			text-align: center;

			.check_date {
				font-size: 26rpx
			}
		}
	}

	.data_sort {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #eeeeee;
		padding: 36rpx 16rpx;
		margin-bottom: 36rpx;

		.title {
			font-size: 30rpx;
		}

		.sort_box {
			display: flex;
			justify-content: space-around;
			align-items: center;
			width: 60%;

			view {
				padding: 2rpx 18rpx;
				border-radius: 50rpx;
				background-color: white;
				font-size: 24rpx;
			}
		}
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

	::v-deep .uni-select {
		border: none;
		height: auto !important;
		padding-left: 0;
	}

	::v-deep .uni-select__input-box {
		height: auto !important;
	}

	::v-deep .uni-select__selector {
		width: 182rpx !important;
	}
</style>