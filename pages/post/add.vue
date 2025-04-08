<template>
	<view class="container">
		<h-tips content="请遵守社区规定,文明发帖共创和谐健康的社区环境"></h-tips>

		<view class="one-line" style="margin-top: 38rpx;">
			<view class="top">
				<view class="title">
					标题
				</view>
				<view class="num">
					{{form.title.length}}/20
				</view>
			</view>
			<view class="content">
				<input class="txt" type="text" placeholder="起个标题叭~" maxlength="20" v-model="form.title">
			</view>
			<u-line margin="25rpx 0 0 0" length="690rpx" color="#F6F6F6"></u-line>
		</view>
		<u-line color="#c8c8c8"></u-line>
		<!-- 付费可见简介 -->
		<view class="one-line" style="margin-top: 38rpx;" v-if="form.cut==1">
			<view class="top">
				<view class="title">
					付费简介
				</view>
				<view class="num">
					{{form.brief.length}}/250
				</view>
			</view>
			<view class="content">
				<textarea placeholder="简介用于介绍付费内容,对用户可见. 内容部分用户付费后可见" class="txt input-text post-txt" maxlength="250" :auto-height="true"
					v-model="form.brief"></textarea>
			</view>
			<u-line length="690rpx" color="#F6F6F6" margin="20rpx 0 32rpx 0"></u-line>
		</view>
		<!-- 内容 -->
		<view class="one-line" style="margin-top: 38rpx;">
			<view class="top">
				<view class="title">
					内容
				</view>
				<view class="num">
					{{form.content.length}}/400
				</view>
			</view>
			<view class="content">
				<textarea placeholder="说些什么叭..." class="txt input-text post-txt" maxlength="1000" :auto-height="true"
					v-model="form.content"></textarea>
			</view>
			<u-line length="690rpx" color="#F6F6F6" margin="20rpx 0 32rpx 0"></u-line>
		</view>
		<!-- 上传图片 -->
		<view v-if="form.type == 1" style="transform: translateX(-10rpx);">
			<u-upload ref="uUpload" :size-type="['original']" name="Image" :max-count="9" :header="header"
				:action="uploadImgUrl" @on-uploaded="submit" :auto-upload="false" :custom-btn="true">
				<view slot="addBtn" class="slot-btn">
					<u-icon name="plus" size="40" color="#6f6f6f"></u-icon>
					<view class="slot-txt">
						上传图片
					</view>
				</view>
			</u-upload>
			<u-line length="690rpx" color="#F6F6F6" margin="30rpx 0 33rpx 0"></u-line>
		</view>
		<!-- 上传视频 -->
		<block v-if="form.type == 2">
			<view v-if="form.media.length == 0" class="upload-wrap" @click="chooseVideo">
				<image class="icon" src="/static/video.png"></image>
				<text>上传视频</text>
			</view>
			<video v-if="form.media.length > 0" @click="chooseVideo" :controls="false" :show-center-play-btn="false"
				class="upload-video" :src="form.media[0]"></video>
		</block>
		<!-- 选择圈子 -->
		<navigator v-if="isTopic" url="/pages/topic/choose-topic/choose-topic" class="choose-item">
			<image class="icon" src="/static/p_1.png"></image>
			<text class="txt">{{ topicName }}</text>
			<u-icon class="u-icon" name="arrow-right"></u-icon>
		</navigator>
		<!-- 选择话题 -->
		<navigator v-if="form.topicId" :url="'/pages/discuss/choose-discuss/choose-discuss?topicId=' + form.topicId"
			class="choose-item">
			<image class="icon" src="/static/m_1.png"></image>
			<text class="txt">{{ disName }}</text>
			<u-icon class="u-icon" name="arrow-right"></u-icon>
		</navigator>
		<!-- 帖子类型 -->
		<view class="choose-item" v-if="payPostBtn">
			<image class="icon" src="/static/m_3.png"></image>
			<text class="txt">{{typeName}}</text>
			<u-radio-group class="radio" v-model="radiovalue1" placement="row" @change="groupChange">
				<u-radio v-for="(item, index) in radiolist1" :key="index" :label="item.name" :name="item.name"
					active-color="#333333" @change="radioChange">
				</u-radio>
			</u-radio-group>
		</view>
		<!-- 付费贴价格 -->
		<view class="choose-item" v-if="form.cut==1">
			<image class="icon" src="/static/price.png"></image>
			<text class="txt">付费贴单价</text>
			<u-input class="inputStyle" placeholder="查看详情内容需支付金额" border="surround" type="digit" clearable
				v-model="form.pay" @change="inputChange"></u-input>
		</view>
		<!-- 所在位置 -->
		<view @click="chooseLocation" class="choose-item" style="margin-bottom: 60rpx;">
			<u-icon class="icon add-icon" name="map" color="#999" size="40"></u-icon>
			<text class="txt">{{ form.address || '所在位置' }}</text>
			<u-icon class="u-icon" name="arrow-right"></u-icon>
		</view>
		<!-- 发布按钮 -->
		<view class="release-btn">
			<view class="btn" v-if="form.type == 1" @click="uploadImg">
				发布
			</view>
			<view class="btn" v-if="form.type == 2" @click="videoSubmit">
				发布
			</view>
		</view>
	</view>
