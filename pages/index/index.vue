<template>

	<view class="index-con" :style="{paddingTop:navbarHeight +'px'}">
		<!-- 头部信息 -->
		<view id="navbar" class="lf-nav" :style="{paddingTop:statusBarHeight +'px',zIndex: '999'}">
			<view class="lf-all">
				<view class="lf-all-nav" :style="{height: navigationBarHeight+'px'}">
					<u-icon name="arrow-left" size="28rpx" @click="goBack" />
					<text style="font-size: 28rpx;">高手论坛</text>
					<view class=""></view>
					<view class="right">
						<view class="right-box" @click="goSearch()">
							<image src="../../static/icon/icon_search_white.png" mode="widthFix" style="width: 35rpx;">
							</image>
						</view>
						<view class="right-box" @click="goAdd()">
							<image src="../../static/icon/icon_pencil_white.png" mode="widthFix" style="width: 35rpx;">
							</image>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="lf-top"></view>
		<view class="notice-top">
			<view class="title">
				公告
			</view>
			<view class="text">
				{{noticeList[0]}}
			</view>
		</view>
		<view class="platform">
			<!-- 头部 -->
			<view class="platform_top">
				<view class="platform_top_box" v-for="(item,index) in typeList" :key="index"
					:class="platformIndex == index ? 'active' : ''">
					<text class="platform_top_box_title"
						@click="platformSwitch(item.lotteryTypeId,index)">{{item.lotteryTypeName}}</text>
				</view>
			</view>
		</view>
		<view class="bbs-tab">
			<view class="bbs-tab-box" :class="{'active': isRecommend == 0}" @click="tagChange(0)">
				综合
			</view>
			<view class="bbs-tab-box" :class="{'active': isRecommend == 1}" @click="tagChange(1)">
				推荐
			</view>
		</view>
		<!-- 最新 -->
		<view>
			<!-- <post-list v-if="indexStyle1=='0'" :list="lastPost" :loadStatus="loadStatus4" :showTag="true"
				:open="adIsOpen" :openAd="true" :wxAdpid="wxAdpid" :h5Adpid="h5Adpid"></post-list>
			<post-list-twice v-if="indexStyle1=='1'" :dataList="lastPost" :loadStatus="loadStatus4"></post-list-twice> -->
			<post-list-common :list="lastPost" :loadStatus="loadStatus4" :showTag="true" :open="adIsOpen" :openAd="true"
				:wxAdpid="wxAdpid" :h5Adpid="h5Adpid"></post-list-common>
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
	import postList from '@/components/post-list/post-list.vue';
	import postListTwice from '@/components/post-list-twice/post-list-twice.vue';
	import postListCommon from '@/components/post-list-common/post-list-common.vue'
	import popup from "@/components/popup/popup.vue";
	import {
		mapGetters
	} from 'vuex';
	export default {
		components: {
			postList,
			postListTwice,
			postListCommon,
			popup,
		},
		data() {
			return {
				isRecommend: 0,
				lotteryTypeId: "",
				noticeList: [],
				typeList: [{
					lotteryTypeId: '',
					lotteryTypeName: '全部'
				}],
				platformIndex: 0,
				$IMG: this.$IMG,
				sessionUid: uni.getStorageSync('userInfo').uid,
				loadStatus1: 'loadmore',
				loadStatus2: 'loadmore',
				loadStatus3: 'loadmore',
				loadStatus4: 'loadmore',
				page: 1,
				page2: 1,
				page3: 1,
				page4: 1,
				shareCover: '',
				topDisList: [],
				swiperList: [],
				followUserPost: [],
				joinTopicPost: [],
				lastPost: [],
				tabList: [{
						name: '关注'
					},
					{
						name: '圈子'
					},
					{
						name: '最新'
					}
				],
				current: 2,
				joinTopicList: [],
				wxText: "点击添加到我的小程序",
				background: {
					backgroundImage: 'linear-gradient(45deg, rgb(210,227,235), rgb(173, 173, 220))'
				},
				h5Adpid: '1818425366',
				wxAdpid: '1872486102',
				adIsOpen: '0',
				navbarHeight: 0,
				navigationBarHeight: 0,
				statusBarHeight: 0,
				indexStyle1: '0',
				indexStyle2: '0',
				indexStyle3: '0',
				vipShow: '0',
				showTag: false,
				popTitle: "",
				popContent: "",
				showNotice: false,
				showVipIcon: true,
			};
		},
		computed: {
			...mapGetters(['messegeNum'])
		},
		onShareAppMessage(res) {
			return {
				title: this.$c.miniappName,
				path: '/pages/index/index',
				imageUrl: this.shareCover
			};
		},
		onLoad() {
			this.$loading(true);
			this.navigationBarHeight = getApp().globalData.navigationBarHeight;
			this.statusBarHeight = getApp().globalData.statusBarHeight;
			const typeList = uni.getStorageSync('typeList')
			if (typeList) {
				this.typeList = [...this.typeList, ...typeList]
			}
			this.getSysInfo();
			this.getNotice()
			this.getLastPost();
			this.getAdConfig();
			if (uni.getStorageSync('hasLogin')) {
				if (uni.getStorageSync('userInfo').vip == 1) {
					this.showVipIcon = false
				}
			}
		},
		onShow() {
			this.getMsgNum();
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
		onPageScroll: function onPageScroll(e) {
			if (e.scrollTop > 750) {
				this.showTag = true
			} else {
				this.showTag = false
			}
		},

		methods: {
			refresh() {
				this.page4 = 1;
				this.lastPost = [];
				this.getLastPost();
			},
			platformSwitch(type, index) {
				this.page4 = 1;
				this.platformIndex = index
				this.lotteryTypeId = type
				this.getLastPost('switch')
			},
			getType() {
				this.$H.get('home/lottery/type').then(res => {
					console.log(res)
				});
			},
			getMsgNum() {
				this.$H.post('message/num').then(res => {
					this.msgNum = res.result;
					let all = this.$store.state.totalUnread.message + this.$store.state.totalUnread.notice + res
						.result.allCount
					this.$store.state.messegeNum = [0, 0, 0, all, 0];
				});
			},
			checkCurrentPage() {
				if (this.current === 0) {
					this.page2 = 1;
					this.followUserPost = [];
					this.getFollowUserPost();
					this.getMsgNum();
				} else if (this.current === 1) {
					this.page3 = 1;
					this.joinTopicPost = [];
					this.getJoinTopicPost();
					this.getUserJoinTopic();
					this.getMsgNum();
				}
			},
			tabChange(index) {
				// console.log('index:',index)
				this.current = index;
				this.followUserPost = [];
				this.joinTopicList = [];
				this.lastPost = [];
				this.joinTopicPost = [];
				if (index === 1) {
					this.page3 = 1;
					this.getJoinTopicPost();
					this.getUserJoinTopic();
					this.getMsgNum();
				}
				if (index === 0) {
					this.page2 = 1;
					this.getFollowUserPost();
					this.getMsgNum();
				}
				if (index === 2) {
					this.page4 = 1;
					this.getLastPost();
				}
			},
			// 用户加入的圈子
			getUserJoinTopic() {
				this.loadStatus = 'loading';
				this.$H
					.post('topic/userJoinTopic', {
						classId: this.topicClassId
					})
					.then(res => {
						this.joinTopicList = res.result.data;
						uni.stopPullDownRefresh();
					});
			},
			jump(url) {
				uni.navigateTo({
					url: url
				})
			},
			getSysInfo() {
				this.$H.get('system/basic').then(res => {
					this.shareCover = res.logo;
					this.indexStyle1 = res.indexStyle1;
					this.indexStyle2 = res.indexStyle2;
					this.indexStyle3 = res.indexStyle3;
					this.vipShow = res.vipShow;
				});
			},

			// 获取加入的圈子动态
			getJoinTopicPost() {
				this.loadStatus3 = 'loading';
				this.$H
					.get('post/joinTopicPost', {
						page: this.page3
					})
					.then(res => {
						this.joinTopicPost = this.joinTopicPost.concat(res.result.data);
						if (res.result.current_page >= res.result.total || res.result.last_page === 0) {
							this.loadStatus3 = 'nomore';
						} else {
							this.loadStatus3 = 'loadmore';
						}
					});
			},
			// 获取关注用户帖子
			getFollowUserPost() {
				this.loadStatus1 = 'loading';
				this.$H
					.get('post/followUserPost', {
						page: this.page2
					})
					.then(res => {
						if (res.code == 0 && res.result) {
							this.followUserPost = this.followUserPost.concat(res.result.data);
							if (res.result.current_page >= res.result.total || res.result.last_page === 0) {
								this.loadStatus1 = 'nomore';
							} else {
								this.loadStatus1 = 'loadmore';
							}
						} else {
							this.loadStatus1 = 'nomore';
						}
					});
			},
			//获取最新帖子
			getLastPost(query) {
				this.loadStatus4 = 'loading';
				this.$H
					.get('post/search', {
						page: this.page4,
						relateType: 2,
						lotteryTypeId: this.lotteryTypeId,
						isRecommend: this.isRecommend
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
			toVipPage() {
				if (uni.getStorageSync('hasLogin')) {
					this.$f.jump('/pages/user/vip/vip')
				} else {
					this.$f.toast('请先登录哦')
				}
			},
			toSearch() {
				if (uni.getStorageSync('hasLogin')) {
					this.$f.jump('/pages/search/search')
				} else {
					this.$f.toast('请先登录哦')
				}
			},
			closePop() {
				this.showNotice = false
			},
			getNotice() {
				this.$H.get('home/notice/page', {
						type: 1,
						page: 1
					})
					.then(res => {
						if (res.code == "0") {
							const noticeList = []
							res.data.data.forEach(item => {
								noticeList.push(item.content)
							})
							this.noticeList = noticeList
						}
					});
			},
			tagChange(query) {
				this.isRecommend = query
				this.page4 = 1;
				this.getLastPost('switch')
			},
			goAdd() {
				const item = {
					title: '发布(论坛帖)',
					relateType: 2
				}
				uni.navigateTo({
					url: '/subpages/content/article/add?item=' + encodeURIComponent(JSON.stringify(item))
				})
			},
			goSearch() {
				uni.navigateTo({
					url: '/pages/index/search'
				})
			},
			goBack() {
				uni.navigateBack({
					delta: 1
				})
			}
		}
	};
</script>

<style lang="scss" scoped>
	.index-con {
		padding-bottom: 80rpx;
	}

	.lf-nav {
		width: 100%;
		background-color: #07c106;
		color: white;
		position: fixed;
		top: 0;
		z-index: 999;
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
		position: relative;

		.right {
			display: flex;
			position: absolute;
			right: 15rpx;

			.right-box {
				display: flex;
				flex-direction: column;
				align-items: center;
				color: #07c160;
				font-size: 24rpx;
			}

			:first-child {
				margin-right: 25rpx;
			}
		}
	}

	.lf-tab {
		display: flex;
		margin-top: 15rpx;
		padding-right: 40rpx;
		justify-content: space-between;
		width: 750rpx;
	}

	.lf-tab-con {
		width: 500rpx;
	}

	.notice-top {
		width: 100%;
		display: flex;
		padding: 10rpx 24rpx;

		.title {
			color: #07c160;
		}

		.text {
			margin-left: 24rpx;
		}
	}

	.lf-vip {
		padding-top: 5rpx;
		height: 40rpx;
	}

	.lf-vip-icon {
		width: 146rpx;
		height: 40rpx;
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

	.platform {
		background-color: white;
		padding: 24rpx 12rpx;
		width: 100%;
		display: flex;
		justify-content: center;

		.platform_top {
			display: flex;

			.platform_top_box {
				padding: 5rpx 24rpx;
				border: 1px solid #07c160;
				font-size: 28rpx;
				color: #07c160;
				border-left: 0;
			}

			.platform_top_box:first-child {
				border-left: 1px solid #07c160;
			}

			.active {
				background-color: #07c160;
				color: white;
			}
		}
	}

	.navbar-img {
		.n-img {
			width: 80rpx;
			height: 80rpx;
			margin: 0 20rpx 0 40rpx
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
			margin-left: 48rpx;
			font-size: 28rpx;
			font-weight: bold;
		}

		.active {
			color: #07c160;
		}
	}

	.search-wrap {
		/* #ifdef MP */
		width: 410rpx;
		/* #endif */
		/* #ifndef MP */
		width: 100%;
		/* #endif */

	}

	.swiper-body {
		height: calc(100vh - var(--status-bar-height) - 43px);
	}

	.body-scroll-view {
		width: 100%;
		height: 100%;
	}

	.tab-box {
		width: 80%;
	}

	.block-title {
		font-weight: bold;
		padding: 20rpx;
		color: #616161;
		display: flex;
		font-size: 28rpx;

		.right {
			margin-left: auto;
			color: #333;
			font-size: 20rpx;
			display: flex;
			align-items: center;
		}
	}

	// 顶部圈子
	.topic-wrap {
		padding: 0 20rpx;
		background-color: #fff;
		margin-bottom: 1rpx;
	}

	.grid-topic {
		position: relative;
		margin-bottom: 20rpx;

		.name {
			font-size: 20rpx;
			text-align: center;
		}

		.user {
			position: absolute;
			left: 0;
			top: 4rpx;
			font-size: 24rpx;
			display: block;
			background-color: #f18686;
			padding: 2rpx;
			border-radius: 0 0 10rpx 0;
			height: auto;
			color: white;
		}
	}
</style>