<template>
	<view class="discuss-container">
		<view class="discussInfo">

			<view class="title">

				<view class="dis-title"># {{discussInfo.title}}</view>
				<view class="count">
					<text>{{discussInfo.postCount}} 篇内容</text>
					<text>{{discussInfo.readCount | numberFormat}} 次浏览</text>
				</view>
			</view>
			<view class="desc">
				<view class="discuss-desc">{{discussInfo.introduce}}</view>
			</view>
			<view class="user" @click="jumpUser(discussInfo.userInfo.uid)">
				<text class="tag">
					发起人
				</text>
				<view class="user-c">
					<text>{{discussInfo.userInfo.username}}</text>
				</view>
				<u-avatar size="40" class="avatar" :src="discussInfo.userInfo.avatar"></u-avatar>
			</view>
		</view>
		<view class="tabs-box">
			<view class="tab-left">
				<u-tabs :list="tabList" :is-scroll="false" :current="current" @change="tabsChange"></u-tabs>
			</view>
		</view>
		<view v-show="current == 0">
			<post-list :list="postList" :loadStatus="loadStatus"></post-list>
		</view>
		<view v-show="current == 1">
			<post-list :list="postList" :loadStatus="loadStatus"></post-list>
		</view>
		<!-- 返回顶部 -->
		<lf-back-top :show-tag="showTag"></lf-back-top>
		<!-- 发布按钮 -->
		<view @click="onTrigger" url="/pages/post/add" class="plus-box">
			<u-icon color="#fff" name="plus"></u-icon>
		</view>
	</view>
</template>

<script>
	import postList from '@/components/post-list/post-list.vue';
	export default {
		components: {
			postList
		},
		data() {
			return {
				disId: 0,
				loadStatus: "loading",
				postList: [],
				discussInfo: {
					userInfo: {}
				},
				page: 1,
				page2: 1,
				current: 0,
				tabList: [{
						name: '最新'
					},
					{
						name: '最热'
					}
				],
				showTag: false,
			};
		},
		onLoad(options) {
			this.disId = options.id;
			this.getDiscussInfo();
			this.getPostList();

			//#ifdef MP-WEIXIN
			wx.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline']
			})
			//#endif
		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: this.discussInfo.introduce,
				path: '/pages/discuss/detail?id=' + this.disId,
			}
		},
		onShareTimeline() {
			let imgURL = "";
			return {
				title: this.discussInfo.introduce,
				imageUrl: imgURL,
				query: 'id=' + this.disId
			}
		},
		onReachBottom() {
			if (this.current == 0) {
				this.page++;
			} else if (this.current == 1) {
				this.page2++;
			}
			this.getPostList();
		},
		onPageScroll: function onPageScroll(e) {
			if (e.scrollTop > 750) {
				this.showTag = true
			} else {
				this.showTag = false
			}
		},
		methods: {

			onTrigger() {
				if (uni.getStorageSync('hasLogin')) {
					this.$H.get('discuss/checkJoinTopic', {
						id: this.disId
					}).then(res => {
						if (res.code == 0) {
							uni.navigateTo({
								url: "/pages/post/add?topicId=" + this.discussInfo.topicId +
									"&discussId=" + this.discussInfo
									.id + "&type=1&disName=" + this.discussInfo.title
							})
						}
					})
				} else {
					this.$f.toast('请先登录哦')
				}

			},
			getDiscussInfo() {
				this.$H.get('discuss/detail', {
					id: this.disId
				}).then(res => {
					this.discussInfo = res.result;
				})
			},
			getPostList() {
				this.loadStatus = "loading";
				let sort = "last"
				let pages = this.page
				if (this.current == 1) {
					sort = "hot"
					pages = this.page2
				}
				this.$H.post('post/getPostListByDiscussId', {
					disId: this.disId,
					page: pages,
					sort: sort
				}).then(res => {
					this.postList = this.postList.concat(res.result.data);

					if (res.current_page === res.last_page || res.last_page === 0) {
						this.loadStatus = "nomore";
					} else {
						this.loadStatus = "loadmore"
					}
				})
			},
			jumpUser(uid) {
				uni.navigateTo({
					url: '/pages/user/home?uid=' + uid
				});
			},
			tabsChange(index) {
				this.postList = []
				this.page = 1
				this.page2 = 1
				this.current = index;
				if (index == 0) {
					this.getPostList();
				} else if (index == 1) {
					this.getPostList();
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.discuss-container {
		/* #ifdef APP-PLUS */
		background-color: #ebebeb;
		/* #endif */
		/* #ifndef APP-PLUS */
		background-color: #f9f9f9;
		/* #endif */
	}

	.discussInfo {

		padding: 20rpx;
		margin-bottom: 20rpx;
		background-color: #fff;
		align-items: center;

		.title {
			display: flex;
			justify-content: space-between;
			align-items: flex-end;
			margin: 10rpx 4rpx;
		}

		.desc {
			display: flex;
			align-items: center;

			.tag {
				width: 70rpx;
				height: 42rpx;
				font-size: 24rpx;
				text-align: center;
				border-radius: 10rpx;
				border: .5px solid #dddddd;
				margin-right: 15rpx;

			}
		}
	}

	.discussInfo>.user {
		display: flex;
		margin: 10rpx 4rpx;
		align-items: center;

		.tag {
			width: 100rpx;
			height: 42rpx;
			font-size: 24rpx;
			text-align: center;
			border-radius: 10rpx;
			border: .5px solid #dddddd;
			margin-right: 15rpx;
		}
	}

	.discussInfo>.user>.user-c {
		display: flex;
		flex-direction: column;
		margin-right: 15rpx;
	}

	.discussInfo>.user>.user-c text:nth-child(2) {
		font-size: 10px;
		color: #999;
	}

	.avatar {
		margin-right: 10rpx;
		font-size: 0;
	}

	.count {
		font-size: 12px;
		color: #999;
		margin-bottom: 10rpx;
	}

	.count text {
		margin: 0 10rpx;
	}

	.dis-title {
		font-size: 36rpx;
		font-weight: 600;
		color: #616161;
		width: 400rpx;
	}

	.discuss-desc {
		color: #616161;
	}

	.tabs-box {
		background-color: #FFFFFF;

		.tab-left {
			width: 25%;
		}
	}
</style>