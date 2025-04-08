<template>
	<view class="index-con" :style="{paddingTop:navbarHeight +'px'}">
		<!-- 头部信息 -->
		<view id="navbar" class="lf-nav" :style="{paddingTop:statusBarHeight +'px',zIndex: '999'}">
			<view class="lf-all">
				<view class="lf-all-nav" :style="{height: navigationBarHeight+'px'}">
					<u-icon name="arrow-left" size="28rpx" @click="goBack" />
					<text style="font-size: 28rpx;font-weight: bold;">{{title}}</text>
					<view class=""></view>
					<view class="right">
						<!-- <u-icon name="calendar" size="28rpx" color="#07C160" @click="yearPicker" v-if="topSwitch" /> -->
						<view class="right-box">
							<image src="../../static/icon/icon_time.png" mode="widthFix" style="width: 35rpx;"
								@click="goHistory()"></image>
								历史记录
						</view>
						<view class="right-box" @click="goAdd()">
							<image src="../../static/icon/icon_pencil.png" mode="widthFix" style="width: 35rpx;">
							</image>
							发表评论
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="lf-top" style="padding-top: 0;">
			<view class="year-body">
				<scroll-view class="scroll-view_H" scroll-x="true" scroll-left="0">
					<view class="scroll-view-tab" v-for="(item,index) in yearList" :key="index"
						@click="yearChange(index,item)">
						<view class="text" :class="index == yearIndex ? 'text-active' : ''">
							{{item}}
						</view>
					</view>
				</scroll-view>
			</view>
			<view class="period-body">
				<scroll-view class="scroll-view_H" scroll-x="true" scroll-left="0">
					<view class="scroll-view-tab" v-for="(item,index) in periodList" :key="index"
						@click="periodChange(index,item)">
						<view class="text" :class="index == periodIndex ? 'text-active' : ''">
							{{item.label}}
						</view>
					</view>
				</scroll-view>
				<view class="period-select">
					<u-dropdown ref="uDropdown" class="u-dropdown">
						<u-dropdown-item :title="periodSelectTitle">
							<view class="slot-content" style="background-color: #FFFFFF;">
								<scroll-view scroll-y="true" style="height: 200rpx;">
									<view class="select-box">
										<view class="select-box-contant" v-for="(item,index) in periodList" :key="index"
											@click="periodChange(index,item)">
											<view class="text"
												:class="index == periodIndex ? 'text-seclect-active' : ''">
												{{item.label}}
											</view>
										</view>
									</view>
								</scroll-view>
							</view>
						</u-dropdown-item>
					</u-dropdown>
				</view>
			</view>
			<view class="lottery" v-if="numberList && numberList.length > 0">
				<view class="kuang_bg">
					 <text class="kuang_bg_top">{{year}} <text style="margin-left: 14rpx;">{{periodSelectTitle}}</text></text>
					<view class="platform_data">
						<view class="platform_data_box" v-for=" (item,index) in numberList" :key="index">
							<view style="font-size: 40rpx;font-weight: bold;margin-top: 8rpx;margin-right: 15rpx;"
								v-if="index == numberList.length - 1">
								+
							</view>
							<view class="platform_data_ball">
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
				</view>
			</view>
		</view>
		<view class="info-box">
			<view class="icon">
				<text>{{ postDetail.createTime | timeFormat }}</text>
			</view>
			<view class="hr"></view>
			<view class="post-title">{{ postDetail.title }}</view>
			<!-- <rich-text class="post-text" @longpress="onCopy" :nodes="postDetail.content"></rich-text> -->
			<view class="post-text">
				<mp-html :content="postDetail.content" selectable="true" />
			</view>
			<!-- 图片 -->
			<block>
				<!--一张图片-->
				<block v-if="postDetail.media.length == 1">
					<image class="img-style-1" @tap.stop="previewImage" mode="widthFix"
						:data-current="postDetail.media[0]" :data-image="postDetail.media" :src="postDetail.media[0]">
					</image>
				</block>
				<!--二张图片-->
				<block v-else-if="postDetail.media.length == 2">
					<view class="img-style-2">
						<image v-for="(mediaItem, index2) in postDetail.media" :key="index2" @tap.stop="previewImage"
							mode="aspectFill" :data-current="mediaItem" :data-image="postDetail.media" :src="mediaItem">
						</image>
					</view>
				</block>
				<!--四张图-->
				<block v-else-if="postDetail.media.length == 4">
					<view class="img-style-4">
						<image v-for="(mediaItem, index2) in postDetail.media" :key="index2" @tap.stop="previewImage"
							mode="aspectFill" :data-current="mediaItem" :data-image="postDetail.media" :src="mediaItem">
						</image>
					</view>
				</block>
				<!--其他张数图片-->
				<block v-else>
					<view class="other-img-flex" :class="imageClass[postDetail.media.length]">
						<view :class="'wrap-style ' + 'wrap-style-' + (imageIndex + 1)"
							v-for="(image, imageIndex) in postDetail.media" :key="imageIndex">
							<image class="show-flex" mode="aspectFill" @tap.stop="previewImage" :data-current="image"
								:data-image="postDetail.media" :src="image"></image>
						</view>
					</view>
				</block>
			</block>
			<block v-if="postDetail.type == 2 && postDetail.media.length > 0">
				<video :controls="true" :autoplay="true" :loop="true" :src="postDetail.media[0]"></video>
			</block>
			<!-- 投票 -->
			<view class="tixing-btn" @click="ticketShow = true" v-if="!ticketShow">
				<view class="tixing">
					<view class="triangle-top"></view> 展开投票
				</view>
			</view>
			<view class="vote-box" v-if="ticketShow">
				<view class="vote-item" v-for="(item2, index2) in postDetail.voteInfo.options" :key="index2">
					{{ item2.ticketNum || 0 }}票
					<view class="vote-item-box">
						{{ item2.content }}
						<u-line-progress active-color="#07c106" :percent="item2.progress || 0"
							:show-percent="false"></u-line-progress>
						{{ item2.progress || 0.00 }}%
					</view>
				</view>
				<view class="btn" v-if="!postDetail.isVoteResult && isVoteExpire === false" @click="voteHandle">投票
				</view>
			</view>
			<view class="tixing-btn" @click="ticketShow = false" v-if="ticketShow">
				<view class="tixing">
					<view class="triangle-bottom"></view> 收起投票
				</view>
			</view>

		</view>
		<!-- 中间的打赏模块 -->
		<!-- 首页轮播 -->
		<view class="banner">
			<swiper class="swiper" circular :indicator-dots="true" :autoplay="true" :interval="5000" :duration="500"
				:indicator-active-color="'#ffffff'">
				<swiper-item v-for="(item,index) in listWheelAdvert" :key="item.id" @click="goUrl(item)">
					<image :src="item.img" style="width: 100%;" mode="widthFix"></image>
				</swiper-item>
			</swiper>
		</view>

		<view class="comment-box">
			<view class="title">评论（{{ postDetail.commentCount }}）</view>
			<view style="margin-bottom: 40rpx;" v-for="(item, index) in commentList" :key="index">
				<view class="comment-item" @longpress="delComment(item, index)">
					<image @click="jumpUser(item.userInfo.uid)" class="avatar" :src="item.userInfo.avatar"></image>
					<view class="c-content" @click="onReply(item)">
						<view class="user">
							<text style="color: #999;">{{ item.userInfo.username }}</text>
							<image style="height: 22rpx;margin-left:10rpx ;margin-top: 20rpx;" mode="heightFix"
								v-if="item.userInfo.level" :src="$IMG+'/vip/level_'+item.userInfo.level+'.png'"
								class="level-img-2" />
							<image v-if="item.userInfo.vip==1" src="@/static/vip/vipIcon.png"
								style="width: 75rpx;height: 30rpx;margin-left: 7rpx;margin-top: 20rpx;"
								mode="heightFix" />
							<text v-if="item.userInfo.uid == postDetail.userInfo.uid" class="official">楼主</text>
							<block v-if="item.isThumbs">
								<view @click.stop="cancelThumbs(item.id, index)" class="thumbs">
									<text class="num">{{ item.thumbs }}</text>
									<u-icon class="icon" size="40" name="thumb-up-fill" color="#e62e00"></u-icon>
								</view>
							</block>
							<block v-else>
								<view @click.stop="onThumbs(item.id, index)" class="thumbs">
									<text class="num">{{ item.thumbs }}</text>
									<u-icon class="icon" size="40" name="thumb-up-fill" color="#bfbfbf"></u-icon>
								</view>
							</block>
						</view>
						<text class="c-txt">{{ item.content }}</text>
						<text class="time">{{ item.createTime | timeFormat }}</text>
					</view>
				</view>
				<view @longpress="delComment(item, index, index2)" @click="onReply(item2, index, index2)"
					v-if="item.children!=null&&item.children.length > 0" v-for="(item2, index2) in item.children"
					:key="item2.id" class="sub-comment-item">
					<view class="user">
						<u-avatar class="avatar" :size="40" :src="item2.userInfo.avatar"></u-avatar>
						<view class="u-head">
							<text style="color: #999;">{{ item2.userInfo.username }}</text>
							<image style="height: 22rpx;margin-left:10rpx ;margin-top: 20rpx;" mode="heightFix"
								v-if="item2.userInfo.level" :src="$IMG+'/vip/level_'+item2.userInfo.level+'.png'"
								class="level-img-2" />
							<image v-if="item2.userInfo.vip==1" src="../../static/vip/vipIcon.png"
								style="width: 75rpx;height: 30rpx;margin-left: 7rpx;margin-top: 20rpx;"
								mode="heightFix" />
							<text v-if="item2.userInfo.uid == postDetail.userInfo.uid" class="official">楼主</text>
							<block v-if="item2.isThumbs">
								<view class="thumbs" @click.stop="cancelThumbs(item2.id, index, index2)">
									<text class="num">{{ item2.thumbs }}</text>
									<u-icon class="icon" size="40" name="thumb-up-fill" color="#e62e00"></u-icon>
								</view>
							</block>
							<block v-else>
								<view class="thumbs" @click.stop="onThumbs(item2.id, index, index2)">
									<text class="num">{{ item2.thumbs }}</text>
									<u-icon class="icon" size="40" name="thumb-up-fill" color="#bfbfbf"></u-icon>
								</view>
							</block>
						</view>
					</view>
					<view class="reply">
						<text>@</text>
						<navigator :url="'/pages/user/home?uid=' + item2.toUser.uid" hover-class="none" class="name">
							{{ item2.toUser.username }}
						</navigator>
						<text>：{{ item2.content }}</text>
						<view class="time">{{ item2.createTime | timeFormat }}</view>
					</view>
				</view>
			</view>
			<!-- 加载状态 -->
			<block v-if="commentList!=null&&commentList.length > 0">
				<view style="margin: 30rpx;">
					<u-loadmore :status="loadStatus" />
				</view>
			</block>
			<block v-else>
				<u-empty text="暂无评论" mode="message"></u-empty>
			</block>
		</view>
		<view style="height: 100rpx;"></view>
		<!-- 评论输入框 -->
		<!-- <view class="comment-tool">
			<textarea :placeholder="placeholder" @blur="onBlur" :focus="focus" fixed="true" cursor-spacing="10"
				v-model="form.content" auto-height="true" placeholder-class="txt-placeholder" confirm-type="send"
				@confirm="addComment"></textarea>
			<u-button @click="addComment" :disabled="isSubmitD" :custom-style="btnStyle" style="border-radius: 0;">发布
			</u-button>
		</view> -->
		<view class="comment-tool">
			<view style="height: 60rpx;width: 100%;display: flex;flex-direction: row;align-items: center;"
				@click="showComment = true">
				<view class=""
					style="height: 60rpx;font-size: 28rpx;font-weight: 500;line-height: 60rpx;width: 70%;margin-right: 20rpx;background-color: #f1f1f1;padding-left: 24rpx;border-radius: 50rpx;color: silver;">
					{{placeholder}}
				</view>
				<u-button :disabled="true" :custom-style="btnDefultStyle" type="success">发布
				</u-button>
			</view>

			<!--点赞、分享、评论-->
			<view class="p-footer">
				<block v-if="postDetail.isCollection">
					<view class="p-item" @click="cancelCollection">
						<u-icon name="thumb-up-fill" size="30" color="#cc0000"></u-icon>
						<!-- <text class="iconfont icon-lujing" style="color: #d81e06;"></text> -->
						<text>{{ postDetail.collectionCount }}</text>
					</view>
				</block>
				<block v-else>
					<view class="p-item" @click="addCollection">
						<!-- #ifdef APP-PLUS -->
						<text class="iconfont icon-shoucang"></text>
						<!-- #endif -->
						<!-- #ifdef H5 || MP-WEIXIN -->
						<u-icon name="thumb-up" size="30"></u-icon>
						<!-- #endif -->
						<text>{{ postDetail.collectionCount }}</text>
					</view>
				</block>
				<!-- 	<view class="p-item" @click="focus = true">
					<text class="iconfont icon-pinglun"></text>
					<text>{{ postDetail.commentCount }}</text>
				</view> -->
				<!-- #ifdef MP -->
				<view class="p-item" @click="openShare()">
					<text class="iconfont icon-forward"></text>
					<text>分享</text>
				</view>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<view class="p-item" @click="showShare = true">
					<text class="iconfont icon-forward"></text>
					<text>分享</text>
				</view>
				<!-- #endif -->
				<!-- #ifdef APP-PLUS -->
				<view class="p-item">
					<text class="iconfont icon-yuedu"></text>
					<text>{{ postDetail.readCount }}</text>
				</view>
				<!-- #endif -->
				<!-- #ifdef H5 -->
			<!-- 	<view class="p-item" @click="openRewardBtn" v-if="rewardBtn=='1'&&postDetail.type!=2">
					<image src="../../static/images/hongbao.png" mode="widthFix" style="width: 30rpx;"></image>
					<text>打赏</text>
				</view> -->
				<!-- #endif -->
			</view>
		</view>
		<!-- 分享选择弹窗 -->
		<lf-popup v-model="showShare" height="240rpx">
			<view class="share-wrap" @click="closeShare">
				<!-- #ifdef MP-WEIXIN -->
				<button open-type="share" class="share-item u-reset-button">
					<image src="/static/wechat.png"></image>
					<text>微信好友</text>
				</button>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<view class="share-item2" @click="copyPageUrl">
					<image src="/static/images/share.png"></image>
					<text>分享链接</text>
				</view>
				<!-- #endif -->
				<!-- #ifdef H5 || MP-WEIXIN -->
				<!-- 		<view class="share-item" @click="shareCanvas">
					<image src="/static/images/share2.png"></image>
					<text>分享海报</text>
				</view> -->
				<!-- #endif -->
			</view>
		</lf-popup>
		<!-- 分享海报弹窗-->
		<u-popup v-model="showCanvas" mode="center" width="80%">
			<view class="share-box">
				<image :src="posterUrl" class="images"></image>
			</view>
			<view class="footer">
				<u-button :custom-style="shareBtnStyle" @click="saveImg" type="success" shape="circle">保存分享</u-button>
			</view>
		</u-popup>
		<!-- 打赏弹框 -->
		<u-popup v-model="showReward" mode="center">
			<view class="show-reward">
				<image class="show-reward-image" @click="jumpUser(postDetail.uid)" :src="postDetail.userInfo.avatar" />
				<text
					style="font-weight: 600;font-size:30rpx;margin-bottom: 20rpx;">{{postDetail.userInfo.username}}</text>

				<view class="show-reward-view">
					<view @tap.stop.prevent="changeRewardSelect" :class="rewardCount == 5 ? 'check-it' : ''"
						data-price="5">$5</view>
					<view @tap.stop.prevent="changeRewardSelect" :class="rewardCount == 20 ? 'check-it' : ''"
						data-price="20">$20</view>
					<view @tap.stop.prevent="changeRewardSelect" :class="rewardCount == 50 ? 'check-it' : ''"
						data-price="50">$50</view>
					<view @tap.stop.prevent="changeRewardSelect" :class="rewardCount == 100 ? 'check-it' : ''"
						data-price="100">$100</view>
				</view>
				<view class="show-reward-pop">
					<text>$</text>
					<input class="show-input-pop" @input="rewardChange" :value="rewardCount"
						placeholder-class="count-input" type="number" placeholder="请输入打赏积分" />
				</view>
				<view class="show-reward-btn" @tap.stop.prevent="submitReward">确认打赏</view>
			</view>
		</u-popup>
		<u-popup mode="center" v-model="ticketPupop">
			<view class="popup-title">
				{{year}}年第{{period}}期
			</view>
			<view class="ticket-popup">
				<view class="vote-item" @click="castVote(index2, postDetail.voteInfo.type)"
					:class="{ active: item2.checked }" v-for="(item2, index2) in postDetail.voteInfo.options"
					:key="index2">
					<text>{{ item2.content }}</text>
					<text>({{ item2.ticketNum || 0 }}票)</text>
					<!-- <text v-else="postDetail.isVoteResult">{{ item2.content }}</text> -->
				</view>

			</view>
			<view class="bottom-btn" v-if="!postDetail.isVoteResult && isVoteExpire === false" @click="voteSubmit">投票
			</view>
		</u-popup>
		<!-- 评论 -->
		<u-popup v-model="showComment" mode="center" @close="commentClose()">
			<view class="comment-body">
				<view class="title">
					{{commentTitle}}
				</view>
				<view class="contant">
					<u-input v-model="form.content" :type="'textarea'" :border="true" :height="500"
						:auto-height="true" />
					<!-- 	<input type="text" :placeholder="placeholder"
						style="height: 60rpx;font-size: 28rpx;font-weight: 500;line-height: 60rpx;width: 96%;margin-right: 20rpx;background-color: #f1f1f1;padding-left: 24rpx;border-radius: 50rpx;"
						@blur="onBlur" @focus="focus()" v-model="form.content" confirm-type="send" @confirm="addComment"> -->
				</view>
				<u-button @click="addComment" :disabled="isSubmitD" :custom-style="btnStyle" type="success">发布
				</u-button>
			</view>
		</u-popup>
		<!-- 自定义加载 -->
		<toast color="#fff" type="rotate3"></toast>
	</view>
