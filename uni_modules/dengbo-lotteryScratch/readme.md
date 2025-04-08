# dengbo-lotteryScratch 插件

dengbo-lotteryScratch 是一个用于创建刮刮卡效果的 uniapp 组件。它提供了丰富的自定义选项,包括背景图片、水印、闪光灯效果等。

## 特性

- 可自定义刮卡背景
- 支持文字或图片水印
- 可配置闪光灯效果
- 灵活的刮卡触发百分比
- 支持禁用刮卡功能

## 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| backgroundCard | String | '' | 刮卡背景图片URL |
| percentage | Number | 45 | 触发开奖的刮开百分比 |
| disabled | Boolean | false | 是否禁用刮卡功能 |
| touchSize | Number | 20 | 触摸画笔大小 |
| backgroundImage | String | '' | 刮层背景图片 |
| fillColor | String | '#ddd' | 刮层填充颜色 |
| watermarkTxt | String | '' | 水印文字 |
| watermarkColor | String | '#c5c5c5' | 水印文字颜色 |
| watermarkSize | Number | 14 | 水印文字大小 |
| watermarkImage | String | '' | 水印图片URL |
| watermarkSizeImage | Number | 20 | 水印图片大小 |
| lightConfig | Object | {...} | 闪光灯配置 |
| lightColors | Array | ['#FF0000', '#FFFF00'] | 闪光灯颜色数组 |
| lightImgs | Array | [] | 闪光灯图片URL数组 |

## 事件

| 事件名 | 描述 |
|--------|------|
| complete | 当刮开区域达到指定百分比时触发 |

## 插槽

| 插槽名 | 描述 |
|--------|------|
| backgroundCard | 自定义背景卡片内容 |
| scratch-value | 刮开后显示的内容 |

## 示例
```
<template>
	<view class="content">
		<view class="lottery">
			<dengbo-lotteryScratch backgroundCard="/static/ggl.png" backgroundImage="/static/gglbj.png"
				ref="card" @complete="seatShow" :disabled="disabled" :lightImgs="lightImages">
				<!-- 刮刮卡内容保持不变 -->
				<template v-slot:scratch-value>
					<view style="width: 462rpx; height: 228rpx; text-align: center">恭喜你获得IPhone手机一部</view>
				</template>
			</dengbo-lotteryScratch>
			<view v-if="disabled"
				style="width: 100%; height: 100%; position: absolute; left: 0; top: 0;display: flex;align-items: center;justify-content: center;">
				<image src="/static/gan.png" style="width: 274rpx; height: 82rpx" @click.stop="openCard" />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				lightImages: ['/static/gpoint1.png', '/static/gpoint2.png'],
				disabled: true,
			}
		},
		onLoad() {

		},
		methods: {
			openCard() {
				console.log('刮刮卡开始');
				this.$refs.card.init(); // 重置刮刮卡
				this.disabled = false;
			},

			seatShow() {
				console.log('刮刮卡完成');
				this.disabled = true;
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.lottery {
		margin-top: 100rpx;
		position: relative;
		display: inline-block;
		width: 690rpx;
		height: 460rpx;
	}
</style>
```

## 注意事项

- 确保为组件提供适当的宽度和高度。
- 如果使用背景图片或水印图片,请确保图片资源可以正确加载。
- 闪光灯效果可能会影响性能,请根据实际需求调整配置。