<template>
	<view class="body">
		<view class="type-tab">
			<block v-for="(item,index) in typeList" :key="index">
				<view class="bbs-tab-box" :class="{'active': index == typeIndex}" @click="typeChange(index)">
					{{item.lotteryTypeName}}
				</view>
			</block>
		</view>
		<view class="top">
			<view class="box" @click="yearShow = true">
				查询年份<view class="triangle"></view>
			</view>
			<view class="box" @click="maskShow = !maskShow">
				查询条件<view class="triangle"></view>
			</view>
			<view class="select-body" v-if="maskShow">
				<view class="select-box">
					<view class="left">
						<scroll-view scroll-y="true" class="scroll-Y" show-scrollbar="true">
							<view class="left-box" v-for="(item,index) in leftOption" :key="index">
								<view class="left-contant" :style="{color: leftIndex == index? '#07c106' : ''}"
									@click="leftIndexChange(index)">
									{{item.text}}
									<view class="triangle-left" :class="{'triangle-left-active': leftIndex == index}">
									</view>
								</view>
							</view>
						</scroll-view>
					</view>
					<view class="right">
						<scroll-view scroll-y="true" class="scroll-Y" show-scrollbar="true">
							<view class="right-box" v-for="(item,index) in leftOption[leftIndex].childList" :key="index"
								@click="rightIndexChange(item)">
								<view class="right-contant" :style="{color: item == childText? '#07c106' : ''}">
									{{item}}
									<view class="triangle-right" v-if="item == childText"></view>
								</view>
							</view>
						</scroll-view>
					</view>
				</view>
				<view class="bottom">
					<view class="bottom-left" @click="maskShow = false">
						取消
					</view>
					<view class="bottom-right" @click="submit()">
						确定
					</view>
				</view>
			</view>
		</view>
		<view class="table">
			<u-table>
				<u-tr>
					<u-th width="30%">年份/期号</u-th>
					<u-th width="10%" v-for="(item,index) in tableData.titleList">{{item}}</u-th>
				</u-tr>
				<u-tr v-for="(item,index) in tableData.dateList" :key="index">
					<u-td width="30%">{{item.lotteryTime.split(" ")[0].split("-")[0]}}-{{item.period}}</u-td>
					<u-td width="10%" v-for="(childItem,childIndex) in item.numberList" :key="childIndex">
						<span :class="activeText.indexOf(childItem.value) !== -1 ? 'td-active' : ''">{{childItem.value}}</span>
					</u-td>
				</u-tr>
			</u-table>
		</view>
		<u-picker v-model="yearShow" mode="time" :params="{year:true}" :end-year="nowYear" @confirm="yearChange"
			title="年份选择" :default-time="`${year}-01-01`"></u-picker>
		<u-mask :show="maskShow" @click="maskShow = false" :z-index="9"></u-mask>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				typeList: [],
				typeIndex: 0,
				year: "",
				nowYear: "",
				yearShow: false,
				maskShow: false,
				leftIndex: 0,
				childText: "",
				tableData: {},
				activeText: "",
				leftOption: [{
						text: "数字",
						childList: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23",
							"24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45",
							"46", "47", "48", "49"
						]
					},
					{
						text: "生肖",
						childList: [
							"鼠",
							"牛",
							"虎",
							"兔",
							"龙",
							"蛇",
							"马",
							"羊",
							"猴",
							"鸡",
							"狗",
							"猪"
						]
					},
					{
						text: "五行",
						childList: [
							"金",
							"木",
							"水",
							"火",
							"土"
						]
					},
					{
						text: "波色",
						childList: [
							"红波",
							"绿波",
							"蓝波",
						]
					},
					{
						text: "家野",
						childList: [
							"家禽",
							"野兽",
						]
					},
					{
						text: "尾数",
						childList: [
							"1尾",
							"2尾",
							"3尾",
							"4尾",
							"5尾",
							"6尾",
							"7尾",
							"8尾",
							"9尾",
						]
					},
				]
			}
		},
		onLoad() {
			this.year = new Date().getFullYear()
			this.nowYear = new Date().getFullYear()
			const typeList = uni.getStorageSync('typeList')
			if (typeList) {
				this.typeList = typeList
			}
			this.getQuery()
		},
		methods: {
			typeChange(index) {
				this.typeIndex = index
				this.getQuery()
			},
			getQuery() {
				let value = ""
				if (this.leftIndex == 5) {
					value = this.childText.slice(0, -1);
				} else {
					value = this.childText
				}
				this.$H.get('lottery/tool/query', {
					year: this.year,
					queryType: this.leftIndex + 1,
					lotteryTypeId: this.typeList[this.typeIndex].lotteryTypeId,
					value
				}).then(res => {
					this.tableData = res.data
					this.activeText = this.childText
				});
			},
			yearChange(date) {
				this.year = date.year
				this.getQuery()
			},
			leftIndexChange(index) {
				this.leftIndex = index
			},
			rightIndexChange(item) {
				this.childText = item
			},
			submit() {
				this.getQuery()
				this.maskShow = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.body {
		width: 100%;
		.type-tab {
			width: 100%;
			display: flex;
			justify-content: space-around;
			background-color: white;
			padding-top: 12rpx;
			padding-bottom: 24rpx;
		
			.active {
				position: relative;
				font-size: 40rpx;
				font-weight: 700;
				// color: #07c160;
			}
		
			.bbs-tab-box {
				width: 26%;
				text-align: center;
				font-size: 32rpx;
				font-weight: bold;
			}
		
			.active::after {
				content: "";
				position: absolute;
				bottom: -16rpx;
				background-color: #07c160;
				width: 40rpx;
				height: 8rpx;
				left: 0;
				border-radius: 8rpx;
				right: 0;
				margin: auto;
			}
		}

		.top {
			width: 100%;
			display: flex;
			flex-direction: row;
			height: 100rpx;
			border-bottom: 1px solid #666;
			position: relative;
			background-color: white;
			z-index: 999;

			.box {
				width: 50%;
				display: flex;
				align-items: center;
				justify-content: center;

				.triangle {
					width: 0;
					height: 0;
					border-left: 10rpx solid transparent;
					/* 左边的透明部分 */
					border-right: 10rpx solid transparent;
					/* 右边的透明部分 */
					border-top: 10rpx solid black;
					margin-left: 12rpx;
					/* 底部红色线条 */
				}
			}

			.select-body {
				position: absolute;
				top: 100rpx;
				width: 100%;

				.select-box {
					width: 100%;
					height: 400rpx;
					background-color: white;
					display: flex;

					.left {
						width: 50%;
						display: flex;
						flex-direction: column;

						.left-box {
							width: 100%;
							display: flex;
							align-items: center;
							justify-content: center;
							margin-top: 15rpx;

							.left-contant {
								display: flex;
								align-items: center;

								.triangle-left {
									width: 0;
									height: 0;
									border-left: 12rpx solid transparent;
									/* 左边的透明部分 */
									border-right: 12rpx solid black;
									/* 右边的透明部分 */
									border-top: 12rpx solid transparent;
									margin-left: 12rpx;
									transform: rotate(-45deg);
									/* 底部红色线条 */
								}

								.triangle-left-active {
									border-right: 12rpx solid #07c106;
								}
							}
						}
					}

					.right {
						width: 50%;
						display: flex;
						flex-direction: column;

						.right-box {
							width: 100%;
							display: flex;
							align-items: center;
							justify-content: center;
							margin-top: 15rpx;

							.right-contant {
								display: flex;
								align-items: center;
								width: 60%;
								justify-content: space-between;

								.triangle-right {
									width: 10rpx;
									height: 20rpx;
									transform: rotate(45deg);
									border-right: 2px solid #07c106;
									border-bottom: 2px solid #07c106;
								}
							}
						}
					}
				}

				.bottom {
					width: 100%;
					display: flex;
					height: 100rpx;
					border-top: 1px solid #666;
					background-color: white;

					view {
						width: 50%;
						text-align: center;
						line-height: 100rpx;
					}

					.bottom-right {
						color: #07c106;
					}
				}
			}
		}
	}

	.scroll-Y {
		height: 400rpx;
	}
	.table {
		.u-th {
			background-color: #a96223;
			color: white;
			font-size: 24rpx;
		}
		.u-td {
			font-size: 26rpx !important;
		}
		.td-active {
			color: white;
			background-color: red;
			border-radius: 50rpx;
		}
	}
	// 滚动条样式
	:deep ::-webkit-scrollbar {
		/*滚动条整体样式*/
		width: 4px !important;
		height: 1px !important;
		overflow: auto !important;
		background: #ccc !important;
		-webkit-appearance: auto !important;
		display: block;
	}

	:deep ::-webkit-scrollbar-thumb {
		/*滚动条里面小方块*/
		border-radius: 10px !important;
		box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1) !important;
		background: #dddddd !important;
	}

	:deep ::-webkit-scrollbar-track {
		/*滚动条里面轨道*/
		// box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2) !important;
		// border-radius: 10px !important;
		background: #f5f5f5 !important;
	}
</style>