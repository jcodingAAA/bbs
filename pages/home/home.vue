<template>
	<view class="index-con" :style="{paddingTop:navbarHeight +'px'}">
		<!-- 头部信息 -->
		<view id="navbar" class="lf-nav" :style="{paddingTop:statusBarHeight +'px'}">
			<view class="lf-all">
				<view class="lf-all-nav" :style="{height: navigationBarHeight+'px'}">
					<!-- <u-icon name="search" :size="40" class="search-wrap" @click="toSearch"></u-icon> -->
					<text style="font-size: 28rpx;">88开奖网</text>
					<!-- 			<view class="">
						<image src="../../static/icon/icon_fx.png" mode="widthFix" style="width: 30rpx;"></image>
					</view> -->
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
		<!-- 公告 -->
		<view class="notice" @click="goMessage">
			<u-notice-bar mode="horizontal" type="none" :list="noticeList" font-size="30" volume-size="24"
				speed="160"></u-notice-bar>
		</view>
		<!-- 平台类型及信息 -->
		<view class="box" style="background-color: #f5f5f5;padding-bottom: 0;">
			<view class="platform">
				<!-- 头部 -->
				<view class="platform_top">
					<view class="platform_top_box" v-for="(item,index) in lotteryTime.list" :key="index"
						:class="platformIndex == index ? 'active' : ''"
						:style="{ width: lotteryTime.list.length === 3 ? '33%' : '24.5%' }">
						<text class="platform_top_box_title"
							@click="platformSwitch(item.lotteryType,index)">{{item.lotteryName}}</text>
						<text
							class="platform_top_box_text">{{item.nextLotteryTime.split(' ')[0].split('-')[1]}}月{{item.nextLotteryTime.split(' ')[0].split('-')[2]}}日开奖</text>
					</view>
				</view>
			</view>
		</view>
		<view class="box" style="padding-top: 0;">
			<!-- 内容 -->
			<view class="platform_content">
				<view class="platform_content_top">
					<view class="platform_content_left">第<view style="color: #07C160;margin: 0 4rpx;">
							{{lastLotteryRecord.id}}
						</view>期 <view style="color: red;margin-left: 24rpx;" v-if="countdownText">
							直播倒计时:{{countdownText}}</view>
					</view>
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
						<view class="platform_data_ball" @click="()=>{
							if(index == lastLotteryRecord.numberList.length - 1){
								doScratch(item)
							}
						}">
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
		<!-- 工具栏 -->
		<view class="box box_margin" style="margin-bottom: 10rpx;">
			<view class="tool">
				<view class="tool_box" v-for="item in navContent" :key="item.id">
					<image style="width: 90rpx;height: 90rpx;" :src="item.img" @click="goToolPage(item)">
					</image>
					<view class="text">
						{{item.title}}
					</view>
				</view>
			</view>
		</view>
		<!-- 推荐栏 -->
		<u-sticky style="z-index: 5">
			<view class="recommend">
				<scroll-view class="scroll-view_H" scroll-x="true" scroll-left="0">
					<view class="scroll-view-tab" v-for="(item,index) in listYear" :key="index">
						<view class="img_box">
							<view class="img"
								:style="item.color == '1' ? { background: '#20d497' } : { background: '#dddddd' }">
								<u-icon name="photo" size="36" color="#ffffff" @click="recommendSwitch(item)"></u-icon>
							</view>
						</view>
						<view class="text">
							{{item.name}}
						</view>
					</view>
				</scroll-view>
			</view>
		</u-sticky>
		<view class="box box_margin">
			<view class="gallery" v-if="galleryShow">
				<u-waterfall v-model="listPicture" ref="uWaterfall">
					<template v-slot:left="{leftList}">
						<view class="picture" v-for="(item, index) in leftList" :key="index" @click="goDetail(item)">
							<!-- 根据设备类型决定是否使用懒加载 -->
							<u-lazy-load v-if="isMobile" threshold="-450" border-radius="10" :image="item.media[0]" :index="index" v-else :src="item.media[0]"></u-lazy-load>
							<image v-if="!isMobile" :src="item.media[0]" style="border-radius: 10px;" />
							{{item.title}}
						</view>
					</template>
					<template v-slot:right="{rightList}">
						<view class="picture" v-for="(item, index) in rightList" :key="index" @click="goDetail(item)">
							<u-lazy-load v-if="isMobile" threshold="-450" border-radius="10" :image="item.media[0]" :index="index" v-else :src="item.media[0]"></u-lazy-load>
							<image v-if="!isMobile" :src="item.media[0]" style="border-radius: 10px;" />
							{{item.title}}
						</view>
					</template>
				</u-waterfall>
				<u-loadmore bg-color="rgb(240, 240, 240)" :status="loadStatus" @loadmore="addRandomData"></u-loadmore>
				<!-- 	<view class="picture" v-for="(item) in listPicture" :key="item.id" @click="goDetail(item)">
					<image :src="item.media[0]" mode="widthFix"></image>
					{{item.title}}
				</view> -->
			</view>
		</view>
		<!--底部选项栏 -->
		<view class="bottom">
			<view class="bottom_box" v-for="(item,index) in lotteryTime.list" :key="index"
				@click="platformSwitch(item.lotteryType,index)"
				:class="[platformIndex == index ? `active${index}` : '',`defalut${index}`]">
				<image :src="item.icon" mode="widthFix" style="width:40rpx" v-if="platformIndex !== index"></image>
				<image :src="item.clickIcon" mode="widthFix" style="width:40rpx" v-else></image>
				<text class="bottom_title">{{item.lotteryName}}</text>
			</view>
		</view>
		<popup v-if="showNotice" :title="'公告'" :content="bulletin" @closePop="closePop"></popup>
		<!-- 刮刮卡弹窗 -->
		<view class="scratch-popup" v-if="showScratchPopup">
			<view class="scratch-popup-content">
				<view style="width: 100%;height: 20vh;background-image: url('/static/menu_dialog_gua_bg.png');background-size: cover;"></view>
				<view class="scratch-popup-body">
					<dengbo-lotteryScratch 
						ref="scratchCard" 
						backendColor="#94e7b7"
						watermarkTxt="六合至尊"
						:lightImgs="scratchLightImages">
						<!-- 刮刮卡内容 -->
						<template v-slot:scratch-value>
							<view style="width: 200px; height: 200px; display: flex; align-items: center; justify-content: center;">
								<view class="scratch-item">
									<view class="platform_data_ball" >
									<view class="number"
									:class="targetItem.color == '1' ? 'ball_red' : targetItem.color == '2' ? 'ball_blue' : 'ball_green'">
									<view class="ball_big">
										{{targetItem.number}}
									</view>
									<view class="ball_small">

									</view>
								</view>
							</view>
							<view class="text">
								{{targetItem.wuXing}}/{{targetItem.shengXiao}}
							</view>
								</view>
							</view>
						</template>
					</dengbo-lotteryScratch>
					
				</view>
				<view style="width: 100; padding-top: 2vh;display: flex; justify-content: center;">
				<view style="background-color: white;border-radius: 100%;width: 50rpx;height: 50rpx; display: flex; align-items: center; justify-content: center;" @click="closeScratchPopup">
					<view>×</view>
				</view>
				</view>
			</view>
		</view>
		<!-- tabbar -->
		<lf-tabbar :active="0" :count="messegeNum"></lf-tabbar>
		<!-- 返回顶部 -->
		<lf-back-top :show-tag="showTag"></lf-back-top>
		<!-- 自定义加载 -->
		<toast color="#fff" type="rotate3"></toast>
	</view>

