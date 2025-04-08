<template>
	<view class="index-con" :style="{paddingTop:navbarHeight +'px'}">
		<view class="bbs-tab">
			<view class="bbs-tab-box" :class="{'active': relateType == 1}" @click="tagChange(1)">
				网址大全
			</view>
			<view class="bbs-tab-box" :class="{'active': relateType == 2}" @click="tagChange(2)">
				担保平台
			</view>
		</view>
		<view class="">
			<view class="search">
				<u-search placeholder="请输入您想要搜索的内容" :show-action="true" shape="square" border-color="#575757" margin="0"
					search-icon="/static/images/more-search.png" v-model="keyword" :borderColor="'white'"
					:shape="'round'" :bgColor="'white'" @custom="onChange" @search="onChange"
					:actionStyle="{color: '#ffffff',fontSize: '28rpx'}"></u-search>
			</view>
			<view class="type-tab" v-if="relateType == 1">
				<block v-for="(item,index) in typeList" :key="index">
					<view class="bbs-tab-box" :class="{'active': index == typeIndex}" @click="typeChange(index)">
						{{item.lotteryTypeName}}
					</view>
				</block>
			</view>
			<!-- tabs -->
			<!-- 最新 -->
		</view>
		<view class="website-body" v-if="relateType == 1">
			<block v-for="(item,index) in navContent" :key="index">
				<view class="website-item" @click="jump(item)">
					<view>
						<image :src="item.img"></image>
						<p>{{item.title}}</p>
					</view>
				</view>
			</block>
			<block v-if="navContent.length === 0">
				<u-empty margin-top="0" text="暂无数据" mode="favor"></u-empty>
			</block>
		</view>
		<view class="website-body" v-if="relateType == 1">
			<block v-for="(item,index) in navContent" :key="index">
				<view class="website-item" @click="jump(item)" v-if="item.img">
					<view>
						<image :src="item.img"></image>
						<p>{{item.title}}</p>
					</view>
				</view>
			</block>
			<block v-if="navContent.length === 0">
				<u-empty margin-top="0" text="暂无数据" mode="favor"></u-empty>
			</block>
		</view>
		<view class="dbptdiv" v-if="relateType == 2">
			<block v-for="(item,index) in navContent" :key="index">
				<view class="item"  v-if="item.img">
					<image :src="item.img"></image>
					<view class="descs">
						<span class="descs1">{{item.title}}</span>
						<span class="jumpurl" @click="jump(item)">点击访问></span>
					</view>
				</view>
			</block>
			<block v-if="navContent.length === 0">
				<view style="width: 100%;display: flex;justify-content: center;background-color: white;">
					<u-empty margin-top="40" text="暂无数据" mode="favor"></u-empty>
				</view>
			</block>
		</view>
		<!-- tabbar -->
		<lf-tabbar :active="2" :count="messegeNum"></lf-tabbar>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
	export default {
		computed: {
			...mapGetters(['messegeNum'])
		},
		data() {
			return {
				navbarHeight: 0,
				keyword: '',
				current: 0,
				page4: 1,
				navContent: [],
				typeList: [],
				// indexStyle1: '0',
				// indexStyle2: '0',
				// indexStyle3: '0',
				// adIsOpen: '0',
				// h5Adpid: '',
				// wxAdpid: '',
				relateType: 1,
				typeIndex: 0
			}
		},
		onReachBottom() {},
		onLoad() {
			const typeList = uni.getStorageSync('typeList')
			if (typeList) {
				this.typeList = typeList
			}
			this.getNavList();
		},
		onReachBottom() {
			this.page4++;
			this.getNavList();
		},
		onPullDownRefresh() {
			this.page4 = 1;
			this.lastPost = [];
			this.getNavList();
			uni.stopPullDownRefresh();
		},
		onShow() {
			uni.$on('refresh', (data) => {
				if (data.refresh) {
					this.refresh()
					uni.$off('refresh')
				}
			})
			// this.checkCurrentPage();
		},
		onUnload() {
			uni.$off('refresh')
		},
		methods: {
			refresh() {
				this.page4 = 1;
				this.lastPost = [];
				this.getNavList();
			},
			//获取最新帖子
			getNavList(query) {
				this.$H
					.post('navigation/getNav', {
						relateType: this.relateType,
						relateId: this.relateType == 1 ? this.typeList[this.typeIndex].lotteryTypeId : '',
						keyword: this.keyword
					})
					.then(res => {
						if (res.code == 0) {
							if (query == 'switch') {
								this.navContent = res.result
							} else {
								this.navContent = this.navContent.concat(res.result);
							}
						}
					});
			},
			tagChange(query) {
				this.keyword = ""
				this.typeIndex = 0
				this.relateType = query
				this.page4 = 1;
				this.getNavList('switch')
			},
			goBack() {
				uni.navigateBack({
					delta: 1
				});
			},
			onChange(text) {
				this.keyword = text
				this.page4 = 1;
				this.lastPost = [];
				this.getNavList('switch');
			},
			typeChange(index) {
				this.keyword = ""
				this.typeIndex = index
				this.page4 = 1;
				this.getNavList('switch')
			},
			jump(item) {
				if (item.type === 0) {
					uni.navigateTo({
						url: item.url
					})
				} else {
					uni.navigateTo({
						url: '/pages/webview/webview?src=' + item.url
					});
				}
			}
			//获取广告配置
			// getAdConfig() {
			// 	this.$H.get('system/getAd').then(res => {
			// 		if (res.code == 0) {
			// 			this.adIsOpen = res.adIsOpen;
			// 			this.h5Adpid = res.h5Adpid;
			// 			this.wxAdpid = res.wxAdpid;
			// 		}
			// 		this.$loading(false);
			// 	});
			// },
		}
	}