</template>

<script>
	import linfengAd from "@/components/linfeng-ad/linfeng-ad.vue";

	export default {
		components: {
			linfengAd
		},
		data() {
			return {
				numberList: [],
				showComment: false,
				commentTitle: "发布评论",
				navbarHeight: 0,
				listWheelAdvert: [],
				ticketShow: false,
				ticketPupop: false,
				$IMG: this.$IMG,
				btnStyle: {
					borderRadius: '100rpx',
					color: "#fff",
					backgroundColor: '#07c160',
					width: '166rpx',
					height: '60rpx',
					fontSize: '28rpx'
				},
				btnDefultStyle: {
					borderRadius: '30rpx',
					color: "#fff",
					backgroundColor: '#07c160',
					width: '70rpx',
					height: '50rpx',
					fontSize: '24rpx',
				},
				postId: 0,
				postDetail: {
					comment: [],
					media: [],
					commentList: {
						data: []
					},
					topicInfo: {
						topicName: ''
					},
					userInfo: {

					},
					voteInfo: {},
					content: ''
				},
				focus: false,
				isSubmitD: false,
				commentList: [],
				placeholder: '说点什么...',
				form: {
					pid: 0,
					type: 1,
					toUid: '',
					postId: '',
					content: ''
				},
				showShare: false,
				showCanvas: false,
				shareBtnStyle: {
					backgroundColor: '#333'
				},
				page: 1,
				loadStatus: 'loadmore',
				isVoteExpire: false,
				isVip: 0,
				posterUrl: "",
				showTel: false,
				imageClass: ['', 'one-img', 'two-img', 'three-img', 'four-img', 'five-img', 'six-img', 'seven-img',
					'eight-img', 'nine-img'
				],
				h5Adpid: '',
				wxAdpid: '',
				adIsOpen: '',
				showType: '0',
				rewardBtn: '0',
				showReward: false,
				rewardCount: '',
				pictureTypeId: "",
				period: "",
				year: "",
				title: "",
				yearList: [],
				periodList: [],
				yearIndex: 0,
				periodIndex: "",
				periodSelectTitle: "请选择",
				ticketSum: null,
			};
		},
		onLoad(options) {
			this.navigationBarHeight = getApp().globalData.navigationBarHeight;
			this.statusBarHeight = getApp().globalData.statusBarHeight;
			if (options.item) {
				const item = JSON.parse(decodeURIComponent(options.item));
				console.log(item)
				this.pictureTypeId = item.pictureTypeId || item.id
				this.period = item.period
				this.year = item.year
				// this.postId = item.pictureTypeId;
				this.title = item.title
			}


			if (options.scene) {
				this.postId = options.scene;
			}
			if (options.mid) {
				this.messageRead(options.mid);
			}

			// this.form.postId = this.postId;
			this.getBanner()
			this.getPostDetail();
			this.getAdConfig();
			let userInfo = uni.getStorageSync('userInfo');
			if (userInfo) {
				this.isVip = uni.getStorageSync('userInfo').vip
			}
			//#ifdef MP-WEIXIN
			wx.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline']
			});
			//#endif
		},
		onReachBottom() {
			this.page++;
			this.getCommentList();
		},
		onShareAppMessage(res) {

			let imgURL;
			if (this.postDetail.media != null) {
				if (this.postDetail.media.length > 0) {
					imgURL = this.postDetail.media[0];
				}
			}
			return {
				title: this.postDetail.content,
				path: '/pages/post/detail?id=' + this.postId,
				imageUrl: imgURL
			};
		},
		onShareTimeline() {
			let imgURL = (imgURL = this.postDetail.media[0]);
			return {
				title: this.postDetail.content,
				imageUrl: imgURL,
				query: 'id=' + this.postId
			};
		},
		methods: {
			//获取广告配置
			getAdConfig() {
				this.$H.get('system/getAd').then(res => {
					if (res.code == 0) {
						this.adIsOpen = res.adIsOpen;
						this.h5Adpid = res.h5Adpid;
						this.wxAdpid = res.wxAdpid;
					}
				});
			},
			close(e) {
				this.showTel = e
			},
			openShare() {
				this.showShare = true
			},
			messageRead(mid) {
				this.$H
					.post('message/readMessage', {
						postId: this.postId,
						mid: mid
					})
					.then(res => {

					});
			},
			voteHandle() {
				const token = uni.getStorageSync("token");
				if (!token) {
					// #ifdef MP-WEIXIN
					uni.navigateTo({
						url: "/pages/user/login"
					})
					// #endif

					// #ifdef H5||APP-PLUS
					uni.navigateTo({
						url: "/pages/user/go-login"
					})
					// #endif
					return
				}
				this.ticketPupop = true
			},
			voteSubmit() {
				let voteDate = [];
				this.postDetail.voteInfo.options.forEach(item => {
					if (item.checked) {
						voteDate.push(item.id);
					}
				});
				this.$H
					.post('post/vote/userVote', {
						// id: this.postDetail.id,
						id: this.postDetail.id,
						voteOptionId: voteDate[0]
					})
					.then(res => {
						if (res.code == 0) {
							this.getPostDetail();
							uni.showToast({
								title: "投票成功",
								icon: "none",
								duration: 2000,
							});
						}
					});
			},
			castVote(index, type) {
				if (!this.postDetail.isVoteResult && !this.isVoteExpire) {
					if (type === 1) {
						this.postDetail.voteInfo.options.forEach(item => {
							this.$set(item, 'checked', false);
						});
					}
					let checked = this.postDetail.voteInfo.options[index].checked;
					if (checked) {
						this.$set(this.postDetail.voteInfo.options[index], 'checked', false);
					} else {
						this.$set(this.postDetail.voteInfo.options[index], 'checked', true);
					}
				}
			},
			closeShare() {
				this.showShare = false
			},
			copyPageUrl() {
				let that = this;
				uni.setClipboardData({
					data: this.$c.shareH5Url + 'pages/post/detail?id=' + this.postId,
					success: function() {
						uni.hideToast();
						that.$f.toast('链接复制成功', 'none');
						that.showShare = false;
					}
				});
			},
			// 长按 删除评论
			delComment(e, index, index2) {
				let that = this;
				let user = uni.getStorageSync('userInfo');
				//如果是子评论需要遍历子评论查询是否存在自己回复的评论消息
				var flag = false; //这个用来确定父评论下是否存在用户自己的子评论
				var i = 0; //这个用来锁定子评论楼层位置
				e.children.map((item) => {
					if (item.uid == user.uid) {
						flag = true;
						e.id = item.id;
						if (index2) {
							index2 = i;
						}
					}
					i++;
				});

				if (e.uid != user.uid) {
					if (!flag) {
						return;
					}
				}
				uni.showModal({
					title: '提示',
					content: '确定删除自己的评论嘛？',
					success: function(res) {
						if (res.confirm) {
							that.$H
								.post('comment/del', {
									id: e.id
								})
								.then(res2 => {
									if (res2.code == 0) {
										if (index2 || index2 === 0) {
											that.commentList[index].children.splice(index2, 1);
										} else {
											that.commentList.splice(index, 1);
										}
									}
								});
						}
					}
				});
			},
			onCopy() {

				this.$f.copy(this.postDetail.content);
			},
			// 保存海报到相册
			saveImg() {
				// #ifdef MP-WEIXIN
				uni.getImageInfo({
					src: this.posterUrl,
					success: function(image) {
						uni.saveImageToPhotosAlbum({
							filePath: image.path,
							success: function() {
								uni.showToast({
									title: '图片保存成功'
								});
							},
							fail: function() {
								uni.showModal({
									title: '图片保存失败',
									content: '请确认是否已开启授权',
									confirmText: '开启授权',
									success(res) {
										if (res.confirm) {
											uni.openSetting({
												success(settingdata) {
													if (settingdata.authSetting[
															"scope.writePhotosAlbum"
														]) {
														uni.showToast({
															title: '授权成功，请重试哦~',
															icon: "none"
														});
													} else {
														uni.showToast({
															title: '请确定已打开保存权限',
															icon: "none"
														});
													}
												}
											})
										}
									}
								})
							},
						});
					},
					fail() {}
				});
				// #endif
				// #ifdef H5
				var oA = document.createElement('a');
				oA.download = ''; // 设置下载的文件名，默认是’下载’
				oA.href = this.posterUrl;
				document.body.appendChild(oA);
				oA.click();
				oA.remove(); // 下载之后把创建的元素删除
				// #endif
			},
			// 生成分享海报
			shareCanvas() {
				this.showCanvas = true;
				uni.showLoading({
					mask: true,
					title: '正在生成海报'
				});
				// #ifdef H5
				let origin = "h5";
				let url = this.$c.shareH5Url + "pages/post/detail?id=" + this.postId
				// #endif
				// #ifdef MP-WEIXIN
				let origin = "weixin";
				let url = "pages/post/detail?id=" + this.postId
				// #endif
				this.$H
					.get('post/qrCode', {
						postId: this.postId,
						origin: origin,
						url: url
					})
					.then(res => {
						if (res.code == 0) {
							this.posterUrl = res.result
						} else {
							this.showCanvas = false;
						}
						uni.hideLoading();
					});



			},
			toDiscuss(id) {
				uni.navigateTo({
					url: '/pages/discuss/detail?id=' + id
				});
			},

			openLocation() {
				uni.openLocation({
					address: this.postDetail.address,
					latitude: parseFloat(this.postDetail.latitude),
					longitude: parseFloat(this.postDetail.longitude),
					success: () => {
						console.log('success');
					}
				});
			},
			// 点赞
			onThumbs(id, index, index2) {
				this.$H
					.post('comment/thumbs', {
						id: id
					})
					.then(res => {
						if (res.code == 0) {
							if (index2 || index2 == 0) {
								this.commentList[index].children[index2].isThumbs = true;
								this.commentList[index].children[index2].thumbs++;
							} else {
								this.commentList[index].isThumbs = true;
								this.commentList[index].thumbs++;
							}
						}
					});
			},
			// 取消点赞
			cancelThumbs(id, index, index2) {
				this.$H
					.post('comment/cancelThumbs', {
						id: id
					})
					.then(res => {
						if (res.code == 0) {
							if (index2 || index2 == 0) {
								this.commentList[index].children[index2].isThumbs = false;
								this.commentList[index].children[index2].thumbs--;
							} else {
								this.commentList[index].isThumbs = false;
								this.commentList[index].thumbs--;
							}
						}
					});
			},
			// 回复评论
			onReply(e) {
				this.placeholder = '回复：' + e.userInfo.username;
				this.commentTitle = '回复：' + e.userInfo.username;
				this.focus = true;
				this.showComment = true
				let pid = e.pid;
				if (pid === 0) {
					this.form.pid = e.id;
				} else {
					this.form.pid = e.pid;
				}
				this.form.toUid = e.userInfo.uid;
				this.form.postId = this.postId;
			},
			// 输入框失去焦点时
			onBlur() {
				this.placeholder = '留下你的精彩评论...';
				this.focus = false;
				// #ifdef MP
				this.form.pid = 0;
				// #endif
			},
			// 获取评论列表
			getCommentList() {
				this.loadStatus = 'loading';
				this.$H
					.get('comment/list', {
						postId: this.postId,
						page: this.page
					})
					.then(res => {
						if (res.code == 0) {
							this.commentList = this.commentList.concat(res.result.data);

							if (res.result.current_page >= res.result.total || res.result.last_page === 0) {
								this.loadStatus = 'nomore';
							} else {
								this.loadStatus = 'loadmore';
							}
						}
					});
			},
			jumpUser(uid) {
				uni.navigateTo({
					url: '/pages/user/home?uid=' + uid
				});
			},
			addComment() {
				this.isSubmitD = true;
				if (this.form.content == '') {
					this.$u.toast('评论不能为空');
					this.isSubmitD = false;
					return;
				}
				uni.showLoading({
					mask: true,
					title: '发布中'
				});
				this.$H.post('post/addComment', this.form).then(res => {
					uni.hideLoading();
					if (res.code == 0) {
						if (res.check) {
							uni.showModal({
								title: '提示',
								content: '评论审核通过后发布哦，请耐心等待',
								showCancel: false,
								success: function(res) {
									if (res.confirm) {}
								}
							});
						} else {
							this.$u.toast('评论成功');
							this.postDetail.commentCount += 1
						}
						this.form.content = '';
						this.page = 1;
						this.commentList = [];
						this.form.pid = 0;
						this.getCommentList();
					} else if (res.code == 500) {
						this.$u.toast(res.msg);
					}
					this.isSubmitD = false;
					this.showComment = false
				});
			},
			getPostDetail() {
				this.$loading(true);
				this.$H
					.get('home/picture/details', {
						pictureTypeId: this.pictureTypeId,
						period: this.period,
						year: this.year
					})
					.then(res => {
						if (res.code == 500) {
							uni.hideLoading();
							this.$u.toast(res.msg);
							this.$loading(false);
							setTimeout(function() {
								uni.switchTab({
									url: '/pages/home/home'
								});
							}, 1500);
						} else {
							if (!this.year) {
								this.year = res.data.yearList[0]
							}
							if (!this.period) {
								this.period = res.data.periodList[0]
							}
							// console.log(res.data.postDetail.id)
							if(res.data.lotteryVO) {
								this.numberList = res.data.lotteryVO.numberList
							}else {
								this.numberList = []
							}
							this.postId = res.data.postDetail.id;
							this.form.postId = this.postId;
							this.postDetail = res.data.postDetail;
							this.getCommentList();
							let ticketSum = 0
							this.postDetail.voteInfo.options.forEach(item => {
								item.progress = 0
								const ticketNum = item.ticketNum || 0
								ticketSum += ticketNum
							});
							if (ticketSum) {
								this.postDetail.voteInfo.options.forEach(item => {
									item.progress = Number((item.ticketNum / ticketSum * 100).toFixed(2))
								});
							}
							this.yearList = res.data.yearList
							this.periodList = res.data.periodList.map(item => {
								return {
									value: item,
									label: '第' + item + '期'
								}
							})
							//修改链接
							this.postDetail.content = this.$f.formatText(res.data.postDetail.content)
							if (res.data.postDetail.showType) {
								this.showType = res.data.postDetail.showType;
							}
							this.rewardBtn = res.data.postDetail.rewardBtn;
							//这里一定要再判断是否为长文
							// if (res.data.postDetail.type == 3) {
							// 	uni.redirectTo({
							// 		url: '/subpages/content/article/article?id=' + this.postId
							// 	})

							// }
							// if (res.data.postDetail.type == 2) {
							// 	var res = this.$f.decryptUrl(res.data.postDetail.media[0]);
							// 	var list = JSON.parse(res)
							// 	this.postDetail.media[0] = list[0]
							// }
							this.$loading(false);
							// 投票帖子
							if (res.data.postDetail.voteId && res.data.postDetail.voteId > 0) {
								res.data.postDetail.voteInfo.options.forEach(item => {
									this.$set(item, 'checked', false);
								});
								let timestamp = Date.parse(new Date()) / 1000;
								if (res.data.postDetail.voteInfo.expireTime < timestamp) {
									this.isVoteExpire = true;
								}
							}

						}

					});
			},
			cancelCollection() {
				this.$H
					.post('post/cancelCollection', {
						id: this.postId
					})
					.then(res => {
						if (res.code === 0) {
							this.postDetail.isCollection = false;
							this.postDetail.collectionCount--;
						}
					});
			},
			addCollection() {
				this.$H
					.post('post/addCollection', {
						id: this.postId,
						uid: this.postDetail.uid
					})
					.then(res => {
						if (res.code === 0) {
							this.postDetail.isCollection = true;
							this.postDetail.collectionCount++;
						}
					});
			},
			addThumb() {
				this.$H
					.post('post/addThumb', {
						id: this.postId
					})
					.then(res => {
						if (res.code === 0) {
							this.postDetail.isThumb = true;
						}
					});
			},
			cancelThumb() {
				this.$H
					.post('post/cancelThumb', {
						id: this.postId,
						uid: this.postDetail.uid
					})
					.then(res => {
						if (res.code === 0) {
							this.postDetail.isThumb = false;
						}
					});
			},
			follow() {
				this.$H
					.post('user/addFollow', {
						id: this.postDetail.uid
					})
					.then(res => {
						if (res.code === 0) {
							this.postDetail.isFollow = true;
						} else {
							this.$refs.uToast.show({
								title: res.msg,
								type: 'error'
							});
						}
					});
			},
			cancelFollow() {
				this.$H
					.post('user/cancelFollow', {
						id: this.postDetail.uid
					})
					.then(res => {
						if (res.code === 0) {
							this.postDetail.isFollow = false;
						}
					});
			},
			previewImage(e) {
				uni.previewImage({
					current: e.currentTarget.dataset.current, // 当前显示图片的http链接
					urls: e.currentTarget.dataset.image // 需要预览的图片http链接列表
				});
			},
			showImage(index) {
				uni.previewImage({
					current: this.postDetail.media[index], // 当前显示图片的http链接
					urls: this.postDetail.media // 需要预览的图片http链接列表
				});
			},
			isInteger(obj) {
				return obj % 1 === 0;
			},
			changeRewardSelect(value) {
				// console.log(value.currentTarget.dataset.price)
				this.rewardCount = value.currentTarget.dataset.price
			},
			rewardChange(value) {
				this.rewardCount = value.detail.value
			},
			openRewardBtn() {
				this.showReward = true
				this.rewardCount = ''
			},
			//打赏
			submitReward() {
				if (!uni.getStorageSync('hasLogin')) {
					this.$u.toast("请先登录");
					this.$f.jump('/pages/user/go-login')
					return;
				}
				if (this.rewardCount < 0) {
					this.$u.toast("输入数值违法");
					return;
				}
				if (!this.isInteger(this.rewardCount)) {
					this.$u.toast('必须为整数');
					return;
				}
				this.showReward = false
				var that = this;
				uni.showModal({
					title: '提醒',
					content: '打赏后不可撤回，你确定给该帖子作者打赏' + that.rewardCount + '积分吗',
					success: function(res) {
						if (res.confirm) {
							that.$H.post('bill/reward', {
									rewardCount: that.rewardCount,
									postId: that.postId,
								})
								.then(res => {
									if (res.code == 0) {
										that.showReward = false
										that.$u.toast('打赏成功');
									}
								});
						}
					}
				});
			},
			yearChange(index, item) {
				this.yearIndex = index
				this.year = item
				this.getPostDetail()
			},
			periodChange(index, item) {
				this.periodIndex = index
				this.period = item.value
				this.periodSelectTitle = item.label
				this.getPostDetail()
			},
			goHistory() {
				uni.navigateTo({
					url: '/pages/lottery-history/lottery-history'
				})
			},
			goBack() {
				uni.navigateBack({
					delta: 1
				});
			},
			// 轮播
			getBanner() {
				this.$H.post('link/list', {
						cateId: 0,
						page: 1,
					})
					.then(res => {
						if (res.code == "0") {
							this.listWheelAdvert = res.result
						}
					});
			},
			goUrl(item) {
				if (item.url) {
					uni.navigateTo({
						url: item.url
					})
				}
			},
			commentClose() {
				this.placeholder = '留下你的精彩评论...';
				this.commentTitle = '发布评论';
				this.showComment = false
				this.focus = false;
				// #ifdef MP
				this.form.pid = 0;
				// #endif
			},
			goAdd() {
				const item = {
					title: '发布(发现帖)',
					relateType: 0
				}
				uni.navigateTo({
					url: '/subpages/content/article/add?item=' + encodeURIComponent(JSON.stringify(item))
				})
			},
		}
	};
