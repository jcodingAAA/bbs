<template>
	<!-- 支付宝小程序使用$u.getRect()获取组件的根元素尺寸，所以在外面套一个"壳" -->
	<view>
		<view class="u-index-anchor-wrapper" :id="$u.guid()" :style="[wrapperStyle]">
			<view class="u-index-anchor " :class="[active ? 'u-index-anchor--active' : '']" :style="[customAnchorStyle]">
				<slot v-if="useSlot" />
				<block v-else>
					<text>{{ index }}</text>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * indexAnchor 索引列表锚点
	 * @description 通过折叠面板收纳内容区域,搭配<u-index-anchor>使用
	 * @tutorial https://www.uviewui.com/components/indexList.html#indexanchor-props
	 * @property {Boolean} use-slot 是否使用自定义内容的插槽（默认false）
	 * @property {String Number} index 索引字符，如果定义了use-slot，此参数自动失效
	 * @property {Object} custStyle 自定义样式，对象形式，如"{color: 'red'}"
	 * @event {Function} default 锚点位置显示内容，默认为索引字符
	 * @example <u-index-anchor :index="item" />
	 */
	export default {
		name: "u-index-anchor",
		props: {
			useSlot: {
				type: Boolean,
				default: false
			},
			index: {
				type: String,
				default: ''
			},
			customStyle: {
				type: Object,
				default () {
					return {}
				}
			}
		},
		data() {
			return {
				active: false,
				wrapperStyle: {},
				anchorStyle: {}
			}
		},
		created() {
			this.parent = false;
		},
		mounted() {
			this.parent = this.$u.$parent.call(this, 'u-index-list');
			if(this.parent) {
				this.parent.children.push(this);
				this.parent.updateData();
			}
		},
		computed: {
			customAnchorStyle() {
				return Object.assign(this.anchorStyle, this.customStyle);
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "../../libs/css/style.components.scss";
	
	.u-index-anchor {
		box-sizing: border-box;
		padding: 14rpx 24rpx;
		color: #07C160;
		width: 100%;
		font-weight: bold;
		font-size: 36rpx;
		line-height: 1.2;
		// background-color: rgb(245, 245, 245);
	}

	.u-index-anchor--active {
		right: 0;
		left: 0;
		color: #2979ff;
		background-color: #fff;
	}
</style>