</script>
<style>
	page {
		height: 100%;
		background-color: #eee !important;
	}
</style>
<style lang="scss" scoped>
	.index-con {
		height: 100%;
		position: relative;
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

	.search {
		display: flex;
		align-items: center;
		padding: 18rpx 24rpx;
		background-color: #07c160;
	}

	.informationd_body {
		width: 100%;
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
		margin-top: 42rpx;
		padding: 0 24rpx;

		.informationd_box {
			width: 28%;
			border: 1px solid #aaaaaa;
			text-align: center;
			margin-bottom: 32rpx;
			font-size: 28rpx;
			color: #bbbbbb;
		}
	}

	.bbs-tab {
		width: 100%;
		// display: flex;
		// background-color: white;
		// border-top: 1px solid #eee;
		// border-bottom: 1px solid #eee;
		// padding: 18rpx 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #07c160;
		font-family: PingFang SC;
		font-style: normal;
		font-weight: 400;
		font-size: 32rpx;
		line-height: 50rpx;
		color: #fff;
		padding-top: 52rpx;
		padding-bottom: 20rpx;
		// .bbs-tab-line {
		// 	width: 26%;
		// 	position: relative;
		// 	justify-content: center;
		// 	.bbs-tab-line {

		// 	}
		// }
		.bbs-tab-box {
			width: 26%;
			text-align: center;
			font-size: 32rpx;
			// font-weight: bold;
		}

		.active {
			position: relative;
			font-size: 40rpx;
			font-weight: 700;
			// color: #07c160;
		}

		.active::after {
			content: "";
			position: absolute;
			bottom: -16rpx;
			background-color: #fff;
			width: 40rpx;
			height: 8rpx;
			left: 0;
			border-radius: 8rpx;
			right: 0;
			margin: auto;
		}
	}

	.type-tab {
		width: 100%;
		display: flex;
		justify-content: space-around;
		background-color: white;
		padding-top: 12rpx;
		padding-bottom: 24rpx;

		.active {
			position: relative;
			font-size: 40rpx;
			font-weight: 700;
			// color: #07c160;
		}

		.bbs-tab-box {
			width: 26%;
			text-align: center;
			font-size: 32rpx;
			font-weight: bold;
		}

		.active::after {
			content: "";
			position: absolute;
			bottom: -16rpx;
			background-color: #07c160;
			width: 40rpx;
			height: 8rpx;
			left: 0;
			border-radius: 8rpx;
			right: 0;
			margin: auto;
		}
	}

	.gallery {
		width: 100%; // 默认宽度
		margin: 20rpx auto; // 剧中
		columns: 2; // 默认列数
		column-gap: 10rpx; // 列间距
		background: #f5f5f5;

		.picture {
			width: 100%;
			break-inside: avoid;
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

	.website-body {
		margin-top: 20rpx;
		height: 100%;
		background: #fff;
		padding: 0 12rpx;

		.website-item {
			float: left;
			width: 25%;
			text-align: center;
			padding: 20rpx 0 20rpx;

			view {
				padding: 0 10rpx;

				image {
					width: 90%;
					height: 80rpx;
					border-radius: 8rpx;
				}

				p {
					color: #444;
					font-size: 32rpx;
					line-height: 44rpx;
					margin-top: 8rpx;
				}
			}

		}
	}

	.dbptdiv {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		width: 690rpx;
		margin: 0 auto;

		.item {
			width: 100%;
			height: 252rpx;
			filter: drop-shadow(0 8rpx 8rpx rgba(0, 0, 0, .05));
			border-radius: 16rpx;
			margin: 30rpx 0;
			background-color: white;
			image {
				width: 100%;
				height: 164rpx;
			}

			.descs {
				display: flex;
				align-items: center;
				padding: 0 20rpx;
				position: static;
				width: 690rpx;
				height: 88rpx;
				background: #fff;
			}

			.descs1 {
				width: 458rpx;
				height: 44rpx;
				font-style: normal;
				font-weight: 700;
				font-size: 32rpx;
				line-height: 44rpx;
				color: #444;
				order: 0;
				flex-grow: 1;
			}

			.jumpurl {
				font-size: 28rpx;
				line-height: 32rpx;
				color: #07c160;
				width: 160rpx;
				height: 48rpx;
				background: #fff;
				border: 1rpx solid #07c160;
				box-sizing: border-box;
				border-radius: 100rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}
</style>