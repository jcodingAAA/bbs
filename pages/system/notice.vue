<template>
	<view>

		<!-- 页面主体 -->
		<view class="page-body">
			<block v-for="(item,index) in noticeList" :key="index">
				<view class="notice-box">
					<!-- 左边消息 -->
					<view class="notice-box-cantent">
						<!-- <u-avatar :src="user.avatar" class="avatar"></u-avatar> -->
						<view class="conent-box">{{item.content}}</view>
						<!-- 	<view class="conent1" v-else-if="item.type==5">{{item.content}}</view>
					<view class="conent1" v-else @click="goPost(item.postId)">{{item.content}}</view> -->
					</view>
					<view class="time-box time">{{item.startTime}}~{{item.endTime}}</view>
				</view>
			</block>
			<!-- 加载状态 -->
			<block v-if="noticeList.length === 0 && page==1">
				<u-empty margin-top="100" text="暂无公告信息" mode="favor"></u-empty>
			</block>
			<view style="height: 130rpx;"></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				mTxt: "",
				noticeList: [],
				userInfo: uni.getStorageSync("userInfo"),
				user: {},
				page: 1,
				isTop: true, //上拉到顶后加锁处理
				timer: null, //定时器
			};
		},
		onLoad(options) {
			// this.user = JSON.parse(options.user);
			this.getNotice();
			// this.timer = setInterval(() => {
			// 	this.getMessage(1);
			// }, 30000);
		},
		onPullDownRefresh() {
			// this.page++;
			// if(this.isTop){
			// 	this.getMessage(0);
			// }
			// // console.log(this.page)
			// uni.stopPullDownRefresh();
			// if(this.timer) {
			// 	clearInterval(this.timer);  
			// 	this.timer = null;  
			// }
		},
		onReachBottom() {
			// console.log('触底了')
			// if(this.timer) {
			// 	clearInterval(this.timer);  
			// 	this.timer = null;  
			// }
			// this.timer = setInterval(() => {
			// 	this.getMessage(1);
			// }, 30000);
		},
		onUnload() {
			// if(this.timer) {  
			// 	clearInterval(this.timer);  
			// 	this.timer = null;  
			// }
			// console.log('onUnload..')
		},
		methods: {

			//如果为1说明是初始加载或发送消息后的更新，如果参数为0说明是上拉加载
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
								item.endTime = item.endTime.split(" ")[0]
							})
							this.noticeList = res.data.data
						}
					});
			},
			// sendMessage() {
			// 	if(!this.mTxt){
			// 		this.$u.toast('内容不能为空');
			// 		return;
			// 	}
			// 	this.isTop=true;
			// 	this.$H.post("user/sendMessage", {
			// 		uid: this.user.uid,
			// 		content: this.mTxt
			// 	}).then(res => {
			// 		if (res.code == 0) {
			// 			this.getMessage(1);
			// 			this.mTxt = "";
			// 		}
			// 	})
			// },
			// 更新阅读状态
			// updateChatStatus() {
			// 	this.$H.post("message/updateSystemStatus", {
			// 		uid: this.user.uid
			// 	}).then(res => {

			// 	})
			// },

			// goWatch(uid){
			// 	uni.navigateTo({
			// 		url:'/pages/user/home?uid='+uid
			// 	})
			// },
			// goPost(id){
			// 	uni.navigateTo({
			// 		url:'/pages/post/detail?id='+id
			// 	})
			// },
		}
	}
</script>

<style lang="scss" scoped>
	@import 'system.scss';
	.notice-box {
		padding: 12rpx 0;
		border-top: 1rpx solid #ddd;
		border-bottom: 1rpx solid #ddd;
		margin-bottom: 24rpx;
		
		.conent-box {
			padding: 24rpx;
			background-color: #f1f1f1;
		}
	}
	.time-box {
		text-align: right;
	}
</style>