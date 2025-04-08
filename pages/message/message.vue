<template>
	<view style="height: 100%;">
		<u-navbar :is-back="false" :border-bottom="false">
			<view class="platform">
				<!-- 头部 -->
				<view class="platform_top">
					<block v-for="(item,index) in pageTab" :key="item.name">
						<view class="platform_top_box" :class="pageCurrent == index ? 'active' : ''"
							@click="pageTabChange(index)">
							<text class="platform_top_box_title">{{item.name}}</text>
						</view>
					</block>
				</view>
			</view>
		</u-navbar>
		<view v-if="pageCurrent == 0">
			<view class="page-body">
				<block v-for="(item,index) in noticeList" :key="index">
					<view class="notice-box">
						<view class="active">
							<view v-if="item.activeStatus == 1" class="over">
								已结束
							</view>
							<view v-if="item.activeStatus == 2" class="progress">
								未结束
							</view>
						</view>
						<!-- 左边消息 -->
						<view class="notice-box-cantent">
							<!-- <u-avatar :src="user.avatar" class="avatar"></u-avatar> -->
							<view class="title-box">
								{{item.title}}
							</view>
							<view class="conent-box">
								尊贵的会员:
							</view>
							<view class="conent-box">{{item.content}}</view>
							<!-- 	<view class="conent1" v-else-if="item.type==5">{{item.content}}</view>
						<view class="conent1" v-else @click="goPost(item.postId)">{{item.content}}</view> -->
						</view>
						<view class="time-box time">有效时间:{{item.startTime}}~{{item.endTime}}</view>
					</view>
				</block>
				<!-- 加载状态 -->
				<block v-if="noticeList.length === 0 && page==1">
					<u-empty margin-top="100" text="暂无公告信息" mode="favor"></u-empty>
				</block>
				<view style="height: 130rpx;"></view>
			</view>
		</view>
		<view v-if="pageCurrent == 1" style="height: 100%;background-color: white;">
			<!-- 消息列表 -->
			<view class="message-container">
				<view class="block">
					<view @click="$f.jump('/pages/message/list?type=1')" class="message-line">
						<view class="message-info">
							<view class="message-icon">
								<u-icon name="thumb-up-fill" color="#07c160" size="60"></u-icon>
							</view>
							<view class="message-text">
								<view>
									<text>点赞</text>
									<text v-if="msgNum.thumbCount>0">{{msgNum.thumbCount}}</text>
								</view>
								<view v-if="msgNum.thumbCount>0">你有{{msgNum.thumbCount}}条消息未读</view>
								<view v-else>暂无新消息</view>
							</view>
						</view>
						<view class="message-act">
							<u-icon name="arrow-right" color="#07c160" size="36"></u-icon>
						</view>
					</view>

					<view @click="$f.jump('/pages/message/list?type=3')" class="message-line">
						<view class="message-info">
							<view class="message-icon">
								<u-icon name="file-text-fill" color="#07c160" size="60"></u-icon>
							</view>
							<view class="message-text">
								<view>
									<text>评论</text>
									<text v-if="msgNum.comment>0">{{msgNum.comment}}</text>
								</view>
								<view v-if="msgNum.comment>0">你有{{msgNum.comment}}条消息未读</view>
								<view v-else>暂无新消息</view>
							</view>
						</view>
						<view class="message-act">
							<u-icon name="arrow-right" color="#07c160" size="36"></u-icon>
						</view>
					</view>
					<view @click="$f.jump('/pages/message/list?type=2')" class="message-line">
						<view class="message-info">
							<view class="message-icon">
								<u-icon name="account-fill" color="#07c160" size="60"></u-icon>
							</view>
							<view class="message-text">
								<view>
									<text>粉丝</text>
									<text v-if="msgNum.follow>0">{{msgNum.follow}}</text>
								</view>
								<view v-if="msgNum.follow>0">你有{{msgNum.follow}}条消息未读</view>
								<view v-else>暂无新消息</view>
							</view>
						</view>
						<view class="message-act">
							<u-icon name="arrow-right" color="#07c160" size="36"></u-icon>
						</view>
					</view>
					<u-line color="#07c160" border-style="dotted"></u-line>
					<view @click="goNotice" class="message-line">
						<view class="message-info">
							<view class="message-icon">
								<u-icon name="plus-people-fill" color="#07c160" size="60"></u-icon>
							</view>
							<view class="message-text">
								<view>
									<text>新的朋友</text>
									<text v-if="totalUnread.notice>0">{{totalUnread.notice}}</text>
								</view>
								<view v-if="totalUnread.notice>0">你有{{totalUnread.notice}}条新朋友申请通知未处理</view>
								<view v-else>暂无新消息</view>
							</view>
						</view>
						<view class="message-act">
							<u-icon name="arrow-right" color="#07c160" size="36"></u-icon>
						</view>
					</view>
					<view @click="goSys" class="message-line" @longpress="onPressArticle()">
						<view class="message-info">
							<view class="message-icon">
								<u-icon name="bell-fill" color="#07c160" size="60"></u-icon>
							</view>
							<view class="message-text">
								<view>
									<text>系统通知</text>
									<text v-if="msgNum.systemUnreadCount>0">{{msgNum.systemUnreadCount}}</text>
								</view>
								<view v-if="msgNum.systemUnreadCount>0">你有{{msgNum.systemUnreadCount}}条系统通知未读</view>
								<view v-else>暂无新消息</view>
							</view>
						</view>
						<view class="message-act">
							<u-icon name="arrow-right" color="#07c160" size="36"></u-icon>
						</view>
					</view>
					<!-- 	<view @click="goGonggao" class="message-line">
						<view class="message-info">
							<view class="message-icon">
								<u-icon name="volume-up-fill" color="#07c160" size="60"></u-icon>
							</view>
							<view class="message-text">
								<view>
									<text>公告列表</text>
								</view>
								<view>查看公告</view>
							</view>
						</view>
						<view class="message-act">
							<u-icon name="arrow-right" color="#07c160" size="36"></u-icon>
						</view>
					</view> -->
					
					
					<!-- 私信列表 -->
					<view @click="goChatList" class="message-line">
						<view class="message-info">
							<view class="message-icon">
								<u-icon name="chat-fill" color="#07c160" size="60"></u-icon>
							</view>
							<view class="message-text">
								<view>
									<text>私信列表</text>
									<text v-if="totalUnread.message>0">{{totalUnread.message}}</text>
								</view>
								<view v-if="totalUnread.message>0">你有{{totalUnread.message}}条私信未读</view>
								<view v-else>暂无新消息</view>
							</view>
						</view>
						<view class="message-act">
							<u-icon name="arrow-right" color="#07c160" size="36"></u-icon>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="pageCurrent == 2" style="height: 100%;background-color: white;">
			<u-index-list :indexList="indexList" :scrollTop="scrollTop">
				<template v-for="(item, index) in friendListShow">
					<view :key="index">
						<u-index-anchor v-if="item.length!==0" :use-slot="true"><text
								class="anchor-text">{{indexList[index]}}</text></u-index-anchor>
						<view class="list" v-for="(item1, index1) in item" :key="index1">
							<view class="list__item" @tap="gotoFriendInfo(item1.id)">
								<image class="list__item__avatar" :src="item1.url"></image>
								<text
									style="margin-left:30rpx;font-size: 36rpx;color: #2c2c2c;font-weight: 520;">{{item1.name}}</text>
								<view style="margin-left: auto;margin-right: 40rpx;" @click.stop="showFriend(item1.id)">
									<u-icon name="more-dot-fill" color="#b3b3b3"></u-icon>
								</view>
							</view>
							<u-line></u-line>
						</view>
					</view>
				</template>
			</u-index-list>
			<block v-if="friendList.length == 0">
				<view class="msg-empty">
					<image class="img" mode="widthFix" src="/static/empty.png"></image>
					<text class="txt">暂无好友哦~</text>
				</view>
			</block>
			<view class="count-desc" v-if="friendList.length > 0">
				<text class="list__footer">共{{friendList.length}}位好友</text>
			</view>
		</view>
		<!-- 删除系统消息弹窗 -->
		<u-action-sheet :list="sheetList" v-model="showSheet" @click="onSheetItem"></u-action-sheet>
		<!-- tabbar -->
		<lf-tabbar :active="3" :count="messegeNum"></lf-tabbar>
		<!-- 发布弹窗 -->
		<u-popup v-model="showPlusPost" mode="center" border-radius="20" width="80%">
			<view class="share-type">
				<view @click="toPost(1)" class="type-item">
					<u-icon class="icon" size="40" name="photo" color="#aaaaff"></u-icon>
					<text>发布帖子</text>
				</view>
				<view @click="toPost(2)" class="type-item" v-if="isOpen==1">
					<u-icon class="icon" size="40" name="play-circle-fill" color="#aa55ff"></u-icon>
					<text>发布视频</text>
				</view>
				<view @click="toPost(4)" class="type-item">
					<u-icon class="icon" size="36" name="order" color="#e34b00"></u-icon>
					<text>发布长文</text>
				</view>
				<view @click="toPost(3)" class="type-item">
					<image class="icon" src="/static/h_1.png"></image>
					<text>发布投票</text>
				</view>
			</view>
		</u-popup>
		<!-- 弹窗 -->
		<u-popup v-model="showFriendPop" mode="center" border-radius="20" width="80%">
			<view class="share-type">
				<view @click="gotoChat" class="type-item">
					<u-icon class="icon" size="40" name="email-fill"></u-icon>
					<text>发送私信</text>
				</view>
				<view @click="doDeleteFriend" class="type-item">
					<u-icon class="icon" size="40" name="trash-fill"></u-icon>
					<text>删除好友</text>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	const indexList = () => {
		const indexList = []
		const charCodeOfA = 'A'.charCodeAt(0)
		indexList.push("↑")
		indexList.push("☆")
		for (let i = 0; i < 26; i++) {
			indexList.push(String.fromCharCode(charCodeOfA + i))
		}
		indexList.push('#')
		return indexList
	}
	import dayjs from 'dayjs'
	import uIndexList from '@/uview-ui/components/u-index-list/u-index-list.vue';
	import {
		mapGetters
	} from 'vuex';
	import $store from '@/store/index.js';
	import websocket from '@/utils/websocket.js';
	export default {
		data() {
			return {
				isOpen: getApp().globalData.isOpen,
				noticeList: [],
				showPlusPost: false,
				showSheet: false,
				showChatSheet: false,
				sheetList: [{
					text: '删除',
					color: 'red'
				}],
				msgNum: {
					thumbCount: 0,
					follow: 0,
					comment: 0,
					systemUnreadCount: 0,
					articleMsgList: [],
					chatMsgList: [],
				},
				checkedMsgId: '',
				checkedIndex: '',
				checkedMsgUid: '',
				adminInfo: {
					username: '系统通知',
					avatar: 'https://demo.linfeng.tech/resource/images/sys.png',
					uid: 1
				},
				pageTab: [{
						name: '公告列表'
					}, {
						name: '消息'
					},
					{
						name: '好友'
					}
				],
				pageCurrent: 1,
				indexList: indexList(),
				scrollTop: 0,
				showFriendPop: false,
				currentFriendId: '',
				selectUser: {}
			};
		},
		components: {
			uIndexList: uIndexList
		},
		computed: {
			...mapGetters(['loginUserInfo', 'isSocketOpen', 'friendListShow', 'friendList', 'totalUnread', 'messegeNum',
				'sessionList'
			])
		},
		onLoad(options) {
			if(options.index == 0) {
				this.pageCurrent = options.index 
			}
			//重新获取连接websocket
			this.getNotice();
			if (!$store.state.isSocketOpen && uni.getStorageSync('hasLogin')) {
				websocket.initConnect()
			}
		},
		onShow() {
			if (uni.getStorageSync('userInfo').uid) {
				this.getMsgNum();
			}
			//重新获取连接websocket
			if (!$store.state.isSocketOpen && uni.getStorageSync('hasLogin')) {
				websocket.initConnect()
				$store.dispatch('getFriendList')
				$store.dispatch('getNoticeList')
			}
		},
		onPullDownRefresh() {
			this.getMsgNum();
			uni.stopPullDownRefresh();
		},
		methods: {
			pageTabChange(index) {
				this.pageCurrent = index
			},
			goSys() {
				if (uni.getStorageSync('hasLogin')) {
					this.$f.jump('/pages/system/system?user=' + this.$f.tostring(this.adminInfo))
				} else {
					this.$f.toast('请先登录哦')
				}
			},
			goGonggao() {
				if (uni.getStorageSync('hasLogin')) {
					this.$f.jump('/pages/system/notice')
				} else {
					this.$f.toast('请先登录哦')
				}
			},
			goChatList() {
				if (uni.getStorageSync('hasLogin')) {
					this.$f.jump('/pages/im/chat-list/chat-list')
				} else {
					this.$f.toast('请先登录哦')
				}
			},
			goNotice() {
				if (uni.getStorageSync('hasLogin')) {
					this.$f.jump('/pages/im/notice-list/notice-list')
				} else {
					this.$f.toast('请先登录哦')
				}
			},
			// 更新阅读状态
			articleMsgState(id) {
				this.$H.post('message/articleMsgState', {
					id: id
				});
			},
			// 长按图文消息
			onPressArticle() {
				this.showSheet = true;
			},
			// 删除系统消息
			onSheetItem(index) {
				if (index == 0) {
					this.$H
						.post('message/delSystemMsg').then(res => {
							if (res.code == 0) {
								this.msgNum.systemUnreadCount = 0
							}
						});
				}
			},

			getMsgNum() {
				this.$H.post('message/num').then(res => {
					this.msgNum = res.result;
					let all = this.$store.state.totalUnread.message + this.$store.state.totalUnread.notice + res
						.result.allCount
					this.$store.state.messegeNum = [0, 0, 0, all, 0];
				});
			},
			gotoFriendInfo(id) {
				uni.navigateTo({
					url: '/pages/user/home?uid=' + id
				})
			},
			onPageScroll(e) {
				this.scrollTop = e.scrollTop;
			},
			toPlus() {
				this.showPlusPost = true;
			},
			toPost(i) {
				this.showPlusPost = false;
				if (i == 3) {
					this.$f.jump('/pages/vote/vote')
				} else if (i == 4) {
					this.$f.jump('/subpages/content/article/add')
				} else {
					this.$f.jump('/pages/post/add?type=' + i)
				}
			},
			showFriend(uid) {
				this.showFriendPop = true
				this.currentFriendId = uid
				this.$H.post('user/userInfoById', {
					uid: uid
				}).then(res => {
					this.selectUser = res.result;
				})
			},
			doDeleteFriend() {
				if (!uni.getStorageSync('hasLogin')) {
					this.$f.toast('请先登录哦')
					return
				}
				this.showFriendPop = false
				var that = this;
				uni.showModal({
					title: '提示',
					content: '确定删除该好友吗？',
					success: function(res) {
						if (res.confirm) {
							that.$H.post('friend/deleteFriend', {
								id: that.currentFriendId
							}).then(res => {
								if (res.code == 0) {
									this.showFriendPop = false
									that.$f.toast("操作成功")
									//获取好友列表
									$store.dispatch('getFriendList');
								}
							});
						} else if (res.cancel) {

						}
					}
				});
			},
			//跳转聊天页面
			gotoChat() {
				if (!uni.getStorageSync('hasLogin')) {
					this.$f.toast('请先登录哦')
					return
				}
				for (let i = 0; i < this.sessionList.length; i++) {
					if (this.sessionList[i].chattingUserId == this.selectUser.uid) {
						$store.state.chattingUserInfo = this.sessionList[i]
						break;
					}
				}
				this.$H.post('chat/list', {
					sessionId: $store.state.chattingUserInfo.sessionId,
					pageNum: 1,
					pageSize: 20
				}).then(res => {
					if (res.code == 0) {
						let data = res.data
						for (let i = 0; i < $store.state.personMessage.length; i++) {
							if ($store.state.personMessage[i].sessionId == data.sessionId) {
								let current = Number(data.pageInfo.current)
								let total = Number(data.pageInfo.total)
								let size = Number(data.pageInfo.size)
								$store.state.personMessage[i].lastMessageId = data.pageInfo.records
									.length != 0 ? data.pageInfo.records[0].id : 0
								$store.state.personMessage[i].list = data.pageInfo.records.reverse()
								$store.state.personMessage[i].pageNum = current
								$store.state.personMessage[i].hasNextPage = current * size < total
								break;
							}
						}
						this.showFriendPop = false
						uni.navigateTo({
							url: '/pages/im/chat/chat'
						})
					} else {
						uni.showToast({
							icon: 'none',
							mask: '消息加载失败'
						})
					}
				})
			},
			//获取公告列表
			getNotice() {
				this.$H.get('home/notice/page', {
						type: 1,
						page: 1
					})
					.then(res => {
						if (res.code == "0") {
							const noticeList = []
							res.data.data.forEach(item => {
								item.startTime = item.startTime.split(" ")[0]
								const date1 = dayjs(item.endTime);
								const date2 = dayjs(new Date());
								// 计算两个日期之间的差值（单位为分钟）
								const diffInMinutes = date2.diff(date1, 'minute');
								if (diffInMinutes > 0) {
									item.activeStatus = 1
								} else {
									item.activeStatus = 2
								}
								item.endTime = item.endTime.split(" ")[0]

							})
							this.noticeList = res.data.data
						}
					});
			},
		}
	};
