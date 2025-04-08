<template>
	<view class="index-con" :style="{paddingTop:navbarHeight +'px'}">
		<!-- 头部信息 -->
		<view id="navbar" class="lf-nav" :style="{paddingTop:statusBarHeight +'px'}">
			<view class="lf-all">
				<view class="lf-all-nav" :style="{height: navigationBarHeight+'px'}">
					<u-icon name="arrow-left" size="28rpx" @click="goBack" />
					<text style="font-size: 28rpx;">{{title}}</text>
					<view class="" style="width: 50rpx;">
					</view>
				</view>
			</view>
		</view>
		<view class="container lf-top">
			<view class="platform">
				<!-- 头部 -->
				<view class="platform_top">
					选择平台：
					<view class="platform_top_box" v-for="(item,index) in typeList" :key="index"
						:class="platformIndex == index ? 'active' : ''">
						<text class="platform_top_box_title"
							@click="platformSwitch(item.lotteryTypeId,index)">{{item.lotteryTypeName}}</text>
					</view>
				</view>
			</view>
			<!-- 标题 -->
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
				<u-line margin="25rpx 0 0 0" length="690rpx" color="#e3e3e3"></u-line>
			</view>
			<!-- 上传封面图 -->
			<view style="transform: translateX(-10rpx);">
				<u-upload ref="uUpload" :size-type="['original']" name="Image" :max-count="9" :header="header"
					:action="uploadImgUrl" :auto-upload="true" :custom-btn="true">
					<view slot="addBtn" class="slot-btn">
						<u-icon name="plus" size="40" color="#6f6f6f"></u-icon>
						<view class="slot-txt">
							上传封面图
						</view>
					</view>
				</u-upload>
				<u-line length="690rpx" color="#e3e3e3" margin="30rpx 0 33rpx 0"></u-line>
			</view>
			<!-- 富文本编辑器 -->
			<view class="page-body">
				<view class='wrapper'>
					<view class='toolbar' @tap="format" style="height: 120px;overflow-y: auto;">
						<view :class="formats.bold ? 'ql-active' : ''" class="iconfont icon-zitijiacu" data-name="bold">
						</view>
						<view :class="formats.italic ? 'ql-active' : ''" class="iconfont icon-zitixieti"
							data-name="italic">
						</view>
						<view :class="formats.underline ? 'ql-active' : ''" class="iconfont icon-zitixiahuaxian"
							data-name="underline"></view>
						<view :class="formats.strike ? 'ql-active' : ''" class="iconfont icon-zitishanchuxian"
							data-name="strike"></view>
						<!-- #ifndef MP-BAIDU -->
						<view :class="formats.align === 'left' ? 'ql-active' : ''" class="iconfont icon-zuoduiqi"
							data-name="align" data-value="left"></view>
						<!-- #endif -->
						<view :class="formats.align === 'center' ? 'ql-active' : ''" class="iconfont icon-juzhongduiqi"
							data-name="align" data-value="center"></view>
						<view :class="formats.align === 'right' ? 'ql-active' : ''" class="iconfont icon-youduiqi"
							data-name="align" data-value="right"></view>
						<view :class="formats.align === 'justify' ? 'ql-active' : ''" class="iconfont icon-zuoyouduiqi"
							data-name="align" data-value="justify"></view>
						<!-- #ifndef MP-BAIDU -->
						<view :class="formats.lineHeight ? 'ql-active' : ''" class="iconfont icon-line-height"
							data-name="lineHeight" data-value="2"></view>
						<view :class="formats.letterSpacing ? 'ql-active' : ''" class="iconfont icon-Character-Spacing"
							data-name="letterSpacing" data-value="2em"></view>
						<view :class="formats.marginTop ? 'ql-active' : ''" class="iconfont icon-722bianjiqi_duanqianju"
							data-name="marginTop" data-value="20px"></view>
						<view :class="formats.marginBottom ? 'ql-active' : ''"
							class="iconfont icon-723bianjiqi_duanhouju" data-name="marginBottom" data-value="20px">
						</view>
						<!-- #endif -->

						<view class="iconfont icon-clearedformat" @tap="removeFormat"></view>

						<!-- #ifndef MP-BAIDU -->
						<view :class="formats.fontFamily ? 'ql-active' : ''" class="iconfont icon-font"
							data-name="fontFamily" data-value="Pacifico"></view>
						<view :class="formats.fontSize === '24px' ? 'ql-active' : ''" class="iconfont icon-fontsize"
							data-name="fontSize" data-value="24px"></view>
						<!-- #endif -->
						<view :class="formats.color === '#0000ff' ? 'ql-active' : ''" class="iconfont icon-text_color"
							data-name="color" data-value="#0000ff"></view>
						<view :class="formats.backgroundColor === '#00ff00' ? 'ql-active' : ''"
							class="iconfont icon-fontbgcolor" data-name="backgroundColor" data-value="#00ff00"></view>
						<view class="iconfont icon-date" @tap="insertDate"></view>
						<view class="iconfont icon--checklist" data-name="list" data-value="check"></view>
						<view :class="formats.list === 'ordered' ? 'ql-active' : ''" class="iconfont icon-youxupailie"
							data-name="list" data-value="ordered"></view>
						<view :class="formats.list === 'bullet' ? 'ql-active' : ''" class="iconfont icon-wuxupailie"
							data-name="list" data-value="bullet"></view>

						<view class="iconfont icon-undo" @tap="undo"></view>
						<view class="iconfont icon-redo" @tap="redo"></view>

						<view class="iconfont icon-outdent" data-name="indent" data-value="-1"></view>
						<view class="iconfont icon-indent" data-name="indent" data-value="+1"></view>
						<view class="iconfont icon-fengexian" @tap="insertDivider"></view>
						<view class="iconfont icon-charutupian" @tap="insertImage"></view>
						<view :class="formats.header === 1 ? 'ql-active' : ''" class="iconfont icon-format-header-1"
							data-name="header" :data-value="1"></view>
						<view :class="formats.script === 'sub' ? 'ql-active' : ''" class="iconfont icon-zitixiabiao"
							data-name="script" data-value="sub"></view>
						<view :class="formats.script === 'super' ? 'ql-active' : ''" class="iconfont icon-zitishangbiao"
							data-name="script" data-value="super"></view>

						<view class="iconfont icon-shanchu" @tap="clear"></view>

						<view :class="formats.direction === 'rtl' ? 'ql-active' : ''"
							class="iconfont icon-direction-rtl" data-name="direction" data-value="rtl"></view>
					</view>

					<view class="editor-wrapper">
						<editor id="editor" class="ql-container" placeholder="在这里编辑内容..." show-img-size show-img-toolbar
							show-img-resize @statuschange="onStatusChange" :read-only="readOnly" @ready="onEditorReady">
						</editor>
						<u-line margin="25rpx 0 0 0" length="690rpx" color="#d0d0d0"></u-line>

						<!-- 选择圈子 -->
						<!-- 	<navigator url="/pages/topic/choose-topic/choose-topic" class="choose-item">
						<image class="icon" src="/static/p_1.png"></image>
						<text class="txt">{{ topicName }}</text>
						<u-icon class="u-icon" name="arrow-right"></u-icon>
					</navigator> -->
						<!-- 选择话题 -->
						<!-- 	<navigator v-if="form.topicId"
						:url="'/pages/discuss/choose-discuss/choose-discuss?topicId=' + form.topicId"
						class="choose-item">
						<image class="icon" src="/static/m_1.png"></image>
						<text class="txt">{{ disName }}</text>
						<u-icon class="u-icon" name="arrow-right"></u-icon>
					</navigator> -->

					</view>

				</view>

				<!-- <view class="float-empty"></view> -->
				<view class="release-btn" @click="submit">
					<view class="btn">发布</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				navbarHeight: 0,
				navigationBarHeight: 0,
				statusBarHeight: 0,
				typeList: [],
				lotteryTypeId: "",
				platformIndex: 0,
				readOnly: false,
				formats: {},
				title: "",
				relateType: null,
				form: {
					title: '',
					topicId: '',
					content: '',
					type: 3,
					media: []
				},
				topicName: '选择圈子',
				disName: '选择话题',
				uploadImgUrl: this.$c.domain + 'common/upload',
				header: {
					token: uni.getStorageSync('token')
				},
			}
		},
		onLoad(options) {
			this.navigationBarHeight = getApp().globalData.navigationBarHeight;
			this.statusBarHeight = getApp().globalData.statusBarHeight;
			if (options.topicId) {
				this.topicId = options.topicId;
			}
			if (options.item) {
				const item = JSON.parse(decodeURIComponent(options.item));
				// this.data = item
				this.title = item.title
				this.relateType = item.relateType
				console.log(item)
			}
			const typeList = uni.getStorageSync('typeList')
			if (typeList) {
				this.typeList = typeList
				this.lotteryTypeId = typeList[0].lotteryTypeId
			}
		},
		onShow() {
			if (!uni.getStorageSync('hasLogin')) {
				uni.navigateTo({
					url: "/pages/user/go-login"
				})
			}
		},
		methods: {
			submit() {

				if (!this.form.title) {
					this.$u.toast('标题不能为空');
					return;
				}
				var that = this;
				this.editorCtx.getContents({
					success: function(res) {
						that.form.content = res.html
						if (!that.form.content) {
							that.$u.toast('内容不能为空');
							return;
						}
						uni.showLoading({
							mask: true,
							title: '发布中'
						});
						let files = [];
						// 通过filter，筛选出上传进度为100的文件(因为某些上传失败的文件，进度值不为100，这个是可选的操作)
						files = that.$refs.uUpload.lists.filter(val => {
							return val.progress == 100;
						})
						if (files.length == 0) {
							that.$u.toast('请上传封面图');
							return;
						}
						console.log(files[0].response.result)
						that.form.media.push(files[0].response.result)
						that.$H.post('post/addArticle', {
							...that.form,
							lotteryTypeId: that.lotteryTypeId,
							relateType: that.relateType
						}).then(res => {
							if (res.code == 0) {
								// uni.redirectTo({
								// 	url: '/subpages/content/article/article?id=' + res.result
								// });
								uni.$emit('refresh',{refresh: true})
								// if(that.relateType == 2) {
								// 	uni.navigateTo({
								// 		url: '/pages/index/index'
								// 	})
								// }else if(that.relateType == 0) {
								// 	uni.navigateTo({
								// 		url: '/pages/find/find'
								// 	})
								// }
								uni.navigateBack({
									delta: 1,
								})
							}
							uni.hideLoading();
						});
					}
				})
			},
			readOnlyChange() {
				this.readOnly = !this.readOnly
			},
			onEditorReady() {
				// #ifdef MP-BAIDU
				this.editorCtx = requireDynamicLib('editorLib').createEditorContext('editor');
				// #endif

				// #ifdef APP-PLUS || MP-WEIXIN || H5
				uni.createSelectorQuery().select('#editor').context((res) => {
					this.editorCtx = res.context
				}).exec()
				// #endif
			},
			undo() {
				this.editorCtx.undo()
			},
			redo() {
				this.editorCtx.redo()
			},
			format(e) {
				let {
					name,
					value
				} = e.target.dataset
				if (!name) return
				// console.log('format', name, value)
				this.editorCtx.format(name, value)
			},
			onStatusChange(e) {
				const formats = e.detail
				this.formats = formats
			},
			insertDivider() {
				this.editorCtx.insertDivider({
					success: function() {
						console.log('insert divider success')
					}
				})
			},
			clear() {
				uni.showModal({
					title: '清空编辑器',
					content: '确定清空编辑器全部内容？',
					success: res => {
						if (res.confirm) {
							this.editorCtx.clear({
								success: function(res) {
									console.log("clear success")
								}
							})
						}
					}
				})
			},
			removeFormat() {
				this.editorCtx.removeFormat()
			},
			insertDate() {
				const date = new Date()
				const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
				this.editorCtx.insertText({
					text: formatDate
				})
			},
			insertImage() {
				let that = this;
				uni.chooseImage({
					count: 1,
					success: (res) => {
						uni.showLoading({
							mask: true,
							title: "上传中"
						})
						uni.uploadFile({
							url: that.$c.domain + 'common/upload',
							filePath: res.tempFilePaths[0],
							name: 'Image',
							header: {
								token: uni.getStorageSync("token")
							},
							success: (uploadFileRes) => {
								let data = JSON.parse(uploadFileRes.data)
								if (data.code == 0) {
									that.editorCtx.insertImage({
										src: data.result,
										alt: '图像',
										success: function() {
											console.log('insert image success')
										}
									})
									uni.hideLoading();
								}
							}
						});
					}
				})
			},
			platformSwitch(type, index) {
				this.platformIndex = index
				this.lotteryTypeId = type
			},
			goBack() {
				uni.navigateBack({
					delta: 1
				});
			},

		}
	}
