<template>
	<view class="index-con" :style="{paddingTop:navbarHeight +'px'}">
		<view id="navbar" class="lf-nav" :style="{paddingTop:statusBarHeight +'px'}">
			<view class="lf-all">
				<view class="lf-all-nav" :style="{height: navigationBarHeight+'px'}">
					<u-icon name="arrow-left" size="28rpx" @click="goBack" />
					<text style="font-size: 28rpx;">{{title}}</text>
					<view class="" style="width: 120rpx;">
						<u-icon v-if="yearIconShow" name="calendar" size="28rpx" color="#07C160" @click="yearPicker" />
						<view class="right" v-if="periodShow">
							期数
							<u-search placeholder="" :show-action="false" border-color="#575757"
								margin="0" search-icon="" v-model="period" :input-style="{paddingLeft: '0'}"
								:borderColor="'white'" :clearabled="false" :shape="'square'" :bgColor="'#f5f5f5'"
								@custom="periodOnChange" @search="periodOnChange"
								:actionStyle="{fontSize: '24rpx'}"></u-search>

						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="lf-top">
			<view class="type-tab">
				<block v-for="(item,index) in typeList" :key="index">
					<view class="bbs-tab-box" :class="{'active': index == typeIndex}" @click="typeChange(index)">
						{{item.lotteryTypeName}}
					</view>
				</block>
			</view>
			<view class="statistics" v-if="bottomIndex == 0">
				<view class="statistics-box">
					<p>特码出现期数最多的号码</p>
					<view class="color-content" v-if="statisticsData.specialNum && statisticsData.specialNum.hot">
						<view class="platform_data_box" v-for="(item,index) in statisticsData.specialNum.hot.list"
							:key="index" @click="handleStatistics('特码出现期数最多的号码',item)">
							<view class="platform_data_ball" v-if="index < 10">
								<view class="number"
									:class="item.color == '1' ? 'ball_red' : item.color == '2' ? 'ball_blue' : 'ball_green'">
									<view class="ball_big">
										{{item.key}}
									</view>
									<view class="ball_small">

									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="statistics-box">
					<p>特码当前遗漏期数最多的号码</p>
					<view class="color-content" v-if="statisticsData.specialNum && statisticsData.specialNum.cold">
						<view class="platform_data_box" v-for="(item,index) in statisticsData.specialNum.cold.list"
							:key="index" @click="handleStatistics('特码当前遗漏期数最多的号码',item)">
							<view class="platform_data_ball" v-if="index < 10">
								<view class="number"
									:class="item.color == '1' ? 'ball_red' : item.color == '2' ? 'ball_blue' : 'ball_green'">
									<view class="ball_big">
										{{item.key}}
									</view>
									<view class="ball_small">

									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="statistics-box">
					<p>正码出现期数最多的号码</p>
					<view class="color-content" v-if="statisticsData.normalNum && statisticsData.normalNum.hot">
						<view class="platform_data_box" v-for="(item,index) in statisticsData.normalNum.hot.list"
							:key="index" @click="handleStatistics('正码出现期数最多的号码',item)">
							<view class="platform_data_ball" v-if="index < 10">
								<view class="number"
									:class="item.color == '1' ? 'ball_red' : item.color == '2' ? 'ball_blue' : 'ball_green'">
									<view class="ball_big">
										{{item.key}}
									</view>
									<view class="ball_small">

									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="statistics-box">
					<p>正码当前遗漏期数最多的号码</p>
					<view class="color-content" v-if="statisticsData.normalNum && statisticsData.normalNum.cold">
						<view class="platform_data_box" v-for="(item,index) in statisticsData.normalNum.cold.list"
							:key="index" @click="handleStatistics('正码当前遗漏期数最多的号码',item)">
							<view class="platform_data_ball" v-if="index < 10">
								<view class="number"
									:class="item.color == '1' ? 'ball_red' : item.color == '2' ? 'ball_blue' : 'ball_green'">
									<view class="ball_big">
										{{item.key}}
									</view>
									<view class="ball_small">

									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="statistics-box statistics-box-two">
					<view class="statistics-box-contant">
						<span class="title">特码出现期数最多的生肖</span>
						<view class="content-box"
							v-if="statisticsData.specialAnimal && statisticsData.specialAnimal.hot">
							<view class="content_data_box" v-for="(item,index) in statisticsData.specialAnimal.hot.list"
								:key="index" @click="handleStatistics('特码出现期数最多的生肖',item)">
								{{item.key}}
							</view>
						</view>
					</view>
					<view class="statistics-box-contant">
						<span class="title">特码当前遗漏期数最多的生肖</span>
						<view class="content-box"
							v-if="statisticsData.specialAnimal && statisticsData.specialAnimal.cold">
							<view class="content_data_box"
								v-for="(item,index) in statisticsData.specialAnimal.cold.list" :key="index"
								@click="handleStatistics('特码当前遗漏期数最多的生肖',item)">
								{{item.key}}
							</view>
						</view>
					</view>
					<view class="statistics-box-contant">
						<span class="title">正码出现期数最多的生肖</span>
						<view class="content-box" v-if="statisticsData.normalAnimal && statisticsData.normalAnimal.hot">
							<view class="content_data_box" v-for="(item,index) in statisticsData.normalAnimal.hot.list"
								:key="index" @click="handleStatistics('正码出现期数最多的生肖',item)">
								{{item.key}}
							</view>
						</view>
					</view>
					<view class="statistics-box-contant">
						<span class="title">正码当前遗漏期数最多的生肖</span>
						<view class="content-box"
							v-if="statisticsData.normalAnimal && statisticsData.normalAnimal.cold">
							<view class="content_data_box" v-for="(item,index) in statisticsData.normalAnimal.cold.list"
								:key="index" @click="handleStatistics('正码当前遗漏期数最多的生肖',item)">
								{{item.key}}
							</view>
						</view>
					</view>
				</view>
				<view class="statistics-box statistics-box-two">
					<view class="statistics-box-contant">
						<span class="title">特码出现期数最多的波色</span>
						<view class="content-box" v-if="statisticsData.specialColor && statisticsData.specialColor.hot">
							<view class="content_data_box" v-for="(item,index) in statisticsData.specialColor.hot.list"
								:key="index" @click="handleStatistics('特码出现期数最多的波色',item)">
								<view :class="item.key == '蓝波' ? 'blue' : item.key == '红波' ? 'red' : 'green'">
									{{item.key}}
								</view>
							</view>
						</view>
					</view>
					<view class="statistics-box-contant">
						<span class="title">特码当前遗漏期数最多的波色</span>
						<view class="content-box"
							v-if="statisticsData.specialColor && statisticsData.specialColor.cold">
							<view class="content_data_box" v-for="(item,index) in statisticsData.specialColor.cold.list"
								:key="index" @click="handleStatistics('特码当前遗漏期数最多的波色',item)">
								<view :class="item.key == '蓝波' ? 'blue' : item.key == '红波' ? 'red' : 'green'">
									{{item.key}}
								</view>
							</view>
						</view>
					</view>
					<view class="statistics-box-contant">
						<span class="title">正码出现期数最多的波色</span>
						<view class="content-box" v-if="statisticsData.normalColor && statisticsData.normalColor.hot">
							<view class="content_data_box" v-for="(item,index) in statisticsData.normalColor.hot.list"
								:key="index" @click="handleStatistics('正码出现期数最多的波色',item)">
								<view :class="item.key == '蓝波' ? 'blue' : item.key == '红波' ? 'red' : 'green'">
									{{item.key}}
								</view>
							</view>
						</view>
					</view>
					<view class="statistics-box-contant">
						<span class="title">正码当前遗漏期数最多的波色</span>
						<view class="content-box" v-if="statisticsData.normalColor && statisticsData.normalColor.cold">
							<view class="content_data_box" v-for="(item,index) in statisticsData.normalColor.cold.list"
								:key="index" @click="handleStatistics('正码当前遗漏期数最多的波色',item)">
								<view :class="item.key == '蓝波' ? 'blue' : item.key == '红波' ? 'red' : 'green'">
									{{item.key}}
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="statistics-box statistics-box-two">
					<view class="statistics-box-contant">
						<span class="title">特码出现期数最多的生肖</span>
						<view class="content-box" v-if="statisticsData.specialTail && statisticsData.specialTail.hot">
							<view class="content_data_box" v-for="(item,index) in statisticsData.specialTail.hot.list"
								:key="index" @click="handleStatistics('特码出现期数最多的生肖',item)">
								<view style="width: 50rpx;" v-if="index < 5">{{item.key}}尾</view>
							</view>
						</view>
					</view>
					<view class="statistics-box-contant">
						<span class="title">特码当前遗漏期数最多的生肖</span>
						<view class="content-box" v-if="statisticsData.specialTail && statisticsData.specialTail.cold">
							<view class="content_data_box" v-for="(item,index) in statisticsData.specialTail.cold.list"
								:key="index" @click="handleStatistics('特码当前遗漏期数最多的生肖',item)">
								<view style="width: 50rpx;" v-if="index < 5">{{item.key}}尾</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="library" v-if="bottomIndex == 1">
				<view class="top">
					<view class="" v-for="(item,index) in libraryOption" :key="index"
						:class="{'library-active': libraryIndex == index}" @click="libraryChange(index)">
						{{item.name}}
					</view>
				</view>
				<view class="color" v-if="libraryIndex == 0">
					<view class="color-box" v-for="(item,index) in libraryInfo.colorList">
						<p class="color-title">{{item.name}}</p>
						<view class="color-content">
							<view class="platform_data_box" v-for=" (itemChild,index) in item.list" :key="index">
								<view class="platform_data_ball">
									<view class="number"
										:class="itemChild.color == '1' ? 'ball_red' : itemChild.color == '2' ? 'ball_blue' : 'ball_green'">
										<view class="ball_big">
											{{itemChild.number}}
										</view>
										<view class="ball_small">

										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="color" v-if="libraryIndex == 1">
					<view class="color-box shengxiao-box" v-for="(item,index) in libraryInfo.shengxiaoList">
						<span class="color-title">{{item.name}}</span>
						<view class="color-content">
							<view class="platform_data_box" v-for=" (itemChild,index) in item.list" :key="index">
								<view class="platform_data_ball">
									<view class="number"
										:class="itemChild.color == '1' ? 'ball_red' : itemChild.color == '2' ? 'ball_blue' : 'ball_green'">
										<view class="ball_big">
											{{itemChild.number}}
										</view>
										<view class="ball_small">

										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="color" v-if="libraryIndex == 2">
					<view class="color-box shengxiao-box" v-for="(item,index) in libraryInfo.wuxingList">
						<span class="color-title">{{item.name}}</span>
						<view class="color-content">
							<view class="platform_data_box" v-for=" (itemChild,index) in item.list" :key="index">
								<view class="platform_data_ball">
									<view class="number"
										:class="itemChild.color == '1' ? 'ball_red' : itemChild.color == '2' ? 'ball_blue' : 'ball_green'">
										<view class="ball_big">
											{{itemChild.number}}
										</view>
										<view class="ball_small">

										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="color" v-if="libraryIndex == 3">
					<view class="color-box shengxiao-box" v-for="(item,index) in libraryInfo.animalTypeList">
						<span class="color-title animal-title">{{item.name}}</span>
						<view class="color-content" v-if="item.name == '家禽'">
							<view class="platform_data_box" v-for=" (itemChild,index) in libraryInfo.jiaList"
								:key="index">
								<view class="" v-if="index != 0">
									丶
								</view>{{itemChild}}
							</view>
						</view>
						<view class="color-content" v-else>
							<view class="platform_data_box" v-for=" (itemChild,index) in libraryInfo.yeList"
								:key="index">
								<view class="" v-if="index != 0">
									丶
								</view>{{itemChild}}
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="special" v-if="bottomIndex == 2">
				<p class="title">当前统计期数:{{period}}</p>
				<p class="text">特码历史热图（所选期数范围国内出现的次数）</p>
				<view class="charts-box">
					<qiun-data-charts type="line" :opts="hotOpts" :chartData="specialHotChart" />
					<span class="xTitle">号码:</span>
				</view>
				<p class="text">特码历史冷图（所选期数范围国内出现的次数）</p>
				<view class="charts-box">
					<qiun-data-charts type="line" :opts="coodOpts" :chartData="specialCoodChart" />
					<span class="xTitle">号码:</span>
				</view>
			</view>
			<view class="special" v-if="bottomIndex == 3">
				<p class="title">当前统计期数:{{period}}</p>
				<p class="text">特码历史热图（所选期数范围国内出现的次数）</p>
				<view class="charts-box">
					<qiun-data-charts type="line" :opts="hotOpts" :chartData="ordinaryHotChart" />
					<span class="xTitle">号码:</span>
				</view>
				<p class="text">特码历史冷图（所选期数范围国内出现的次数）</p>
				<view class="charts-box">
					<qiun-data-charts type="line" :opts="coodOpts" :chartData="ordinaryCoodChart" />
					<span class="xTitle">号码:</span>
				</view>
			</view>
			<view class="weishu" v-if="bottomIndex == 4">
				<u-table>
					<u-tr>
						<u-th width="30%">期号</u-th>
						<u-th width="10%" v-for="(item,index) in mantissaList.titleList">{{item}}</u-th>
					</u-tr>
					<u-tr v-for="(item,index) in mantissaList.dateList" :key="index">
						<u-td width="30%">{{item.lotteryTime.split(" ")[0].split("-")[0]}}-{{item.period}}</u-td>
						<u-td width="10%" v-for="(childItem,childIndex) in item.numberList" :key="childIndex">
							<span :style="{color: childItem.value=='大' ? 'red' : '' }">{{childItem.value}}</span>
						</u-td>
					</u-tr>
				</u-table>
			</view>
			<view class="library pie" v-if="bottomIndex == 5">
				<view class="top">
					<view class="top-box" v-for="(item,index) in pieOption" :key="index"
						:class="{'library-active': pieIndex == index}" @click="pieChange(index)">
						{{item.name}}
					</view>
				</view>
				<p>当前统计期数:{{period}}</p>
				<view class="pie-box" v-if="pieIndex == 0">
					<qiun-data-charts type="ring" :opts="pieOpts" :chartData="specialPieHotChart" />
				</view>
				<view class="" v-if="pieIndex == 1">
					<qiun-data-charts type="ring" :opts="pieOpts" :chartData="specialPieCoodChart" />
				</view>
			</view>
			<view class="library pie" v-if="bottomIndex == 6">
				<view class="top">
					<view class="top-box" v-for="(item,index) in pieOption" :key="index"
						:class="{'library-active': pieIndex == index}" @click="pieChange(index)">
						{{item.name}}
					</view>
				</view>
				<p>当前统计期数:{{period}}</p>
				<view class="pie-box" v-if="pieIndex == 0">
					<qiun-data-charts type="ring" :opts="pieOpts" :chartData="ordinaryPieHotChart" />
				</view>
				<view class="" v-if="pieIndex == 1">
					<qiun-data-charts type="ring" :opts="pieOpts" :chartData="ordinaryPieCoodChart" />
				</view>
			</view>
	
			<view class="library pie" v-if="bottomIndex == 7">
				<view class="top">
					<view class="top-box" v-for="(item,index) in pieOption" :key="index"
						:class="{'library-active': pieIndex == index}" @click="pieChange(index)">
						{{item.name}}
					</view>
				</view>
				<p>当前统计期数:{{period}}</p>
				<view class="pie-box" v-if="pieIndex == 0">
					<qiun-data-charts type="ring" :opts="pieOpts" :chartData="specialPieBoseHotChart" />
				</view>
				<view class="" v-if="pieIndex == 1">
					<qiun-data-charts type="ring" :opts="pieOpts" :chartData="specialPieBoseColdChart" />
				</view>
			</view>
			<view class="library pie" v-if="bottomIndex == 8">
				<view class="top">
					<view class="top-box" v-for="(item,index) in pieOption" :key="index"
						:class="{'library-active': pieIndex == index}" @click="pieChange(index)">
						{{item.name}}
					</view>
				</view>
				<p>当前统计期数:{{period}}</p>
				<view class="pie-box" v-if="pieIndex == 0">
					<qiun-data-charts type="ring" :opts="pieOpts" :chartData="ordinaryPieBoseHotChart" />
				</view>
				<view class="" v-if="pieIndex == 1">
					<qiun-data-charts type="ring" :opts="pieOpts" :chartData="ordinaryPieBoseColdChart" />
				</view>
			</view>
			<view class="special" v-if="bottomIndex == 9">
				<p class="title">当前统计期数:{{period}}</p>
				<view class="charts-box">
					<qiun-data-charts type="column" :opts="histogramOpts" :chartData="tmliangMianChart" />
					<span class="xTitle">类型:</span>
				</view>
			</view>
			<view class="library pie" v-if="bottomIndex == 10">
				<view class="top">
					<view class="top-box" v-for="(item,index) in pieOption" :key="index"
						:class="{'library-active': pieIndex == index}" @click="pieChange(index)">
						{{item.name}}
					</view>
				</view>
				<p>当前统计期数:{{period}}</p>
				<view class="pie-box" v-if="pieIndex == 0">
					<qiun-data-charts type="ring" :opts="pieOpts" :chartData="specialPieWeishuHotChart" />
				</view>
				<view class="" v-if="pieIndex == 1">
					<qiun-data-charts type="ring" :opts="pieOpts" :chartData="specialPieWeishuColdChart" />
				</view>
			</view>
			<view class="library pie" v-if="bottomIndex == 11">
				<view class="top">
					<view class="top-box" v-for="(item,index) in pieOption" :key="index"
						:class="{'library-active': pieIndex == index}" @click="pieChange(index)">
						{{item.name}}
					</view>
				</view>
				<p>当前统计期数:{{period}}</p>
				<view class="pie-box" v-if="pieIndex == 0">
					<qiun-data-charts type="ring" :opts="pieOpts" :chartData="ordinaryPieWeishuHotChart" />
				</view>
				<view class="" v-if="pieIndex == 1">
					<qiun-data-charts type="ring" :opts="pieOpts" :chartData="ordinaryPieWeishuColdChart" />
				</view>
			</view>
			<view class="special" v-if="bottomIndex == 12">
				<p class="title">当前统计期数:{{period}}</p>
				<view class="charts-box">
					<qiun-data-charts type="column" :opts="histogramOpts" :chartData="zmLiangMianChart" />
					<span class="xTitle">类型:</span>
				</view>
			</view>
			<view class="library pie" v-if="bottomIndex == 13">
				<view class="top">
					<view class="top-box" v-for="(item,index) in pieNumberOption" :key="index"
						:class="{'library-active': pieNumberIndex == index}" @click="pieNumberChange(index,item)">
						{{item.name}}
					</view>
				</view>
				<p>当前统计期数:{{period}}</p>
				<view class="pie-box" v-if="pieNumberIndex == 0">
					<qiun-data-charts type="ring" :opts="pieOpts" :chartData="specialPieBoduanChart" />
				</view>
				<view class="" v-if="pieNumberIndex == 1">
					<qiun-data-charts type="ring" :opts="pieOpts" :chartData="ordinaryPieBoduanChart" />
				</view>
			</view>
			<view class="weishu" v-if="bottomIndex == 14">
				<u-table>
					<u-tr>
						<u-th width="30%">期号</u-th>
						<u-th width="10%" v-for="(item,index) in animalList.titleList">{{item}}</u-th>
					</u-tr>
					<u-tr v-for="(item,index) in animalList.dateList" :key="index">
						<u-td width="30%">{{item.lotteryTime.split(" ")[0].split("-")[0]}}-{{item.period}}</u-td>
						<u-td width="10%" v-for="(childItem,childIndex) in item.numberList" :key="childIndex">
							<span :style="{color: childItem.value=='野' ? 'red' : '' }">{{childItem.value}}</span>
						</u-td>
					</u-tr>
				</u-table>
			</view>
			<view class="weishu" v-if="bottomIndex == 15">
				<u-table>
					<u-tr>
						<u-th width="30%">期号</u-th>
						<u-th width="10%" v-for="(item,index) in lianmaList.titleList">{{item}}</u-th>
					</u-tr>
					<u-tr v-for="(item,index) in lianmaList.dateList" :key="index">
						<u-td width="30%">{{item.lotteryTime.split(" ")[0].split("-")[0]}}-{{item.period}}</u-td>
						<u-td width="10%" v-for="(childItem,childIndex) in item.numberList" :key="childIndex">
							<span :style="{color: childItem.value=='大' ? 'red' : '' }">{{childItem.value}}</span>
						</u-td>
					</u-tr>
				</u-table>
			</view>
			<view class="weishu" v-if="bottomIndex == 16">
				<u-table>
					<u-tr>
						<u-th width="30%">期号</u-th>
						<u-th width="10%" v-for="(item,index) in lianxiaoList.titleList">{{item}}</u-th>
					</u-tr>
					<u-tr v-for="(item,index) in lianxiaoList.dateList" :key="index">
						<u-td width="30%">{{item.lotteryTime.split(" ")[0].split("-")[0]}}-{{item.period}}</u-td>
						<u-td width="10%" v-for="(childItem,childIndex) in item.numberList" :key="childIndex">
							<span :style="{color: childItem.value=='大' ? 'red' : '' }">{{childItem.value}}</span>
						</u-td>
					</u-tr>
				</u-table>
			</view>
		</view>
		<view class="bottom">
			<view class="bottom-body">
				<view class="bottom-box" v-for="(item,index) in bottomNav" :key="index"
					:class="bottomIndex == index ? 'bottomActive' : bottomIndex > 4 && index==4 ? 'bottomActive' : ''"
					@click="bottomActiveChange(index,item)">
					<view class="bottom-box-top" :class="item.name == '更多' ? 'bottom-box-more-top' : ''">
						{{item.mark}}
					</view>
					{{item.name}}
				</view>
			</view>
		</view>
		<!-- 更多 -->
		<u-mask :show="moreShow" @click="moreShow = false">
			<view class="warp">
				<view class="rect" @tap.stop>
					<view class="rect-box" v-for="(item,index) in bottomList" :key="index"
						:class="bottomIndex == index ? 'moreActive' : ''" @click="moreActiveChange(index,item)">
						<image :src="item.img" alt="" mode="widthFix" style="width: 35%;"></image>
						{{item.name}}
					</view>
					<view class="triangle">
					</view>
				</view>
			</view>
		</u-mask>
		<!-- 年份选择 -->
		<u-picker v-model="yearShow" mode="time" :params="{year:true}" :end-year="nowYear" @confirm="yearChange"
			title="年份选择" :default-time="`${year}-01-01`"></u-picker>
		<!-- 统计点击弹窗 -->
		<u-popup v-model="statisticsPopupShow" mode="center">
			<view class="popup-body">
				<view class="title">{{statisticsInfo.title}}</view>
				<view class="text">
					【{{statisticsInfo.key}}】统计的次数 {{statisticsInfo.value}} 次
				</view>
				<view class="btn" @click="statisticsPopupShow = false">
					确定
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				typeList: [],
				typeIndex: 0,
				navbarHeight: 0,
				navigationBarHeight: 0,
				statusBarHeight: 0,
				yearShow: false,
				nowYear: null,
				year: null,
				yearIconShow: false,
				periodShow: true,
				period: "100",
				title: "六合统计",
				bottomIndex: 0,
				moreShow: false,
				libraryInfo: {
					jiaList: [],
					yeList: [],
				},
				// 统计数据
				statisticsData: {},
				statisticsInfo: {
					title: "",
					key: "",
					value: ""
				},
				statisticsPopupShow: false,
				//历史特码,
				specialHotChart: {},
				specialCoodChart: {},
				// 历史正码
				ordinaryHotChart: {},
				ordinaryCoodChart: {},
				// 尾数大小
				mantissaList: {},
				// 家禽野兽
				animalList: {},
				// 连码走势
				lianmaList: {},
				// 连肖走势
				lianxiaoList: {},
				// 饼状图选择
				pieOption: [{
						name: "热图",
					},
					{
						name: "冷图",
					}
				],
				pieNumberOption: [{
						name: "特码",
						key: 2
					},
					{
						name: "正码",
						key: 1
					}
				],
				pieNumberIndex: 0,
				//生肖特码,
				specialPieHotChart: {},
				specialPieCoodChart: {},
				//生肖正码,
				ordinaryPieHotChart: {},
				ordinaryPieCoodChart: {},
				// 波色特码
				specialPieBoseHotChart: {},
				specialPieBoseColdChart: {},
				// 波色正码
				ordinaryPieBoseHotChart: {},
				ordinaryPieBoseColdChart: {},
				// 特码两面
				tmliangMianChart: {},
				// 正码总分
				zmLiangMianChart: {},
				// 特码位数
				specialPieWeishuHotChart: {},
				specialPieWeishuColdChart: {},
				ordinaryPieWeishuHotChart: {},
				ordinaryPieWeishuColdChart: {},
				specialPieBoduanChart: {},
				ordinaryPieBoduanChart: {},
				histogramOpts: {
					color: ["#FF0000"],
					padding: [15, 15, 0, 5],
					enableScroll: false,
					legend: {
						show: false
					},
					xAxis: {
						disableGrid: true
					},
					yAxis: {
						data: [{
							min: 0,
							tofix: "0",
						}]
					},
					extra: {
						column: {
							type: "group",
							width: 30,
							activeBgColor: "#000000",
							activeBgOpacity: 0.08
						}
					}
				},
				pieOpts: {
					rotate: false,
					rotateLock: false,
					color: ["#c23531", "#2f4554", "#61a0a8", "#d48265", "#91c7ae", "#749f83", "#ca8622", "#bda498",
						"#6e7074", "#546570", "#c4ccd3", "#c23531"
					],
					padding: [5, 5, 5, 5],
					dataLabel: true,
					enableScroll: false,
					legend: {
						show: true,
						position: "bottom",
						lineHeight: 25
					},
					title: {
						name: "",
					},
					subtitle: {
						name: "",
					},
					extra: {
						ring: {
							ringWidth: 60,
							customRadius: 120,
							activeOpacity: 0.5,
							activeRadius: 10,
							offsetAngle: 0,
							labelWidth: 15,
							border: true,
							borderWidth: 3,
							borderColor: "#FFFFFF"
						}
					}
				},
				pieIndex: 0,
				hotOpts: {
					color: ["#FF0000", ],
					padding: [15, 10, 0, 15],
					enableScroll: false,
					legend: {
						show: false
					},
					xAxis: {
						disableGrid: true,
					},
					yAxis: {
						gridType: "dash",
						dashLength: 2,
						showTitle: true,
						data: [{
							position: "left",
							title: "(次)",
							tofix: "0"
						}]
					},
					extra: {
						line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
						}
					}
				},
				coodOpts: {
					color: ["#5da1d3", ],
					padding: [15, 10, 0, 15],
					enableScroll: false,
					legend: {
						show: false
					},
					xAxis: {
						disableGrid: true,
					},
					yAxis: {
						gridType: "dash",
						dashLength: 2,
						showTitle: true,
						data: [{
							title: "(次)",
							position: "left",
							tofix: "0",
						}, ]
					},
					extra: {
						line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
						}
					}
				},
				libraryOption: [{
						name: "波色",
					},
					{
						name: "生肖",
					},
					{
						name: "五行",
					},
					{
						name: "家禽野兽",
					}
				],
				libraryIndex: 0,
				bottomNav: [{
					name: '六合统计',
					mark: "统",
				}, {
					name: '属性参照',
					mark: "属",
				}, {
					name: '特码历史',
					mark: "特",
				}, {
					name: '正码历史',
					mark: "正",
				}, {
					name: '更多',
					mark: "	...",
				}, ],
				bottomList: [{
						name: '六合统计',
						img: require('../../static/icon/icon_lhtj_tj.png'),
					},
					{
						name: '属性参照',
						img: require('../../static/icon/icon_lhtj_sx.png'),
					},
					{
						name: '特码历史',
						img: require('../../static/icon/icon_lhtj_tm.png'),
					},
					{
						name: '正码历史',
						img: require('../../static/icon/icon_lhtj_zm.png'),
					},
					{
						name: '尾数大小',
						img: require('../../static/icon/icon_lhtj_ws.png'),
					},
					{
						name: '生肖特码',
						img: require('../../static/icon/icon_lhtj_shenxiao.png'),
					},
					{
						name: '生肖正码',
						img: require('../../static/icon/icon_lhtj_xiao.png'),
					},
					{
						name: '波色特码',
						img: require('../../static/icon/icon_lhtj_se.png'),
					},
					{
						name: '波色正码',
						img: require('../../static/icon/icon_lhtj_bo.png'),
					},
					{
						name: '特码两面',
						img: require('../../static/icon/icon_lhtj_yu.png'),
					},
					{
						name: '特码尾数',
						img: require('../../static/icon/icon_lhtj_ws.png'),
					},
					{
						name: '正码尾数',
						img: require('../../static/icon/icon_lhtj_shu.png'),
					},
					{
						name: '正码总分',
						img: require('../../static/icon/icon_lhtj_fen.png'),
					},
					{
						name: '号码波段',
						img: require('../../static/icon/icon_lhtj_duan.png'),
					},
					{
						name: '家禽野兽',
						img: require('../../static/icon/icon_lhtj_qing.png'),
					},
					{
						name: '连码走势',
						img: require('../../static/icon/icon_lhtj_ma.png'),
					},
					{
						name: '连肖走势',
						img: require('../../static/icon/icon_lhtj_lian.png'),
					},
				]
			}
		},
		onReachBottom() {},
		onLoad() {
			const typeList = uni.getStorageSync('typeList')
			if (typeList) {
				this.typeList = typeList
			}
			this.navigationBarHeight = getApp().globalData.navigationBarHeight;
			this.statusBarHeight = getApp().globalData.statusBarHeight;
			this.year = new Date().getFullYear()
			this.nowYear = new Date().getFullYear()
			this.getLibrary()
			this.getStatistics()
		},
		methods: {
			getStatistics() {
				this.$H.get('lottery/tool/statistics', {
					period: this.period,
					lotteryTypeId: this.typeList[this.typeIndex].lotteryTypeId
				}).then(res => {
					if (res.code == 0) {
						this.statisticsData = res.data
					}
				});
			},
			typeChange(index) {
				this.typeIndex = index
				this.moreActiveChange(this.bottomIndex)
			},
			getLibrary() {
				this.$H.get('lottery/tool/library').then(res => {
					if (res.code == 0) {
						this.libraryInfo = {
							...this.libraryInfo,
							...res.data
						}
						const animalList = res.data.animalTypeList || []
						animalList.forEach(item => {
							item.list.forEach(el => {
								if (item.name == '家禽') {
									if (!this.libraryInfo.jiaList.includes(el.shengXiao)) {
										this.libraryInfo.jiaList.push(el.shengXiao)
									}
								} else {
									if (!this.libraryInfo.yeList.includes(el.shengXiao)) {
										this.libraryInfo.yeList.push(el.shengXiao)
									}
								}
							})
						})
					}
				});
			},
			getNumberStat(type) {
				this.$H.get('lottery/tool/numberStat', {
					type: type,
					period: this.period,
					lotteryTypeId: this.typeList[this.typeIndex].lotteryTypeId
				}).then(res => {
					if (res.code == 0) {
						let hotObj = {
							key: [],
							value: []
						}
						res.data.hot.list.forEach((item, index) => {
							if (index < 17) {
								hotObj.key.push(item.key)
								hotObj.value.push(item.value)
							}
						})
						let chartHotData = {
							categories: [...hotObj.key],
							series: [{
								data: [...hotObj.value],
								textColor: "#FF0000",
							}, ]
						};
						let codeObj = {
							key: [],
							value: []
						}
						res.data.cold.list.forEach((item, index) => {
							if (index < 17) {
								codeObj.key.push(item.key)
								codeObj.value.push(item.value)
							}
						})

						let chartColdData = {
							categories: [...codeObj.key],
							series: [{
								data: [...codeObj.value],
								textColor: "#5da1d3",
							}, ]
						};
						if (type == 2) {
							this.specialCoodChart = JSON.parse(JSON.stringify(chartColdData));
							this.specialHotChart = JSON.parse(JSON.stringify(chartHotData));
						} else {
							this.ordinaryHotChart = JSON.parse(JSON.stringify(chartHotData));
							this.ordinaryCoodChart = JSON.parse(JSON.stringify(chartColdData));
						}
					}
				})
			},
			getTailBigSmall() {
				this.$H.get('lottery/tool/tailBigSmall', {
					year: this.year,
					lotteryTypeId: this.typeList[this.typeIndex].lotteryTypeId
				}).then(res => {
					if (res.code == 0) {
						this.mantissaList = res.data
					}
				});
			},
			pieChange(index) {
				this.pieIndex = index
			},
			pieNumberChange(index, item) {
				this.pieNumberIndex = index
				this.getNumberRange(item.key)
			},
			getShenxiao(type) {
				this.$H.get('lottery/tool/animalStat', {
					type: type,
					period: this.period,
					lotteryTypeId: this.typeList[this.typeIndex].lotteryTypeId
				}).then(res => {
					if (res.code == 0) {
						let hotList = []
						let hotSum = 0
						res.data.hot.list.forEach((item, index) => {
							hotSum += item.value
						})
						res.data.hot.list.forEach((item, index) => {
							hotList.push({
								name: item.key,
								value: item.value,
								hotSum: hotSum
							})
						})
						let specialhotChart = {
							series: [{
								data: [...hotList],
								format: 'pieWrap',
							}]
						};
						let coldList = []
						let coldSum = 0
						res.data.cold.list.forEach((item, index) => {
							coldSum += item.value
						})
						res.data.cold.list.forEach((item, index) => {
							coldList.push({
								name: item.key,
								value: item.value,
								coldSum: coldSum
							})
						})
						let specialcoldChart = {
							series: [{
								data: [...coldList],
								format: 'pieWrap',
							}]
						};
						if (type == 2) {
							this.specialPieHotChart = JSON.parse(JSON.stringify(specialhotChart));
							this.specialPieCoodChart = JSON.parse(JSON.stringify(specialcoldChart));
						} else {
							this.ordinaryPieHotChart = JSON.parse(JSON.stringify(specialhotChart));
							this.ordinaryPieCoodChart = JSON.parse(JSON.stringify(specialcoldChart));
						}
					}
				});
			},
			getBose(type) {
				this.$H.get('lottery/tool/colorStat', {
					type: type,
					period: this.period,
					lotteryTypeId: this.typeList[this.typeIndex].lotteryTypeId
				}).then(res => {
					if (res.code == 0) {
						let hotList = []
						let hotSum = 0
						res.data.hot.list.forEach((item, index) => {
							hotSum += item.value
						})
						res.data.hot.list.forEach((item, index) => {
							hotList.push({
								name: item.key,
								value: item.value,
								hotSum: hotSum
							})
						})
						let specialhotChart = {
							series: [{
								data: [...hotList],
								format: 'pieWrap',
							}]
						};
						let coldList = []
						let coldSum = 0
						res.data.cold.list.forEach((item, index) => {
							coldSum += item.value
						})
						res.data.cold.list.forEach((item, index) => {
							coldList.push({
								name: item.key,
								value: item.value,
								coldSum: coldSum
							})
						})
						let specialcoldChart = {
							series: [{
								data: [...coldList],
								format: 'pieWrap',
							}]
						};
						if (type == 2) {
							this.specialPieBoseHotChart = JSON.parse(JSON.stringify(specialhotChart));
							this.specialPieBoseColdChart = JSON.parse(JSON.stringify(specialcoldChart));
						} else {
							this.ordinaryPieBoseHotChart = JSON.parse(JSON.stringify(specialhotChart));
							this.ordinaryPieBoseColdChart = JSON.parse(JSON.stringify(specialcoldChart));
						}
					}
				});
			},
			getNumberAnalyze(type) {
				this.$H.get('lottery/tool/numberAnalyze', {
					period: this.period,
					type: type,
					lotteryTypeId: this.typeList[this.typeIndex].lotteryTypeId
				}).then(res => {
					if (res.code == 0) {
						let chartObj = {
							key: [],
							value: []
						}
						res.data.forEach((item, index) => {
							chartObj.key.push(item.key)
							chartObj.value.push(item.value)
						})
						let chart = {
							categories: [...chartObj.key],
							series: [{
								name: "",
								data: [...chartObj.value],

							}]
						};
						if (type == 2) {
							this.tmliangMianChart = JSON.parse(JSON.stringify(chart));
						} else {
							this.zmLiangMianChart = JSON.parse(JSON.stringify(chart));
						}
					}
				});
			},
			getTailStat(type) {
				this.$H.get('lottery/tool/tailStat', {
					type: type,
					period: this.period,
					lotteryTypeId: this.typeList[this.typeIndex].lotteryTypeId
				}).then(res => {
					if (res.code == 0) {
						let hotList = []
						let hotSum = 0
						res.data.hot.list.forEach((item, index) => {
							hotSum += item.value
						})
						res.data.hot.list.forEach((item, index) => {
							hotList.push({
								name: item.key + "尾",
								value: item.value,
								hotSum: hotSum
							})
						})
						let specialhotChart = {
							series: [{
								data: [...hotList],
								format: 'pieWrap',
							}]
						};
						let coldList = []
						let coldSum = 0
						res.data.cold.list.forEach((item, index) => {
							coldSum += item.value
						})
						res.data.cold.list.forEach((item, index) => {
							coldList.push({
								name: item.key + "尾",
								value: item.value,
								coldSum: coldSum
							})
						})
						let specialcoldChart = {
							series: [{
								data: [...coldList],
								format: 'pieWrap',
							}]
						};
						if (type == 2) {
							this.specialPieWeishuHotChart = JSON.parse(JSON.stringify(specialhotChart));
							this.specialPieWeishuColdChart = JSON.parse(JSON.stringify(specialcoldChart));
						} else {
							this.ordinaryPieWeishuHotChart = JSON.parse(JSON.stringify(specialhotChart));
							this.ordinaryPieWeishuColdChart = JSON.parse(JSON.stringify(specialcoldChart));
						}
					}
				});
			},
			getNumberRange(type) {
				this.$H.get('lottery/tool/numberRange', {
					type: type,
					period: this.period,
					lotteryTypeId: this.typeList[this.typeIndex].lotteryTypeId
				}).then(res => {
					if (res.code == 0) {
						let chartList = []
						let hotSum = 0
						res.data.forEach((item, index) => {
							hotSum += item.value
						})
						res.data.forEach((item, index) => {
							chartList.push({
								name: item.key,
								value: item.value,
								hotSum: hotSum
							})
						})
						let chart = {
							series: [{
								data: [...chartList],
								format: 'pieNumberWrap',
							}]
						};
						if (type == 2) {
							this.specialPieBoduanChart = JSON.parse(JSON.stringify(chart));
						} else {
							this.ordinaryPieBoduanChart = JSON.parse(JSON.stringify(chart));
						}
					}
				});
			},
			getconsecutiveStat() {
				this.$H.get('lottery/tool/consecutiveStat', {
					year: this.year,
					lotteryTypeId: this.typeList[this.typeIndex].lotteryTypeId
				}).then(res => {
					if (res.code == 0) {
						this.lianmaList = res.data
					}
				});
			},
			getanimalAnalyze() {
				this.$H.get('lottery/tool/animalAnalyze', {
					year: this.year,
					lotteryTypeId: this.typeList[this.typeIndex].lotteryTypeId
				}).then(res => {
					if (res.code == 0) {
						this.animalList = res.data
					}
				});
			},
			getConsecutiveAnimalStat() {
				this.$H.get('lottery/tool/consecutiveAnimalStat', {
					year: this.year,
					lotteryTypeId: this.typeList[this.typeIndex].lotteryTypeId
				}).then(res => {
					if (res.code == 0) {
						this.lianxiaoList = res.data
					}
				});
			},
			yearPicker() {
				this.yearShow = true
			},
			goBack() {
				uni.navigateBack({
					delta: 1
				});
			},
			bottomActiveChange(index, item) {
				this.pieIndex = 0
				this.period = 100
				this.year = new Date().getFullYear()
				if (index == 4) {
					this.moreShow = true
					return
				}
				if (index == 0) {
					this.getStatistics()
					this.yearIconShow = false
				} else if (index == 1) {
					this.yearIconShow = false
					this.periodShow = false
				} else if (index == 2) {
					this.yearIconShow = false
					this.periodShow = true
					this.getNumberStat(2)
				} else if (index == 3) {
					this.yearIconShow = false
					this.periodShow = true
					this.getNumberStat(1)
				}
				this.title = item.name
				this.bottomIndex = index
			},
			moreActiveChange(index, item) {
				this.pieIndex = 0
				this.period = 100
				this.year = new Date().getFullYear()
				this.bottomIndex = index
				this.title = item ? item.name : this.title
				if (index == 0) {
					this.getStatistics()
					this.yearIconShow = false
				} else if (index == 1) {
					this.yearIconShow = false
					this.periodShow = false
				} else if (index == 2) {
					this.yearIconShow = false
					this.periodShow = true
					this.getNumberStat(2)
				} else if (index == 3) {
					this.yearIconShow = false
					this.periodShow = true
					this.getNumberStat(1)
				} else if (index == 4) {
					this.yearIconShow = true
					this.periodShow = false
					this.getTailBigSmall()
				} else if (index == 5) {
					this.yearIconShow = false
					this.periodShow = true
					this.getShenxiao(2)
				} else if (index == 6) {
					this.yearIconShow = false
					this.periodShow = true
					this.getShenxiao(1)
				} else if (index == 7) {
					this.yearIconShow = false
					this.periodShow = true
					this.getBose(2)
				} else if (index == 8) {
					this.yearIconShow = false
					this.periodShow = true
					this.getBose(1)
				} else if (index == 9) {
					this.yearIconShow = false
					this.periodShow = true
					this.getNumberAnalyze(2)
				} else if (index == 10) {
					this.yearIconShow = false
					this.periodShow = true
					this.getTailStat(2)
				} else if (index == 11) {
					this.yearIconShow = false
					this.periodShow = true
					this.getTailStat(1)
				} else if (index == 12) {
					this.yearIconShow = false
					this.periodShow = true
					this.getNumberAnalyze(1)
				} else if (index == 13) {
					this.yearIconShow = false
					this.periodShow = true
					this.getNumberRange(2)
				} else if (index == 14) {
					this.yearIconShow = true
					this.periodShow = false
					this.getanimalAnalyze()
				} else if (index == 15) {
					this.yearIconShow = true
					this.periodShow = false
					this.getconsecutiveStat()
				} else if (index == 16) {
					this.yearIconShow = true
					this.periodShow = false
					this.getConsecutiveAnimalStat()
				}
				this.moreShow = false
			},
			periodOnChange() {
				if (this.bottomIndex == 0) {
					this.getStatistics()
					this.yearIconShow = false
				}  else if (this.bottomIndex == 2) {
					this.getNumberStat(2)
				} else if (this.bottomIndex == 3) {
					this.getNumberStat(1)
				} else if (this.bottomIndex == 4) {
					this.getTailBigSmall()
				} else if (this.bottomIndex == 5) {
					this.getShenxiao(2)
				} else if (this.bottomIndex == 6) {
					this.getShenxiao(1)
				} else if (this.bottomIndex == 7) {
					this.getBose(2)
				} else if (this.bottomIndex == 8) {
					this.getBose(1)
				} else if (this.bottomIndex == 9) {
					this.getNumberAnalyze(2)
				} else if (this.bottomIndex == 10) {
					this.getTailStat(2)
				} else if (this.bottomIndex == 11) {
					this.getTailStat(1)
				} else if (this.bottomIndex == 12) {
					this.getNumberAnalyze(1)
				} else if (this.bottomIndex == 13) {
					this.getNumberRange(2)
				} else if (this.bottomIndex == 14) {
					this.getanimalAnalyze()
				} else if (this.bottomIndex == 15) {
					this.getconsecutiveStat()
				} else if (this.bottomIndex == 16) {
					this.getConsecutiveAnimalStat()
				}

			},
			yearChange(date) {
				this.year = date.year
			if (this.bottomIndex == 4) {
					this.getTailBigSmall()
				} else if (this.bottomIndex == 5) {
					this.getShenxiao(2)
				} else if (this.bottomIndex == 6) {
					this.getShenxiao(1)
				} else if (this.bottomIndex == 7) {
					this.getBose(2)
				} else if (this.bottomIndex == 8) {
					this.getBose(1)
				} else if (this.bottomIndex == 9) {
					this.getNumberAnalyze(2)
				} else if (this.bottomIndex == 10) {
					this.getTailStat(2)
				} else if (this.bottomIndex == 11) {
					this.getTailStat(1)
				} else if (this.bottomIndex == 12) {
					this.getNumberAnalyze(1)
				} else if (this.bottomIndex == 13) {
					this.getNumberRange(2)
				} else if (this.bottomIndex == 14) {
					this.getanimalAnalyze()
				} else if (this.bottomIndex == 15) {
					this.getconsecutiveStat()
				} else if (this.bottomIndex == 16) {
					this.getConsecutiveAnimalStat()
				}
			},
			libraryChange(index) {
				this.libraryIndex = index
			},
			handleStatistics(text, item) {
				this.statisticsInfo.title = text
				this.statisticsInfo.key = item.key
				this.statisticsInfo.value = item.value
				this.statisticsPopupShow = true
			}
		}
	}