</script>

<style lang="scss" scoped>
	@import url('@/static/css/navigate-bar.css');

	page {
		height: 100%;
		background-color: #EEEEEE;
	}

	.msg-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: 800rpx;

		.img {
			width: 200rpx;
			margin-top: 100rpx;
		}

		.txt {
			color: #999;
			font-size: 20rpx;
			margin-top: 20rpx;
		}
	}

	.list-cell {
		display: flex;
		box-sizing: border-box;
		width: 100%;
		padding: 10px 24rpx;
		overflow: hidden;
		color: #323233;
		font-size: 14px;
		line-height: 24px;
		background-color: #fff;
	}

	.list__item:active {
		background-color: #e8e8e8;
	}

	.list {

		&__item {
			// @include flex;
			padding: 10px 16px;
			align-items: center;
			display: flex;

			&__avatar {
				height: 45px;
				width: 45px;
				border-radius: 5px;
			}
		}

		&__footer {
			color: $u-tips-color;
			font-size: 14px;
			text-align: center;
			margin: 15px 0;
		}
	}

	.count-desc {
		height: 150rpx;
		text-align: center;
	}

	.search-wrap {
		display: flex;
		justify-content: center;
	}

	.platform {
		background-color: white;
		padding: 0 12rpx;
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

	.message-container {
		padding: 0 20rpx;
	}

	.message-line {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 0px;
		border-bottom: 1rpx solid #EEEEEE;
	}

	.message-line:last-of-type {
		border: none;
	}

	.message-info {
		display: flex;
		align-items: center;
	}

	.message-icon {
		height: 104rpx;
		line-height: 104rpx;
		text-align: center;
		width: 104rpx;
		border-radius: 50%;
		background: #f5f5f5;
	}

	.message-text {
		padding-left: 20rpx;
		color: #07c160;
	}

	.message-text view:nth-child(1) {
		display: flex;
		align-items: center;
	}

	.message-text view:nth-child(1) text:nth-child(1) {
		font-size: 32rpx;
		font-weight: 600;
	}

	.message-text view:nth-child(1) text:nth-child(2) {
		font-size: 20rpx;
		font-weight: 300;
		color: #FFFFFF;
		height: 36rpx;
		line-height: 36rpx;
		border-radius: 18rpx;
		padding: 0 12rpx;
		background: #f34d15;
		margin-left: 12rpx;
	}

	.message-text view:nth-child(2) {
		font-size: 28rpx;
		font-weight: 400;
		color: #666666;
	}

	.share-type {
		padding: 50rpx 30rpx;

		.type-item {
			background-color: #F5F5F5;
			padding: 20rpx;
			display: flex;
			justify-content: center;
			align-items: center;

			.icon {
				width: 40rpx;
				height: 40rpx;
				margin-right: 20rpx;
			}

			&:nth-child(2) {
				margin: 20rpx 0;
			}

			&:nth-child(3) {
				margin: 20rpx 0;
			}
		}
	}

	.page-body {
		padding: 20rpx;

		.notice-box {
			padding: 12rpx 24rpx;
			border-top: 1rpx solid #ddd;
			// border-bottom: 1rpx solid #ddd;
			margin-bottom: 24rpx;
			background-color: white;
			margin-bottom: 30rpx;
			position: relative;

			.active {
				position: absolute;
				right: 24rpx;
				top: 24rpx;
				font-size: 28rpx;
				.over {
					background-color: #dfdfdf;
					color: #a4a4a4;
					padding: 0 12rpx;
				}

				.progress {
					background: #add7fe;
					color: #4a97e0;
					padding: 0 12rpx;
				}
			}

			.title-box {
				font-size: 36rpx;
				// font-weight: bold;
			}

			.conent-box {
				font-size: 24rpx;
				line-height: 30rpx;
				// background-color: #f1f1f1;
			}
		}

		.time-box {
			border-top: 1rpx solid #c6c6c6;
			text-align: left;
			font-size: 24rpx;
			color: #888;
			padding: 12rpx 0;
			margin-top: 28rpx;
		}
	}

	// .notice-box {
	// 	padding: 12rpx 0;
	// 	border-top: 1rpx solid #ddd;
	// 	border-bottom: 1rpx solid #ddd;
	// 	margin-bottom: 24rpx;
	// 	.conent-box {
	// 		padding: 24rpx;
	// 		background-color: #f1f1f1;
	// 	}
	// }
	// .time-box {
	// 	text-align: right;
	// }
</style>