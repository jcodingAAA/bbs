<template>
	<view class="index-con" :style="{paddingTop:navbarHeight +'px'}">
		<view class="">
			<view class="search">
				<u-search placeholder="请输入您想要搜索的内容" :show-action="true" shape="square" border-color="#575757"
					margin="0" search-icon="/static/images/more-search.png" v-model="keyword"
					:borderColor="'white'" :shape="'round'" :bgColor="'white'" @custom="onChange" @search="onChange" :actionStyle="{color: '#07C160',fontSize: '28rpx'}"></u-search>
			</view>
			<!-- tabs -->
			<block>
				<!-- 最新 -->
				<view>
					<!-- <post-list v-if="indexStyle1=='0'" :list="lastPost" :loadStatus="loadStatus4" :showTag="true"
						:open="adIsOpen" :openAd="true" :wxAdpid="wxAdpid" :h5Adpid="h5Adpid"></post-list>
					<post-list-twice v-if="indexStyle1=='1'" :dataList="lastPost" :loadStatus="loadStatus4"></post-list-twice> -->
					<post-list-common :list="lastPost" :loadStatus="loadStatus4" :showTag="true"
						:open="adIsOpen" :openAd="true" :wxAdpid="wxAdpid" :h5Adpid="h5Adpid"></post-list-common>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	import postList from '@/components/post-list/post-list.vue';
	import postListTwice from '@/components/post-list-twice/post-list-twice.vue';
	import postListCommon from '@/components/post-list-common/post-list-common.vue'
	export default {
		data() {
			return {
				navbarHeight: 0,
				keyword: '',
				current: 0,
				page4: 1,
				lastPost: [],
				indexStyle1: '0',
				indexStyle2: '0',
				indexStyle3: '0',
				adIsOpen: '0',
				h5Adpid: '',
				wxAdpid: '',
			}
		},
		onReachBottom() {},
		onLoad() {
			this.getLastPost();
			this.getAdConfig()
		},
		onReachBottom() {
			this.page4++;
			this.getLastPost();
		},
		onPullDownRefresh() {
			this.page4 = 1;
			this.lastPost = [];
			this.getLastPost();
			uni.stopPullDownRefresh();
		},
		methods: {
			//获取最新帖子
			getLastPost(query) {
				this.loadStatus4 = 'loading';
				this.$H
					.get('post/search', {
						page: this.page4,
						relateType: 2,
						lotteryTypeId: this.lotteryTypeId,
						isRecommend: this.isRecommend,
						keyword: this.keyword
					})
					.then(res => {
						if (query == 'switch') {
							this.lastPost = res.result.data
						} else {
							this.lastPost = this.lastPost.concat(res.result.data);
						}
						if (res.result.current_page >= res.result.total || res.result.last_page === 0) {
							this.loadStatus4 = 'nomore';
						} else {
							this.loadStatus4 = 'loadmore';
						}
					});
			},
			goBack() {
				uni.navigateBack({
					delta: 1
				});
			},
			onChange(text) {
				console.log(text)
				this.keyword = text
				this.page4 = 1;
				this.lastPost = [];
				this.getLastPost();
			},
			//获取广告配置
			getAdConfig() {
				this.$H.get('system/getAd').then(res => {
					if (res.code == 0) {
						this.adIsOpen = res.adIsOpen;
						this.h5Adpid = res.h5Adpid;
						this.wxAdpid = res.wxAdpid;
					}
					this.$loading(false);
				});
			},
		}
	}
</script>
<style>
	page {
		background-color: #eee !important;
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