</script>

<style lang="scss" scoped>
	.index-con {
		background-color: white;
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
		position: relative;

		.right {
			display: flex;
			position: absolute;
			right: 15rpx;

			.right-box {
				display: flex;
				flex-direction: column;
				align-items: center;
				color: #07c106;
				font-size: 24rpx;
				margin-right: 15rpx;
			}
		}
	}

	.comment-body {
		width: 600rpx;
		padding: 30rpx;

		.title {
			text-align: center;
		}

		.contant {
			margin-top: 12rpx;
		}
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

	.post-title {
		margin: 20rpx 0;
		font-size: 36rpx;
		font-weight: 600;
	}

	.info-box {
		padding: 20rpx;
		background-color: #ffffff;
	}

	.icon text {
		font-size: 12px;
		color: #999;
		margin-right: 20rpx;
	}

	.detail-tag,
	.post-address {
		display: flex;
		align-items: center;
		padding: 12rpx 0;
	}

	.post-address>view,
	.detail-tag>view {
		display: flex;
		align-items: center;
		height: 56rpx;
		line-height: 56rpx;
		border-radius: 56rpx;
		background: #eff2f3;
		padding: 0 24rpx 0 12rpx;
		margin-right: 16rpx;
	}

	.post-address>view view,
	.detail-tag>view view {
		margin-left: 8rpx;
		font-size: 26rpx;
		font-weight: 400;
	}

	.post-address image,
	.detail-tag image {
		height: 44rpx;
		width: 44rpx;
	}

	/*关注*/

	.user-item-0 {
		display: flex;

		.user-item-user {

			.diyTag {
				display: flex;
				align-items: center;

				.user-name {
					font-size: 36rpx;
				}

				.image3 {
					width: 75rpx;
					height: 30rpx;
					margin-left: 5rpx;
				}
			}

			flex: 1;

			.postIntro {
				font-size: 12px;
				color: #999;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				overflow: hidden;
			}
		}

		.avatar-z {
			width: 80rpx;
			height: 80rpx;
			float: left;
			margin-right: 10rpx;
			border-radius: 50%;
			margin-top: 10rpx;
		}
	}

	.user-item-1 {
		display: flex;
		border-radius: 30rpx;
		background-color: #fafbfc;
		padding: 20rpx;

		.user-item-user {

			.diyTag {
				display: flex;
				align-items: center;

				.user-name {
					font-size: 36rpx;
				}

				.image3 {
					width: 75rpx;
					height: 30rpx;
					margin-left: 5rpx;
				}
			}

			flex: 1;

			.postIntro {
				font-size: 12px;
				color: #999;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				overflow: hidden;
			}
		}

		.avatar-z {
			width: 80rpx;
			height: 80rpx;
			float: left;
			margin-right: 10rpx;
			border-radius: 50%;
			margin-top: 10rpx;
		}
	}

	.followStyle {
		width: 120rpx;
		height: 50rpx;
		border: 1px solid #F3F2F2;
		border-radius: 50rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 26rpx;
		background-color: #333;
		color: #F3F2F2;
	}

	.followStyle1 {
		width: 100rpx;
		height: 50rpx;
		border: 1px solid #F3F2F2;
		border-radius: 50rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 26rpx;
		color: #9F9E9F;
	}

	/*底部操作*/
	.p-footer {
		display: flex;
		font-size: 24rpx;
		color: #616161;
		bottom: 0;
		align-items: center;
		background-color: white;

		.p-item {
			width: 80rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			margin-left: 7rpx;

			.iconfont {
				font-size: 30rpx;
				line-height: normal;
			}

			// &:nth-child(2) {
			// 	// margin: 0 auto;
			// }

			// .iconfont {
			// 	margin-right: 10rpx;
			// }
		}
	}

	/*评论列表*/
	.comment-box {
		background-color: #ffffff;
		margin-top: 20rpx;
		padding: 20rpx;
	}

	.comment-box>.title {
		margin-bottom: 20rpx;
	}

	.comment-item {
		display: flex;
		padding: 20rpx;

		&:active {
			background-color: #F5F5F5;
		}

		.c-content {
			display: flex;
			flex-direction: column;
			flex: 1;

			.time {
				color: #999;
				font-size: 10px;
			}

			.user {
				display: flex;

				.official {
					color: #fff;
					font-size: 21rpx;
					text-align: center;
					width: 50rpx;
					min-width: 50rpx;
					height: 30rpx;
					min-height: 30rpx;
					line-height: 30rpx;
					border-radius: 4rpx;
					background-image: linear-gradient(to right, #e67577, #e5cad1);
					margin-left: 6rpx;
					margin-top: 20rpx;
				}


				.thumbs {
					margin-left: auto;
					display: flex;
					align-items: center;
					color: #bfbfbf;

					.num {
						margin-right: 10rpx;
					}
				}
			}
		}

		.avatar {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
			margin-right: 20rpx;
		}
	}

	.sub-comment-item {
		margin-left: 100rpx;
		padding: 20rpx;
		background-color: #F3F2F2;

		&:active {
			background-color: #F5F5F5;
		}

		.user {
			display: flex;
			align-items: center;

			.name {
				color: #616161;
			}

			.avatar {
				margin-right: 10rpx;
			}

			.u-head {
				flex: 1;
				display: flex;

				.official {
					color: #fff;
					font-size: 21rpx;
					text-align: center;
					width: 50rpx;
					min-width: 50rpx;
					height: 30rpx;
					min-height: 30rpx;
					line-height: 30rpx;
					border-radius: 4rpx;
					background-image: linear-gradient(to right, #e67577, #e5cad1);
					margin-left: 6rpx;
					margin-top: 20rpx;
				}

				.thumbs {
					margin-left: auto;
					display: flex;
					align-items: center;
					color: #bfbfbf;

					.num {
						margin-right: 10rpx;
					}
				}
			}
		}

		.reply {
			.time {
				margin-left: auto;
				font-size: 20rpx;
				color: #999;
			}

			.name {
				display: inline-block;
				color: #55aaff;
				font-weight: 600;
			}
		}
	}

	/* 评论tool */
	/* #ifdef H5 || MP-WEIXIN */
	.comment-tool {
		position: fixed;
		bottom: 0;
		width: 100%;
		background-color: #fff;
		padding: 20rpx;
		display: flex;
		justify-content: space-between;
		z-index: 999;
	}

	.comment-tool textarea {
		background-color: #f5f5f5;
		padding: 20rpx;
		border-radius: 10rpx;
		min-height: 40rpx;
	}

	.comment-tool .u-btn {
		margin-left: 10rpx;
	}

	/* #endif */
	/* #ifdef APP-PLUS */
	.comment-tool {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: #F5F5F5;
		padding-left: 20rpx;
		height: 110rpx;
		display: flex;
		z-index: 999;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.comment-tool textarea {
		background-color: #f5f5f5;
		padding: 10rpx;
		border-radius: 10rpx;
		min-height: 70rpx;
	}

	.comment-tool .u-btn {
		margin-left: 10rpx;
	}

	/* #endif */
	/*文章图片*/
	.img-style-1 {
		display: block;
		width: 100%;
		border-radius: 5px;
	}

	.img-style-2 {
		display: flex;
	}

	.img-style-2 image {
		margin: 5rpx;
		border-radius: 5px;
		width: 100%;
		height: 294rpx;
	}

	.img-style-3 {
		display: flex;
		flex-wrap: wrap;
	}

	.img-style-3 image {
		width: 31.3%;
		height: 200rpx;
		margin: 1%;
		border-radius: 5px;
	}

	.img-style-4 {
		display: flex;
		flex-wrap: wrap;
	}

	.img-style-4 image {
		width: 48%;
		height: 320rpx;
		margin: 0.5%;
	}

	// 圈子信息
	.topic-info {
		display: flex;
		align-items: center;
		font-size: 24rpx;
		background-color: #F1F3F5;
		margin: 20rpx 0;
		padding: 24rpx;
		border-radius: 12rpx;

		.cover {
			width: 100rpx;
			height: 100rpx;
			margin-right: 20rpx;
		}

		.center {
			flex: 1;

			.count-txt {
				color: #999;
			}
		}

		.right {
			margin-left: 20rpx;
			color: #55aaff;
		}
	}

	// 分享弹窗
	.share-wrap {
		display: flex;
		padding: 30rpx;
		width: 45%;
		margin: 0 auto;

		.share-item {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			&:nth-child(1) {
				margin-right: auto;
			}

			image {
				width: 100rpx;
				height: 100rpx;
			}

			text {
				font-size: 24rpx;
				margin-top: 20rpx;
			}
		}

		.share-item2 {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			&:nth-child(1) {
				margin: auto;
			}

			image {
				width: 100rpx;
				height: 100rpx;
			}

			text {
				font-size: 24rpx;
				margin-top: 20rpx;
			}
		}
	}

	//海报弹窗
	.share-box {
		height: 530px;
		position: relative;

		.images {
			width: 100%;
			height: 100%;
		}

	}

	.footer {
		// position: absolute;
		bottom: 20rpx;
		left: 20rpx;
		right: 20rpx;
	}

	// 投票
	.vote-box {
		width: 100%;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		margin-top: 20rpx;

		.title {}

		.expire-time {
			font-size: 24rpx;
		}

		.vote-item {
			width: 48%;
			flex-direction: row;
			justify-content: space-between;
			font-size: 26rpx;
			padding: 10rpx;
			text-align: center;
			margin-bottom: 20rpx;

			&:last-child {
				margin-bottom: 0;
			}

			.vote-item-box {
				display: flex;
				align-items: center;
			}
		}

		.active {
			background-color: #333;
			color: #fff;
		}

		.btn {
			width: 400rpx;
			height: 70rpx;
			line-height: 70rpx;
			border-radius: 50rpx;
			font-size: 32rpx;
			background-color: #07c106;
			text-align: center;
			color: white;
		}
	}

	.expire-box {
		background-color: #999;
		color: #fff;
		font-size: 24rpx;
		display: inline-block;
		padding: 0 20rpx;
		border-radius: 10rpx;
		margin-bottom: 20rpx;
	}

	video {
		width: 100%;
	}

	.post-text {
		white-space: pre-wrap;
	}

	.other-img-flex {
		display: flex;
		align-items: center;
		position: relative;
		margin: 10rpx 0;
		width: 674rpx;

		.wrap-style .show-flex {
			width: 100%;
			height: 100%;
		}
	}

	.two-img {
		justify-content: space-between;
		align-items: center;
	}

	.two-img .wrap-style-1,
	.two-img .wrap-style-2 {
		height: 332rpx;
		width: 332rpx;
	}

	.two-img .wrap-style-1 .show-flex {
		border-radius: 12rpx 0 0 12rpx;
	}

	.two-img .wrap-style-2 .show-flex {
		border-radius: 0 12rpx 12rpx 0;
	}

	.three-img {
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.three-img .wrap-style-1,
	.three-img .wrap-style-2,
	.three-img .wrap-style-3 {
		height: 332rpx;
		width: 332rpx;
	}

	.three-img .wrap-style-1 {
		height: 446rpx;
		width: 674rpx;
		margin-bottom: 10rpx;
	}

	.three-img .wrap-style-1 .show-flex {
		border-radius: 12rpx 12rpx 0 0;
	}

	.three-img .wrap-style-2 .show-flex {
		border-radius: 0 0 0 12rpx;
	}

	.three-img .wrap-style-3 .show-flex {
		border-radius: 0 0 12rpx 0;
	}

	.four-img {
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.four-img .wrap-style-1,
	.four-img .wrap-style-2,
	.four-img .wrap-style-3,
	.four-img .wrap-style-4 {
		height: 218rpx;
		width: 218rpx;
	}

	.four-img .wrap-style-1 {
		height: 446rpx;
		width: 674rpx;
		margin-bottom: 10rpx;
	}

	.four-img .wrap-style-1 .show-flex {
		border-radius: 12rpx 12rpx 0 0;
	}

	.four-img .wrap-style-2 .show-flex {
		border-radius: 0 0 0 12rpx;
	}

	.four-img .wrap-style-3 .show-flex {
		border-radius: 0 0 12rpx 0;
	}

	.five-img {
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.five-img .wrap-style-1,
	.five-img .wrap-style-2,
	.five-img .wrap-style-3,
	.five-img .wrap-style-4,
	.five-img .wrap-style-5 {
		height: 332rpx;
		width: 332rpx;
	}

	.five-img .wrap-style-1 {
		height: 446rpx;
		width: 446rpx;
		margin-bottom: 10rpx;
	}

	.five-img .wrap-style-2 {
		height: 218rpx;
		width: 218rpx;
		margin-top: -238rpx;
	}

	.five-img .wrap-style-3 {
		height: 218rpx;
		width: 218rpx;
		position: absolute;
		right: 0;
		top: 228rpx;
	}

	.five-img .wrap-style-1 .show-flex {
		border-radius: 12rpx 0 0 0;
	}

	.five-img .wrap-style-2 .show-flex {
		border-radius: 0 12rpx 0 0;
	}

	.five-img .wrap-style-4 .show-flex {
		border-radius: 0 0 0 12rpx;
	}

	.five-img .wrap-style-5 .show-flex {
		border-radius: 0 0 12rpx 0;
	}

	.six-img {
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.six-img .wrap-style-1,
	.six-img .wrap-style-2,
	.six-img .wrap-style-3,
	.six-img .wrap-style-4,
	.six-img .wrap-style-5,
	.six-img .wrap-style-6 {
		height: 218rpx;
		width: 218rpx;
	}

	.six-img .wrap-style-1 {
		height: 446rpx;
		width: 446rpx;
		margin-bottom: 10rpx;
	}

	.six-img .wrap-style-2 {
		margin-top: -238rpx;
	}

	.six-img .wrap-style-3 {
		position: absolute;
		right: 0;
		top: 228rpx;
	}

	.six-img .wrap-style-1 .show-flex {
		border-radius: 12rpx 0 0 0;
	}

	.six-img .wrap-style-2 .show-flex {
		border-radius: 0 12rpx 0 0;
	}

	.six-img .wrap-style-4 .show-flex {
		border-radius: 0 0 0 12rpx;
	}

	.six-img .wrap-style-6 .show-flex {
		border-radius: 0 0 12rpx 0;
	}

	.seven-img {
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.seven-img .wrap-style-1,
	.seven-img .wrap-style-2,
	.seven-img .wrap-style-3,
	.seven-img .wrap-style-4,
	.seven-img .wrap-style-5,
	.seven-img .wrap-style-6,
	.seven-img .wrap-style-7 {
		height: 218rpx;
		width: 218rpx;
		margin-bottom: 10rpx;
	}

	.seven-img .wrap-style-1 {
		height: 446rpx;
		width: 674rpx;
	}

	.seven-img .wrap-style-5,
	.seven-img .wrap-style-6,
	.seven-img .wrap-style-7 {
		margin: 0;
	}

	.seven-img .wrap-style-1 .show-flex {
		border-radius: 12rpx 12rpx 0 0;
	}

	.seven-img .wrap-style-5 .show-flex {
		border-radius: 0 0 0 12rpx;
	}

	.seven-img .wrap-style-7 .show-flex {
		border-radius: 0 0 12rpx 0;
	}

	.eight-img {
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.eight-img .wrap-style-1,
	.eight-img .wrap-style-2,
	.eight-img .wrap-style-3,
	.eight-img .wrap-style-4,
	.eight-img .wrap-style-5,
	.eight-img .wrap-style-6,
	.eight-img .wrap-style-7,
	.eight-img .wrap-style-8 {
		height: 218rpx;
		width: 218rpx;
		margin-bottom: 10rpx;
	}

	.eight-img .wrap-style-6,
	.eight-img .wrap-style-7,
	.eight-img .wrap-style-8 {
		margin: 0;
	}

	.eight-img .wrap-style-1,
	.eight-img .wrap-style-2 {
		height: 332rpx;
		width: 332rpx;
	}

	.eight-img .wrap-style-1 .show-flex {
		border-radius: 12rpx 0 0 0;
	}

	.eight-img .wrap-style-2 .show-flex {
		border-radius: 0 12rpx 0 0;
	}

	.eight-img .wrap-style-6 .show-flex {
		border-radius: 0 0 0 12rpx;
	}

	.eight-img .wrap-style-8 .show-flex {
		border-radius: 0 0 12rpx 0;
	}

	.nine-img {
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.nine-img .wrap-style-1,
	.nine-img .wrap-style-2,
	.nine-img .wrap-style-3,
	.nine-img .wrap-style-4,
	.nine-img .wrap-style-5,
	.nine-img .wrap-style-6,
	.nine-img .wrap-style-7,
	.nine-img .wrap-style-8,
	.nine-img .wrap-style-9 {
		height: 218rpx;
		width: 218rpx;
		margin-bottom: 10rpx;
	}

	.nine-img .wrap-style-7,
	.nine-img .wrap-style-8,
	.nine-img .wrap-style-9 {
		margin: 0;
	}

	.nine-img .wrap-style-1 .show-flex {
		border-radius: 12rpx 0 0 0;
	}

	.nine-img .wrap-style-3 .show-flex {
		border-radius: 0 12rpx 0 0;
	}

	.nine-img .wrap-style-7 .show-flex {
		border-radius: 0 0 0 12rpx;
	}

	.nine-img .wrap-style-9 .show-flex {
		border-radius: 0 0 12rpx 0;
	}

	.year-body {
		width: 100%;
		padding: 8rpx 0;
		background-color: white;
		margin-bottom: 14rpx;
		// border-bottom: 1px solid #f5f5f5;
		padding: 0 20rpx;
		.scroll-view_H {
			white-space: nowrap;
			width: 100%;
		}

		.scroll-view-tab {
			display: inline-block;
			width: 15%;
			margin-right: 24rpx;

			.text {
				text-align: center;
				border: 1px solid #666;
				font-size: 26rpx;
				border-radius: 50rpx;
			}

			.text-active {
				text-align: center;
				border: 1px solid #07c106;
				font-size: 26rpx;
				border-radius: 50rpx;
				background-color: #07c106;
				color: white;
			}
		}
	}

	.period-body {
		width: 100%;
		background-color: white;
		display: flex;
		position: relative;
		border-bottom: 1px solid #f5f5f5;
		border-top: 1px solid #f5f5f5;
		padding: 0 20rpx;
		.scroll-view_H {
			white-space: nowrap;
			width: 78%;
		}

		.scroll-view-tab {
			display: inline-block;
			margin-right: 24rpx;

			.text {
				text-align: center;
				font-size: 26rpx;
			}

			.text-active {
				text-align: center;
				font-size: 26rpx;
				color: #07c106;
			}
		}

		.select-box {
			display: flex;
			flex-wrap: wrap;
			// justify-content: center;
			padding: 12rpx 24rpx;

			.select-box-contant {
				margin-right: 10rpx;
				width: 23%;
				font-size: 24rpx;
				border: 1px solid #ddd;
				text-align: center;
				margin-top: 24rpx;
				.text-seclect-active {
					border: 1px solid #07c106;
				}
			}
		}
	}

	.tixing-btn {
		width: 100%;
		display: flex;
		justify-content: center;
		margin-top: 20rpx;

		.tixing {
			display: flex;
			align-items: center;
			color: white;
			padding: 4rpx 28rpx;
			font-size: 28rpx;
			background-image: url('../../static/icon/icon_tixing.png');
			background-size: 100% 100%;
		}
	}

	.triangle-top {
		width: 0;
		height: 0;
		border-top: 10rpx solid white;
		border-right: 10rpx solid transparent;
		border-left: 10rpx solid transparent;
		border-bottom: 10rpx solid transparent;
		margin-top: 20rpx;
	}

	.triangle-bottom {
		width: 0;
		height: 0;
		border-top: 10rpx solid transparent;
		border-right: 10rpx solid transparent;
		border-left: 10rpx solid transparent;
		border-bottom: 10rpx solid white;
	}


	::v-deep .u-dropdown {
		position: static;

	}

	.u-dropdown ::v-deep .u-flex {
		width: max-content;
		background-color: #07c106;
		color: white !important;
		border-radius: 50rpx;
	}
	::v-deep .u-dropdown__content {
		top: 54rpx !important;
	}
	::v-deep .u-dropdown__menu {
		height: 60rpx !important;
	}
	::v-deep .u-dropdown__menu__item {
		width: 200rpx !important;
	}
	::v-deep .u-dropdown__menu__item__text {
		color: white !important;
		font-size: 24rpx !important;
		padding-left: 4rpx;
	}

	::v-deep .uicon-arrow-down {
		color: white !important;
		font-size: 24rpx !important;
	}

	.ticket-popup {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		width: 650rpx;

		.vote-item {
			width: 20%;
			display: flex;
			flex-direction: column;
			margin-right: 24rpx;
			border: 1px solid #ddd;
			text-align: center;
			font-size: 28rpx;
			margin-top: 24rpx;
		}

		:nth-last-child() {
			margin-right: 0
		}

		.active {
			background-color: #07c106;
			color: white;
		}
	}


	.bottom-btn {
		width: 100%;
		text-align: center;
		height: 70px;
		line-height: 70px;
		font-size: 32rpx;
		color: #07c106;
	}

	.popup-title {
		text-align: center;
		padding: 24rpx 0;
	}

	.banner {
		margin-top: 105rpx;
	}
	.lottery {
		width: 100%;
		display: flex;
		justify-content: center;
		margin-top: 24rpx;
		padding: 0 20rpx;
	}
	.kuang_bg {
		width: 100%;
		// padding: 15rpx;
		padding-bottom: 15rpx;
		background-image: url("../../static/images/kuang_kuang.png");
		background-size: 100% 100%;
		text-align: center;
		.kuang_bg_top {
			color: #07c106;
			font-size: 26rpx;
			font-weight: bold;
		}
		.platform_data {
			width: 100%;
			display: flex;
			padding: 0 12rpx;
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
	}
</style>