</template>

<script>
	import hTips from '@/components/h-tips/h-tips.vue'
	export default {
		data() {
			return {
				uploadImgUrl: this.$c.domain + 'common/upload',
				topicName: '选择圈子',
				disName: '选择话题',
				typeName: '普通贴',
				form: {
					title: '',
					type: 1,
					topicId: '',
					discussId: '',
					content: '',
					media: [],
					longitude: 0,
					latitude: 0,
					address: '',
					cut: 0,
					pay: '',
					brief: ''
				},
				header: {
					token: uni.getStorageSync('token')
				},
				isTopic: true,
				switch2: 0,

				radiolist1: [{
						name: '普通贴',
						disabled: false
					},
					{
						name: '付费贴',
						disabled: false
					}
				],
				radiovalue1: '普通贴',
				payPostBtn: false,
			};
		},
		components: {
			hTips
		},
		onLoad(options) {
			this.form.type = options.type;
			if (options.type == 2) {
				this.checkVideoOpen()
			}
			this.checkPayPostBtn()
			if (options.isTopic) {
				this.isTopic = options.isTopic;
			}

			if (options.topicId) {
				this.form.topicId = options.topicId;
				this.isTopic = false;
			}
			if (options.discussId) {
				this.form.discussId = options.discussId;
				this.disName = options.disName
			}

			let location = uni.getStorageSync('location_info');
			this.form.longitude = location.longitude;
			this.form.latitude = location.latitude;
		},
		onShow() {
			if(!uni.getStorageSync('hasLogin')){
				uni.navigateTo({
					url:"/pages/user/go-login"
				})
			}
		},
		methods: {
			checkVideoOpen() {
				this.$H.get('user/isOpen').then(res => {
					if (res.result == 0) {
						this.$f.toast("视频模块未开启")
						setTimeout(function() {
							uni.switchTab({
								url: '/pages/index/index'
							});
						}, 1500);
					}
				});
			},
			inputChange(n) {},
			groupChange(n) {},
			radioChange(n) {

				if (n == '普通贴') {
					this.form.cut = 0;
					this.typeName = '普通贴';
				} else if (n == '付费贴') {
					this.form.cut = 1;
					this.typeName = '付费贴';
				}
			},
			chooseVideo() {
				var self = this;
				uni.chooseVideo({
					count: 1,
					sourceType: ['camera', 'album'],
					success: function(res) {
						let viedoPath = res.tempFilePath;

						uni.showLoading({
							mask: true,
							title: '上传中'
						});

						uni.uploadFile({
							url: self.$c.domain + 'common/upload',
							filePath: viedoPath,
							name: 'Image',
							header: {
								token: uni.getStorageSync('token')
							},
							success: uploadFileRes => {
								let upData = JSON.parse(uploadFileRes.data);
								if (upData.code == 0) {
									self.form.media.push(upData.result);
								}
							},
							complete() {
								uni.hideLoading();
							}
						});
					}
				});
			},
			uploadImg() {
				if (!this.form.topicId) {
					this.$u.toast('请选择圈子');
					return;
				}

				if (!this.form.content) {
					this.$u.toast('内容不能为空');
					return;
				}
				if (!this.form.title) {
					this.$u.toast('标题不能为空');
					return;
				}
				if (this.form.cut == 1) {
					var ret = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
					if (!ret.test(this.form.pay)) {
						this.$u.toast('输入金额不合法');
						return;
					}
					if (this.form.pay <= 0) {
						this.$u.toast('输入金额必须大于0');
						return;
					}
					if (this.form.pay > 100) {
						this.$u.toast('输入金额必须小于100');
						return;
					}
					if(!this.form.brief){
						this.$u.toast('简介必须填写');
						return;
					}
				}
				uni.showLoading({
					mask: true,
					title: '发布中'
				});
				this.$refs.uUpload.upload();
			},
			chooseLocation() {
				let that = this;
				uni.chooseLocation({
					success: function(res) {
						that.form.address = res.name;
						that.form.latitude = res.latitude;
						that.form.longitude = res.longitude;
					},
					fail(err) {
						console.log(err)
					}
				});
			},
			videoSubmit() {
				if (this.form.media.length == 0) {
					this.$u.toast('请上传视频');
					return;
				}

				if (!this.form.topicId) {
					this.$u.toast('请选择圈子');
					return;
				}
				if (!this.form.content) {
					this.$u.toast('内容不能为空');
					return;
				}
				if (!this.form.title) {
					this.$u.toast('标题不能为空');
					return;
				}
				uni.showLoading({
					mask: true,
					title: '发布中'
				});
				this.$H.post('post/addPost', this.form).then(res => {
					if (res.code == 0) {
						uni.redirectTo({
							url: '/pages/post/video-detail?id=' + res.result
						});
					}
					uni.hideLoading();
				});
			},
			submit(e) {
				uni.showLoading({
					mask: true,
					title: '发布中'
				});

				let mediaList = [];
				e.forEach(function(item, index) {
					mediaList.push(item.response.result);
				});

				this.form.media = mediaList;

				this.$H.post('post/addPost', this.form).then(res => {
					if (res.code == 0) {
						uni.redirectTo({
							url: '/pages/post/detail?id=' + res.result
						});
					}
					uni.hideLoading();
				});
			},
			checkPayPostBtn(){
				this.$H.get('system/checkPayPostBtn').then(res => {
					if (res.code == 0) {
						this.payPostBtn = res.isOpen
					}
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.container {
		padding: 20rpx;
		overflow: scroll;
	}

	.title-input {
		border-bottom: 1px solid #F5F5F5;
		margin: 20rpx 0;
		padding: 20rpx 0;
	}

	.post-txt {
		width: 100%;
		padding: 20rpx 0;
		min-height: 300rpx;
	}

	.upload-wrap {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 180rpx;
		height: 180rpx;
		background-color: #F5F5F5;
		margin-top: 30rpx;
		border-radius: 10rpx;

		.icon {
			width: 50rpx;
			height: 50rpx;
		}

		text {
			font-size: 24rpx;
		}
	}

	.upload-video {
		width: 180rpx;
		height: 180rpx;
		margin-top: 30rpx;
	}

	.choose-item {
		display: flex;
		align-items: center;
		padding: 20rpx;
		border-bottom: 1px solid #F5F5F5;

		&:last-child {
			border: 0;
		}

		.txt {
			margin-left: 20rpx;
			font-size: 30rpx;
			color: #000000;
		}

		.sw {
			margin-left: 300rpx;
		}

		.inputStyle {
			margin-left: 60rpx;
			width: 400rpx;
		}

		.radio {
			margin-right: auto;
			position: absolute;
			right: 0;
		}

		.icon {
			width: 40rpx;
			height: 40rpx;
		}

		.u-icon {
			margin-left: auto;
			color: #999;
		}

		.add-icon {
			margin-left: 0;
		}
	}

	.one-line {
		.top {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.title {
				font-size: 30rpx;
				font-weight: 500;
				color: #000000;
				line-height: 42rpx;
			}

			.num {
				font-size: 24rpx;
				color: #000000;
				line-height: 33rpx;
				opacity: 0.5;
			}
		}

		.content {
			margin-top: 26rpx;

			.txt {
				font-size: 30rpx;
				color: #000000;
				line-height: 42rpx;
			}
		}
	}

	.slot-btn {
		margin: 10rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 200rpx;
		height: 200rpx;
		border-radius: 10rpx;
		background-color: #F5F5F5;

	}

	.slot-txt {
		margin-top: 17rpx;
		font-size: 24rpx;
		color: #000000;
		line-height: 33rpx;
		opacity: 0.5;
	}

	.release-btn {
		position: fixed;
		display: flex;
		justify-content: center;
		left: 0;
		bottom: 0;
		width: 750rpx;
		// height: 20rpx;
		background-color: #ffffff;

		.btn {
			width: 690rpx;
			height: 90rpx;
			// background: #323233;
			background: linear-gradient(#121212, #666666);
			border-radius: 10rpx;
			font-size: 28rpx;
			font-weight: 500;
			color: #FFFFFF;
			line-height: 90rpx;
			text-align: center;
		}
	}
</style>