</template>
<script>
	import {
		mapGetters
	} from 'vuex';
	import popup from "@/components/popup/popup.vue";
	import moment from "dayjs";
	export default {
		components: {
			popup
		},
		data() {
			return {
				targetItem:{},
				galleryShow:false,
				navbarHeight: 0,
				navigationBarHeight: 0,
				statusBarHeight: 0,
				platformIndex: 0,
				showTag: false,
				showNotice: false,
				lotteryTypeId: '',
				lotteryTime: {
					list: [],
				},
				lastLotteryRecord: {},
				lotteryData: [],
				getGalleryInfo: {
					page: 1,
					size: 10
				},
				listPicture: [],
				listWheelAdvert: [],
				noticeList: [],
				bulletin: [],
				listYear: [],
				navContent: [],
				countdownText: "",
				timer: null,
				loadStatus: 'loadmore',
				flowList: [],
				isMobile: false, // 用于判断是否为移动设备
				showScratchPopup: false,  // 控制刮刮卡是否可刮
				scratchLightImages: ['/static/gpoint1.png', '/static/gpoint2.png'], // 闪光灯图片
			};
		},
		computed: {
			...mapGetters(['messegeNum'])
		},
		onLoad() {
			this.navigationBarHeight = getApp().globalData.navigationBarHeight;
			this.statusBarHeight = getApp().globalData.statusBarHeight;
			// 开奖记录
			if (uni.getStorageSync('lotteryTypeId')) {
				this.lotteryTypeId = uni.getStorageSync('lotteryTypeId')
			}
			this.getLotteryRecord()
			this.getBanner()
			this.getNotice()
			this.getNoticeList()
			this.getYearList()
			this.getNavList()
			this.checkDeviceType();
			//公告筛选
			// this.bulletin = [...list]

		},
		onShow() {

		},
		destroyed() {
			if (this.timer) {
				clearInterval(this.timer)
				this.timer = null;
			}
		},
		onReachBottom() {
			this.loadStatus = 'loading';
			// 模拟数据加载
			setTimeout(() => {
				this.getGalleryInfo.page++;
				this.getGallery('bottom')
				this.loadStatus = 'loadmore';
			}, 1000)

		},
		onPullDownRefresh() {
			this.getGalleryInfo = {
				page: 1,
				size: 10
			}
			this.getLotteryRecord()
			this.getBanner()
			this.getNotice()
			this.getNoticeList()
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
			doScratch(item) {
				this.targetItem = item;
				this.showScratchPopup = true;
			},
			closeScratchPopup() {
				this.showScratchPopup = false;
			},
			startScratch() {
				console.log('刮刮卡开始');
				if (this.$refs.scratchCard) {
					this.$refs.scratchCard.init(); 
				}
			},
			checkDeviceType() {
				// 使用用户代理字符串判断是否为移动设备
				const userAgent = navigator.userAgent || navigator.vendor || window.opera;
				this.isMobile = /android|iPad|iPhone|iPod/.test(userAgent) && !window.MSStream; // 判断是否为移动设备
			},
			// 开奖记录
			getLotteryRecord() {
				this.lotteryTime.list = []
				this.$H.post('home/lotteryRecord/last', {})
					.then(res => {
						if (res.code == "0") {
							const data = res.data
							let typeList = []
							data.forEach(item => {
								typeList.push({
									lotteryTypeId: item.lotteryVO.lotteryTypeId,
									lotteryTypeName: item.name
								})
								this.lotteryTime.list.push({
									lotteryName: item.name,
									lotteryTime: item.lotteryVO.lotteryTime.split(' ')[0],
									nextLotteryTime: item.lotteryVO.nextLotteryTime.split(' ')[0],
									icon: item.icon,
									clickIcon: item.clickIcon,
								})
							})
							uni.setStorageSync('typeList', typeList)
							this.lotteryData = data
							this.lotteryTypeId = data[0].lotteryVO.lotteryTypeId
							this.platformSwitch()
						}
					});
			},
			getGallery(item) {
				this.$H.get('/home/lottery/post', {
						...this.getGalleryInfo,
						lotteryTypeId: this.lotteryTypeId,
						type: 2
					})
					.then(res => {
						this.galleryShow = true
						if (res.code == "0") {
							if (item && item == 'bottom') {
								this.listPicture = this.listPicture.concat(res.data.data);
							} else {
								this.listPicture = res.data.data
							}
						}
					});
			},
			getBanner() {
				this.$H.post('link/list', {
						cateId: 3,
						page: 1,
					})
					.then(res => {
						if (res.code == "0") {
							this.listWheelAdvert = res.result
						}
					});
			},
			getNotice() {
				this.$H.get('home/notice/page', {
						type: 1,
						page: 1
					})
					.then(res => {
						if (res.code == "0") {
							const noticeList = []
							res.data.data.forEach((item, index) => {
								let title = ""
								if (index > 0) {
									title = "        " + item.title
								} else {
									title = item.title
								}
								noticeList.push(title)
							})
							this.noticeList = noticeList
						}
					});
			},
			getYearList() {
				this.$H.get('home/year/list')
					.then(res => {
						if (res.code == "0") {
							this.listYear = res.data
						}
					});
			},
			getNoticeList() {
				this.$H.get('home/notice/page', {
						type: 2,
						page: 1
					})
					.then(res => {
						if (res.code == "0") {
							// let bulletinStatus = getApp().globalData.bulletinStatus
							const bulletinStatus = uni.getStorageSync('bulletin')
							console.log(bulletinStatus )
							console.log(parseInt(bulletinStatus) === 0)
							const bulletin = []
							res.data.data.forEach(item => {
								bulletin.push({
									content: item.content,
									picUrl: item.picUrl
								})
							})
							this.bulletin = bulletin
							if (parseInt(bulletinStatus) === 0 && bulletin.length > 0) {
								this.showNotice = false
							}else {
								this.showNotice = true;  
							}
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
				this.lotteryTypeId = this.lotteryData[this.platformIndex].lotteryVO.lotteryTypeId
				this.getGalleryInfo = {
					page: 1,
					size: 10
				}
				this.galleryShow = false
				this.countdownText = ""
				this.getGallery()
				this.countdown()
				uni.setStorageSync('lotteryTypeId', this.lotteryData[this.platformIndex].lotteryVO.lotteryTypeId)
			},
			countdown() {
				let nextDate = this.lotteryData[this.platformIndex].lotteryVO.nextLotteryTime
				let str = ''
				if (this.timer) {
					clearInterval(this.timer)
					this.timer = null;
				}
				if (!this.timer) {
					this.timer = setInterval(() => {
						let day = moment(nextDate).diff(moment(), 'days');
						let hour = moment(nextDate).diff(moment(), 'hours') % 24;
						let minute = moment(nextDate).diff(moment(), 'minutes') % 60;
						let second = moment(nextDate).diff(moment(), 'seconds') % 60;
						day = day < 10 ? `0${day}` : day;
						hour = hour < 10 ? `0${hour}` : hour;
						minute = minute < 10 ? `0${minute}` : minute;
						second = second < 10 ? `0${second}` : second;
						if (day > 0) {
							str = `${day}天${hour}:${minute}:${second}`;
						} else if (hour > 0) {
							str = `${hour}:${minute}:${second}`;
						} else if (minute > 0) {
							str = `${minute}分${second}`;
						} else if (second > 0) {
							str = `${second}`;
						} else {
							str = ''
						}
						this.countdownText = str;
					}, 1000)
				}
			},
			goHistory() {
				uni.navigateTo({
					url: '/pages/lottery-history/lottery-history'
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
				getApp().globalData.bulletinStatus = 0
			},
			recommendSwitch(item) {
				uni.navigateTo({
					url: '/pages/liuhe/liuhe?item=' + encodeURIComponent(JSON.stringify(item))
				})
			},
			goToolPage(item) {
				if (item.type == 0) {
					uni.navigateTo({
						url: item.url
					})
				} else {
					uni.navigateTo({
						url: '/pages/webview/webview?src=' + item.url
					});
				}
			},
			goDetail(item) {
				uni.navigateTo({
					url: `/pages/picture/picture?item=` + encodeURIComponent(JSON.stringify(item))
				})
			},
			goMessage() {
				// uni.navigateTo({
				// 	url: '/pages/message/message'
				// })
				this.$f.jump('/pages/message/message?index=0')
			},
			// 获取导航区
			getNavList() {
				this.$H
					.post('navigation/getNav', {
						relateType: 0
					})
					.then(res => {
						if (res.code == 0) {
							this.navContent = res.result
						}
					});
			},
			goUrl(item) {
				if (item.linkUrl) {
					uni.navigateTo({
						url: '/pages/webview/webview?url=' + encodeURIComponent(item.linkUrl)
					})
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	page {
		overflow-x: unset;
	}

	.index-con {
		background-color: #f5f5f5;
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
		justify-content: center;
		margin: 0 15rpx;
		align-items: center;
	}

	.lf-tab {
		display: flex;
		margin-top: 15rpx;
		padding-right: 40rpx;
		justify-content: space-between;
		width: 750rpx;
	}

	.search-wrap {}


	.tab-box {
		width: 80%;
	}

	.banner {
		margin-top: 105rpx;
	}

	.scratch-item{
		.platform_data_ball {
					.number {
						width: 176rpx;
						height: 176rpx;
						border-radius: 100rpx;
						position: relative;

						.ball_big {
							width: 144rpx;
							height: 144rpx;
							border-radius: 100rpx;
							background-color: white;
							position: absolute;
							top: 8rpx;
							left: 8rpx;
							text-align: center;
							line-height: 144rpx;
							color: #666;
							font-weight: bold;
							font-size: 76rpx;
						}

						.ball_small {
							width: 40rpx;
							height: 40rpx;
							background-color: white;
							position: absolute;
							bottom: 16rpx;
							right: 20rpx;
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
					font-size: 52rpx;
					color: #666;
					margin-top: 12rpx;
				}
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

			.platform_top {
				display: flex;
				justify-content: space-between;

				.platform_top_box {
					width: 24.5%;
					display: flex;
					flex-direction: column;
					align-items: center;
					background-color: white;
					border-radius: 15rpx 15rpx 0 0;

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
			background-color: white;
			border: 1px solid #07C160;
			padding-bottom: 16rpx;
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

	.tool {
		width: 100%;
		display: flex;
		flex-flow: wrap;
		padding: 16rpx 0rpx;

		.tool_box {
			width: 25%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 8rpx 0;

			.text {
				margin-top: 16rpx;
				font-size: 26rpx;
			}
		}
	}

	.box_margin {
		margin-top: 10rpx;
	}

	.recommend {
		width: 750rpx;
		padding: 16rpx 0;
		background-color: white;

		.scroll-view_H {
			white-space: nowrap;
			width: 100%;
		}

		.scroll-view-tab {
			display: inline-block;
			width: 25%;
			font-size: 36rpx;

			.img_box {
				display: flex;
				justify-content: center;

				.img {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50rpx;
					text-align: center;
					line-height: 80rpx;
				}
			}

			.text {
				text-align: center;
				font-size: 28rpx;
			}
		}
	}

	.boxStyle {
		position: fixed;
		top: 80rpx;
		left: 0;
		background-color: white;
	}

	.gallery {
		width: 100%; // 默认宽度
		margin: 20rpx auto; // 剧中
		// columns: 2; // 默认列数
		// column-gap: 10rpx; // 列间距
		background: #f5f5f5;

		.picture {
			width: 100%;
			// break-inside: avoid;
			float: left;
			margin-bottom: 16rpx;
			padding: 16rpx 14rpx;
			background-color: white;
			box-shadow: 0px 5rpx 5rpx #f5f5f5;
			text-align: center;
			font-size: 26rpx;

			image {
				width: 100%;
			}
		}
	}

	.bottom {
		width: 100%;
		display: flex;
		justify-content: space-around;
		position: fixed;
		bottom: 150rpx;

		.bottom_box {
			width: 20%;
			display: flex;
			height: 60rpx;
			justify-content: center;
			align-items: center;

			.bottom_title {
				font-size: 26rpx;
				margin-left: 15rpx;
			}
		}

		.defalut0 {
			background-color: white;
			border: 1px solid #07C160;
			color: #07C160;
		}

		.active0 {
			background-color: #07C160;
			color: white;
			font-weight: bold;
		}

		.defalut1 {
			background-color: white;
			border: 1px solid #c10707;
			color: #c10707;
		}

		.active1 {
			background-color: #c10707;
			color: white;
			font-weight: bold;
		}

		.defalut2 {
			background-color: white;
			border: 1px solid #0755c1;
			color: #0755c1;
		}

		.active2 {
			background-color: #0755c1;
			color: white;
			font-weight: bold;
		}

		.defalut3 {
			background-color: white;
			border: 1px solid #b907c1;
			color: #b907c1;
		}

		.active3 {
			background-color: #b907c1;
			color: white;
			font-weight: bold;
		}

		.defalut4 {
			background-color: white;
			border: 1px solid #f52c3e;
			color: #f52c3e;
		}

		.active4 {
			background-color: #f52c3e;
			color: white;
			font-weight: bold;
		}
	}

	.notice {
		width: 100%;
		background-color: white;
	}

	.notice-box {
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	::v-deep .u-sticky {
		z-index: 5 !important;
	}
	
	/* 刮刮卡弹窗样式 */
	.scratch-popup {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 999;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.scratch-popup-content {
		width: 45%;
		background-color: transparent;
		border-radius: 20rpx;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
	
	.scratch-popup-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 30rpx;
		border-bottom: 1px solid #eee;
	}
	
	.scratch-popup-title {
		font-size: 32rpx;
		font-weight: bold;
	}
	
	.scratch-popup-close {
		font-size: 40rpx;
		color: #999;
		padding: 0 10rpx;
	}
	
	.scratch-popup-body {
		height: 30vh;
		padding: 30rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
	}
</style>