</script>

<style lang="scss" scoped>
	@import "./editor-icon.css";
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
	.float-empty {
		height: 120rpx;
		width: 100%;
		display: block;
		background: #fff;
	}

	.page-body {
		height: calc(100vh - var(--window-top) - var(--status-bar-height));
	}

	.wrapper {
		height: 100%;
	}

	.editor-wrapper {
		height: calc(100vh - var(--window-top) - var(--status-bar-height) - 140px);
		// height: auto;
		background: #fff;
	}

	.iconfont {
		display: inline-block;
		padding: 1px 2px;
		width: 24px;
		height: 24px;
		cursor: pointer;
		font-size: 20px;
	}

	.toolbar {
		box-sizing: border-box;
		border-bottom: 0;
		font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
		padding: 8px 8px;
	}

	.ql-container {
		box-sizing: border-box;
		padding: 12px 15px;
		width: 100%;
		min-height: 30vh;
		height: 70%;
		margin-top: 20px;
		font-size: 16px;
		line-height: 1.5;
	}

	.ql-active {
		color: #06c;
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
			background: #07c160;
			border-radius: 10rpx;
			font-size: 28rpx;
			font-weight: 500;
			color: #FFFFFF;
			line-height: 90rpx;
			text-align: center;
		}
	}

	.one-line {
		.top {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.title {
				font-size: 30rpx;
				font-weight: 700;
				color: #07c160;
				line-height: 42rpx;
				padding-left: 20rpx;
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
			padding-left: 20rpx;

			.txt {
				font-size: 30rpx;
				color: #000000;
				line-height: 42rpx;
			}
		}
	}

	.choose-item {
		display: flex;
		align-items: center;
		padding: 20rpx;
		border-bottom: 1px solid #e3e3e3;

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

	.platform {
		background-color: white;
		padding: 24rpx 12rpx;
		width: 100%;
		display: flex;

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
</style>