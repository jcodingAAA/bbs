<template>
	<view class="index-con" :style="{paddingTop:navbarHeight +'px'}">
		<view class="bbs-tab">
			<view class="bbs-tab-box" :class="{'active': isRecommend == 0}" @click="tagChange(0)">
				全部
			</view>
			<view class="bbs-tab-box" :class="{'active': isRecommend == 1}" @click="tagChange(1)">
				推荐
			</view>
		</view>
		<view class="">
			<view class="search">
				<u-search placeholder="请输入您想要搜索的内容" :show-action="true" shape="square" border-color="#575757" margin="0"
					search-icon="/static/images/more-search.png" v-model="keyword" :borderColor="'white'"
					:shape="'round'" :bgColor="'white'" @custom="onChange" @search="onChange"
					:actionStyle="{color: '#07C160',fontSize: '28rpx'}"></u-search>
			</view>
			<!-- tabs -->
			<block>
				<!-- 最新 -->
				<view>
					<view class="gallery">
						<view class="picture" v-for="(item) in lastPost" :key="item.id" @click="jump(item)">
							<view class="" v-if="item.media && item.media.length > 0">
								<image :src="item.media[0]" width="100%" height="400rpx"></image>
							</view>
							{{item.title}}
						</view>
					</view>
				</view>
			</block>
		</view>
		<view class="fabu" @click="goAdd()">
			<image src="/static/icon/icon_fabu.png" mode="widthFix"></image>
		</view>
		<!-- tabbar -->
		<lf-tabbar :active="1" :count="messegeNum"></lf-tabbar>
	</view>
</template>

<script>
	import postList from '@/components/post-list/post-list.vue';
	import postListTwice from '@/components/post-list-twice/post-list-twice.vue';
	import postListCommon from '@/components/post-list-common/post-list-common.vue'
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
				lastPost: [],
				indexStyle1: '0',
				indexStyle2: '0',
				indexStyle3: '0',
				adIsOpen: '0',
				h5Adpid: '',
				wxAdpid: '',
				isRecommend: 0
			}
		},
		onReachBottom() {},
		onLoad() {
			this.$loading(true);
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
				this.getLastPost();
			},
			//获取最新帖子
			getLastPost(query) {
				this.loadStatus4 = 'loading';
				this.$H
					.get('post/search', {
						page: this.page4,
						relateType: 0,
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
			tagChange(query) {
				this.isRecommend = query
				this.page4 = 1;
				this.getLastPost('switch')
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

			jump(e) {
				let url;

				// 图文
				if (e.type == 1 || e.type == 4) {
					if (e.cut == 0) {
						url = '/pages/post/detail?id=' + e.id;
					} else {
						this.$H.post('post/getVipPostInfo', {
							postId: e.id
						}).then(res => {
							if (res.result.isBuy) {
								url = '/pages/post/detail?id=' + e.id;
							} else {
								url = '/pages/post/confirm?id=' + e.id + '&type=' + e.type;
							}
							uni.navigateTo({
								url: url
							})
						});
					}

				}
				//长文
				if (e.type == 3) {
					url = '/pages/post/detail?id=' + e.id;
				}

				//视频
				if (e.type == 2) {
					// #ifdef APP-PLUS
					if (e.cut == 0) {
						url = '/pages/post/detail?id=' + e.id;
					} else {
						this.$H.post('post/getVipPostInfo', {
							postId: e.id
						}).then(res => {
							if (res.result.isBuy) {
								url = '/pages/post/detail?id=' + e.id;
							} else {
								url = '/pages/post/confirm?id=' + e.id + '&type=' + e.type;
							}
							uni.navigateTo({
								url: url
							})
						});

					}
					// #endif
					// #ifndef APP-PLUS
					if (e.cut == 0) {
						url = '/pages/post/video-detail?id=' + e.id;
					} else {
						this.$H.post('post/getVipPostInfo', {
							postId: e.id
						}).then(res => {
							if (res.result.isBuy) {
								url = '/pages/post/video-detail?id=' + e.id;
							} else {
								url = '/pages/post/confirm?id=' + e.id + '&type=' + e.type;
							}
							uni.navigateTo({
								url: url
							})
						});

					}
					// #endif

				}

				uni.navigateTo({
					url: url
				})
			},
			goAdd() {
				const item = {
					title: '发布(发现帖)',
					relateType: 0
				}
				uni.navigateTo({
					url: '/subpages/content/article/add?item=' + encodeURIComponent(JSON.stringify(item))
				})
			}
		}
	}
</script>
<style>
	page {
		background-color: #eee !important;
	}
</style>
<style lang="scss" scoped>
	.index-con {
		position: relative;

		.fabu {
			position: fixed;
			top: 50%;
			right: 0;

			image {
				width: 100rpx;
			}
		}
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

	.bbs-tab {
		width: 100%;
		display: flex;
		background-color: white;
		border-top: 1px solid #eee;
		border-bottom: 1px solid #eee;
		padding: 18rpx 0;

		.bbs-tab-box {
			width: 50%;
			text-align: center;
			font-size: 26rpx;
			font-weight: bold;
		}

		.active {
			color: #07c160;
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
</style>