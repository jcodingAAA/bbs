<template>
	<view class="index-con" :style="{paddingTop:navbarHeight +'px'}">
		<view id="navbar" class="lf-nav" :style="{paddingTop:statusBarHeight +'px'}">
			<view class="lf-all">
				<view class="lf-all-nav" :style="{height: navigationBarHeight+'px'}">
					<u-icon name="arrow-left" size="28rpx" @click="goBack" />
					<text style="font-size: 28rpx;">资料大全</text>
					<view class="" style="width: 50rpx;">
						<u-icon name="calendar" size="28rpx" color="#07C160" @click="yearPicker" />
					</view>
				</view>
			</view>
		</view>
		<view class="lf-top">
			<view class="search">
				<u-search placeholder="搜索相关标题文章" :show-action="true" shape="square" border-color="#575757"
					margin="0" search-icon="/static/images/more-search.png" v-model="keyword"
					:borderColor="'white'" :shape="'round'" :bgColor="'white'" @custom="onChange" @search="onChange" :actionStyle="{color: '#07C160',fontSize: '36rpx'}"></u-search>
			</view>
			<!-- tabs -->
			<block>
				<view class="informationd_body">
					<view class="informationd_box" v-for="(item, index) in informationdList" :key="index">
						<view @click="historyKeyword(item)">{{ item.articleTypeName }}</view>
					</view>
				</view>
			</block>
		</view>
		<!-- 年份选择 -->
		<u-picker v-model="yearShow" mode="time" :params="{year:true}" :end-year="nowYear" @confirm="yearChange"
			title="年份选择" :default-time="`${year}-01-01`"></u-picker>
	</view>
</template>

<script>
	import informationd from './data.js'
	export default {
		data() {
			return {
				navbarHeight: 0,
				navigationBarHeight: 0,
				statusBarHeight: 0,
				keyword: '',
				current: 0,
				informationdList: informationd.data,
				yearShow: false,
				nowYear: null,
				year: null,
			}
		},
		onReachBottom() {},
		onLoad() {
			this.navigationBarHeight = getApp().globalData.navigationBarHeight;
			this.statusBarHeight = getApp().globalData.statusBarHeight;
			this.year = new Date().getFullYear()
			this.nowYear = new Date().getFullYear()
			this.getHotPost()
		},
		methods: {
			getHotPost() {
				this.$H.get('post/hotPost').then(res => {
					if (res.code == 0) {
						this.hotPost = res.hotPost;
						this.hotList = res.hotList;
					}
				});
			},
			//点击内容跳转搜索
			historyKeyword(keyWord) {
				this.keyword = keyWord
				this.onChange()
			},
			yearPicker() {
				this.yearShow = true
			},
			goBack() {
				uni.navigateBack({
					delta: 1
				});
			},
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
		background-color: #f5f5f5;
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
</style>