</script>
<style>
	page {
		background-color: #fff !important;
	}
</style>
<style lang="scss" scoped>
	
	page {
		width: 100%;
		height: 100%;
	}
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
	.index-con {
		// background-color: white;
		height: 100%;
		background-color: #f5f5f5;
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

	.right {
		display: flex;
		align-items: center;
		font-size: 24rpx;
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
		.library {
			width: 100%;

			.top {
				width: 100%;
				display: flex;
				padding: 24rpx 50rpx;
				justify-content: space-between;
				font-size: 34rpx;
				background-color: white;

				.library-active {
					color: #07C160;
				}
			}

			.color {
				width: 100%;
				background-color: white;
				margin-top: 24rpx;

				.color-box {
					border-bottom: 1px solid #eeeeee;
					padding: 24rpx;

					.color-title {
						font-size: 28rpx;
					}

					.color-content {
						width: 100%;
						display: flex;
						flex-wrap: wrap;
					}
				}

				.shengxiao-box {
					display: flex;
					align-items: center;
					padding: 0 24rpx;
					padding-bottom: 24rpx;

					.color-title {
						font-size: 32rpx;
						margin-right: 24rpx;
						margin-top: 12rpx;
					}
				}

				.animal-title {
					width: 100rpx;
					margin-top: 0 !important;
				}
			}
		}

		.pie {
			.top {
				.top-box {
					width: 50%;
					text-align: center;
				}
			}

			.pie-box {
				margin-top: 100rpx;
				width: 100%;
				height: 800rpx;
			}
		}
	}

	.search {
		display: flex;
		align-items: center;
		padding: 18rpx 24rpx;
		background-color: #f5f5f5;
	}

	.informationd_body {
		width: 100%;
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
		margin-top: 42rpx;
		padding: 0 24rpx;

		.informationd_box {
			width: 28%;
			border: 1px solid #aaaaaa;
			text-align: center;
			margin-bottom: 32rpx;
			font-size: 28rpx;
			color: #bbbbbb;
		}
	}

	.bottom {
		width: 100%;
		position: fixed;
		bottom: 0;

		.bottom-body {
			display: flex;
			align-items: center;
			background-color: white;
			border-top: 1px solid #f5f5f5;
			box-shadow: 0 -3rpx #f9f9f9;

			.bottom-box {
				width: 20%;
				display: flex;
				flex-direction: column;
				align-items: center;
				padding: 12rpx 0;
				font-size: 24rpx;

				.bottom-box-top {
					color: white;
					text-align: center;
					background-color: #07C160;
					width: 50rpx;
					height: 50rpx;
					border-radius: 50rpx;
					line-height: 50rpx;
					font-size: 30rpx;
				}

				.bottom-box-more-top {
					line-height: 32rpx;
				}
			}
		}
	}

	.bottomActive {
		background-color: #f5f5f5;
	}

	::v-deep .u-input__input {
		font-size: 24rpx;
	}

	.warp {
		width: 100%;
		position: fixed;
		bottom: 180rpx;
		display: flex;
		justify-content: center;
	}

	.rect {
		background-color: #fff;
		position: relative;
		width: 94%;
		display: flex;
		flex-wrap: wrap;
		padding: 20rpx 0;

		.rect-box {
			width: 25%;
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 26rpx;
			padding: 12rpx 0;
		}

		.moreActive {
			background-color: #f5f5f5;
		}

		.triangle {
			position: absolute;
			bottom: -70rpx;
			right: 15rpx;
			right: 0;
			width: 0;
			height: 0;
			border-top: 40rpx solid white;
			border-right: 40rpx solid transparent;
			border-left: 40rpx solid transparent;
			border-bottom: 40rpx solid transparent;
		}
	}

	.platform_data_box {
		display: flex;

		.platform_data_ball {
			margin-right: 24rpx;
			margin-top: 18rpx;

			.number {
				width: 60rpx;
				height: 60rpx;
				border-radius: 50rpx;
				position: relative;

				.ball_big {
					width: 45rpx;
					height: 45rpx;
					border-radius: 50rpx;
					background-color: white;
					position: absolute;
					top: 4rpx;
					left: 4rpx;
					text-align: center;
					line-height: 45rpx;
					color: #666;
					font-weight: bold;
					font-size: 20rpx;
				}

				.ball_small {
					width: 10rpx;
					height: 10rpx;
					background-color: white;
					position: absolute;
					bottom: 12rpx;
					right: 8rpx;
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
			font-size: 26rpx;
			color: #666;
			margin-top: 6rpx;
			display: flex;
			justify-content: center;
		}
	}

	.special {
		.title {
			color: #07C160;
			text-align: center;
			font-size: 38rpx;
		}

		.text {
			margin-left: 24rpx;
			margin-top: 24rpx;
			font-size: 30rpx;
		}

		.charts-box {
			position: relative;
			background-color: white;
			margin-top: 24rpx;
			padding: 16rpx;

			.xTitle {
				position: absolute;
				bottom: 5rpx;
				left: 10rpx;
				font-size: 24rpx;
				font-weight: bold;
			}
		}
	}

	.statistics {
		width: 100%;

		.statistics-box {
			background-color: white;
			padding: 12rpx 24rpx;

			p {
				font-size: 28rpx;
			}

			.color-content {
				display: flex;

				.number {
					width: 50rpx;
					height: 50rpx;
					border-radius: 50rpx;
					position: relative;

					.ball_big {
						width: 35rpx;
						height: 35rpx;
						border-radius: 50rpx;
						background-color: white;
						position: absolute;
						top: 4rpx;
						left: 4rpx;
						text-align: center;
						line-height: 35rpx;
						color: #666;
						font-weight: bold;
						font-size: 20rpx;
					}

					.ball_small {
						width: 10rpx;
						height: 10rpx;
						background-color: white;
						position: absolute;
						bottom: 12rpx;
						right: 8rpx;
						border-radius: 50%;
						transform: rotate(135deg) scale(1, 0.5);
					}
				}
			}
		}
	}

	.popup-body {
		width: 650rpx;
		height: 300rpx;
		padding: 24rpx 48rpx;

		.title {
			font-size: 28rpx;
			color: red;
			text-align: center;
		}

		.text {
			font-size: 32rpx;
			text-align: center;
			padding: 48rpx 0;
		}

		.btn {
			border-top: 1px solid #666;
			text-align: center;
			color: #07C160;
		}
	}

	.statistics-box-two {
		margin-top: 24rpx;

		.statistics-box-contant {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.title {
				width: 50%;
				font-size: 26rpx;
			}

			.content-box {
				width: 50%;
				display: flex;

				.content_data_box {
					margin-left: 24rpx;
					font-size: 28rpx;
					font-weight: bold;
				}
			}
		}
	}

	.red {
		color: rgb(255, 51, 51);
	}

	.blue {
		color: rgb(51, 153, 255);
	}

	.green {
		color: rgb(19, 203, 70);
	}

	::v-deep .u-content {
		padding: 0 !important;
	}
</style>