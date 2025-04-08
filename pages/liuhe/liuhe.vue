<template>
	<view class="index-con" :style="{paddingTop:navbarHeight +'px'}">
		<view id="navbar" class="lf-nav" :style="{paddingTop:statusBarHeight +'px'}">
			<view class="lf-all">
				<view class="lf-all-nav" :style="{height: navigationBarHeight+'px'}">
					<u-icon name="arrow-left" size="28rpx" @click="goBack" />
					<text style="font-size: 28rpx;">六合图库</text>
					<view class="" style="width: 50rpx;">
					</view>
				</view>
				<view class="type-tab">
					<block v-for="(item,index) in typeList" :key="index">
						<view class="bbs-tab-box" :class="{'active': index == typeIndex}" @click="typeChange(index)">
							{{item.lotteryTypeName}}
						</view>
					</block>
				</view>
				<view class="search">
					<view class="search-left">
						<uni-data-select v-model="color" :clear="false" :localdata="colorOptions"
							@change="onChange"></uni-data-select>
					</view>
					<u-search placeholder="搜索" :show-action="true" shape="square" border-color="#575757" margin="0"
						search-icon="" v-model="keyword" :input-style="{paddingLeft: '65rpx'}" :borderColor="'white'"
						:shape="'round'" :bgColor="'white'" @custom="onChange" @search="onChange"
						:actionStyle="{color: '#07C160',fontSize: '36rpx'}"></u-search>
				</view>
			</view>
		</view>
		<view class="lf-top">
			<!-- tabs -->
			<u-index-list :scrollTop="scrollTop" :z-index="1" :sticky="false" :index-list="indexList">
				<view v-for="(item, index) in indexList" :key="index">
					<u-index-anchor :index="item" />
					<block v-for="itemChild in pictureList" :key="itemChild.id">
						<view class="index-box" @click="goDetail(itemChild)" v-if="item == itemChild.letter">
							<view class="index-box-text">
								{{itemChild.name}}
								<view class="index-box-number">
									{{itemChild.number}}
								</view>
							</view>
						</view>
					</block>
				</view>
			</u-index-list>
		</view>
	</view>
</template>

<script>
	import informationd from './data.js'
	export default {
		data() {
			return {
				typeList: [],
				typeIndex: 0,
				navbarHeight: 0,
				navigationBarHeight: 0,
				statusBarHeight: 0,
				keyword: '',
				color: 1,
				colorOptions: [{
						text: '彩色',
						value: 1,
					},
					{
						text: '黑白',
						value: 2,
					},
				],
				pictureList: [],
				scrollTop: 0,
				indexList: [],
				year: ''
			}
		},
		onReachBottom() {},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onLoad(option) {
			if (option.item) {
				const item = JSON.parse(decodeURIComponent(option.item));
				this.color = item.color
				this.year = item.year
			}
			const typeList = uni.getStorageSync('typeList')
			if (typeList) {
				this.typeList = typeList
			}
			this.navigationBarHeight = getApp().globalData.navigationBarHeight;
			this.statusBarHeight = getApp().globalData.statusBarHeight;
			this.getPictureList()
		},
		methods: {
			typeChange(index) {
				this.typeIndex = index
				this.indexList = []
				this.getPictureList()
			},
			getPictureList() {
				this.$H.get('/home/picture/list', {
					color: this.color,
					name: this.keyword,
					year: this.year,
					lotteryTypeId: this.typeList[this.typeIndex].lotteryTypeId
				}).then(res => {
					console.log(res)
					if (res.code == 0) {
						this.pictureList = res.data;
						res.data.forEach(item => {
							if (!this.indexList.includes(item.letter)) {
								this.indexList.push(item.letter)
							}
						})
						this.indexList.sort()
					}
				});
			},
			//点击内容跳转搜索
			onChange() {
				this.indexList = []
				this.getPictureList()
			},
			goBack() {
				uni.navigateBack({
					delta: 1
				});
			},
			goDetail(item) {
				uni.navigateTo({
					url: `/pages/picture/picture?item=` + encodeURIComponent(JSON.stringify(item))
				})
			}
		}
	}
</script>
<style>
	page {
		background-color: #fff !important;
	}
</style>
<style lang="scss" scoped>
	.lf-nav {
		width: 100%;
		border: 1px solid #fcfcfc;
		background-color: #ffffff;
		position: fixed;
		top: 0;
		z-index: 999;
	}

	.lf-all {
		display: flex;
		flex-direction: column;

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
	}

	.lf-all-nav {
		display: flex;
		justify-content: space-between;
		margin: 0 15rpx;
		align-items: center;
	}

	.lf-top {
		/* #ifdef H5*/
		margin-top: 290rpx !important;
		/* #endif */
		/* #ifdef MP */
		margin-top: 292rpx;
		/* #endif */
		/* #ifdef APP-PLUS */
		margin-top: 292rpx;
		/* #endif */

	}

	.search {
		display: flex;
		align-items: center;
		padding: 18rpx 24rpx;
		background-color: #f5f5f5;
		position: relative;

		.search-left {
			position: absolute;
			left: 46rpx;
		}
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

	.index-box {
		width: 100%;
		padding-left: 24rpx;
		padding-right: 46rpx;
		font-size: 26rpx;
		border-bottom: 1px solid #f5f5f5;

		.index-box-text {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 70rpx;

			.index-box-number {
				width: 80rpx;
				// padding: 4rpx 38rpx;
				height: 40rpx;
				line-height: 40rpx;
				text-align: center;
				background-color: #eeeeee;
				color: #07C160;
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

	::v-deep .uni-select__input-text {
		color: #07C160;
	}

	::v-deep .uni-select__selector {
		width: 182rpx !important;
	}
</style>