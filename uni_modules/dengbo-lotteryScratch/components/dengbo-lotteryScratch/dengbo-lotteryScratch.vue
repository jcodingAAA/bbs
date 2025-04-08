<template>
  <view class="scratchCard" style="width: 100%; height: 100%">
    <view class="scratchCard-content">
      <slot name="backgroundCard" v-if="$slots && $slots.backgroundCard"></slot>
      <image v-else :src="backgroundCard" style="width: 100%; height: 100%"></image>
      <view class="lights-container">
        <view
          v-for="(light, index) in lights"
          :key="index"
          class="light"
          :style="[getLightStyle(light, index)]"
        >
          <image
            v-if="lightImgs.length > 0"
            :src="getCurrentImage(light.colorIndex)"
            style="width: 100%; height: 100%; position: absolute; left: 0; right: 0"
          />
        </view>
      </view>
      <view class="scratchCard-content-value" :style="{ backgroundColor: backendColor||'unset'}">
        <view class="content" id="canvas">
          <view class="option0" :class="{ option1: ready }">
            <slot name="scratch-value"></slot>
          </view>
          <canvas
            :style="{ width: width + 'px', height: height + 'px' }"
            class="canvas"
            :disable-scroll="true"
            @touchstart="touchstart"
            @touchend="touchend"
            @touchmove="touchmove"
            canvas-id="scratch-card"
          >
          </canvas>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  // 声明全局 canvas 上下文变量
  let ctx = null;
  /**
   * @property {Number} percentage 刮开百分比触发开奖（默认45）
   * @property {Boolean} disabled 是否禁止刮卡（默认false）
   * @property {Number} touchSize 触摸画笔大小（默认20）
   * @property {String} backgroundImage 背景图
   * @property {String} fillColor 未刮开图层的填充色（默认#ddd）
   * @property {String} watermarkTxt 水印文字
   * @property {String} watermarkColor 水印文字颜色（默认#c5c5c5）
   * @property {Number} watermarkSize 水印文字大小（默认14）
   * @property {String} watermarkImage 水印图片
   * @property {Number} watermarkSizeImage 水印图片大小（默认50）
   * @property {Object} lightConfig 闪光灯配置
   * @property {Array} lightImgs 图片闪光灯
   */
  export default {
    props: {
      //刮卡背景图
      backgroundCard: {
        type: String,
        default: '',
      },
      backendColor: {
        type: String,
      },
      percentage: {
        // 刮开百分比触发开奖
        type: Number,
        default: 45,
      },
      disabled: {
        // 是否禁止刮卡
        type: Boolean,
        default: false,
      },
      touchSize: {
        // 触摸画笔大小
        type: Number,
        default: 20,
      },
      //背景图 URL
      backgroundImage: {
        type: String,
        default: '',
      },
      fillColor: {
        // 未刮开图层的填充色
        type: String,
        default: '#ddd',
      },
      watermarkTxt: {
        // 水印文字
        type: String,
        default: '',
      },
      watermarkColor: {
        // 水印文字颜色
        type: String,
        default: '#c5c5c5',
      },
      watermarkSize: {
        // 水印文字大小
        type: Number,
        default: 14,
      },
      watermarkImage: {
        // 水印图片
        type: String,
        default: '', // 水印图片的
      },
      watermarkSizeImage: {
        // 水印图片大小
        type: Number,
        default: 20, // 调整默认值以适应图片大小
      },
      lightConfig: {
        type: Object,
        default() {
          return {
            totalLights: 16,
            margin: '37',
            lightSize: '30rpx',
            animationSpeed: 1000, // 新增：动画速度，单位为毫秒
          };
        },
      },
      lightColors: {
        type: Array,
        default() {
          return ['#FF0000', '#FFFF00'];
        },
      },
      // 新增：支持图片闪光灯
      lightImgs: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    data() {
      return {
        ready: false, // 组件是否准备就绪
        viewWidth: 0, // 刮卡宽度
        viewHeight: 0, // 刮卡高度
        width: 0, // 画布宽度
        height: 0, // 画布高度
        startX: null, // 触摸起始 X 坐标
        startY: null, // 触摸起始 Y 坐标
        computing: false, // 是否正在计算刮开百分比
        complete: false, // 是否完成刮卡
        reset: false, // 是否重置

        lights: [],
        animationInterval: null,
        currentAnimationStep: 0,
      };
    },
    computed: {},
    mounted() {
      // 创建画布上下文
      ctx = uni.createCanvasContext('scratch-card', this);
      // 获取刮卡视图尺寸
      this.getViewRect();
      // 通过刮卡内容获取画布尺寸
      this.getRect();
      this.startLightAnimation();
    },
    beforeDestroy() {
      this.stopLightAnimation();
    },
    methods: {
      getViewRect() {
        const query = uni.createSelectorQuery().in(this);
        // 选择 id 为 canvas 的元素并获取其边界信息
        query
          .select('.scratchCard')
          .boundingClientRect((data) => {
            // 设置画布宽度
            this.viewWidth = data.width;
            // 设置画布高度
            this.viewHeight = data.height;
            // 延迟初始化以确保尺寸已经设置
            setTimeout((e) => {
              // 调用初始化方法
              this.generateLights();
            }, 20);
          })
          .exec(); // 执行查询
      },
      // 获取画布尺寸
      getRect() {
        // 创建选择器查询对象
        const query = uni.createSelectorQuery().in(this);
        // 选择 id 为 canvas 的元素并获取其边界信息
        query
          .select('#canvas')
          .boundingClientRect((data) => {
            // 设置画布宽度
            this.width = data.width;
            // 设置画布高度
            this.height = data.height;
            // 延迟初始化以确保尺寸已经设置
            setTimeout((e) => {
              // 调用初始化方法
              this.init();
              // this.generateLights();
            }, 20);
          })
          .exec(); // 执行查询
      },
      // 初始化画布
      init() {
        // 重置计算状态
        this.computing = false;
        // 重置完成状态
        this.complete = false;
        // 重置重置状态
        this.reset = false;
        // 重置准备状态
        this.ready = false;
        // 清除整个画布
        ctx.clearRect(0, 0, this.width, this.height);

        // 如果有背景图，先绘制背景图
        if (this.backgroundImage) {
          this.drawBackgroundImage();
        } else {
          // 如果没有背景图，则填充颜色
          // 设置填充颜色
          ctx.setFillStyle(this.fillColor);
          // 填充整个画布
          ctx.fillRect(0, 0, this.width, this.height);
          // 绘制水印
          this.fillWatermark();
          // 将之前的绘制操作应用到画布上
          ctx.draw();
        }
        // 标记组件为准备就绪
        setTimeout(() => {
          this.ready = true;
        }, 200);
      },
      // 新增：绘制背景图方法
      drawBackgroundImage() {
        uni.getImageInfo({
          src: this.backgroundImage,
          success: (res) => {
            // 绘制背景图
            ctx.drawImage(this.backgroundImage, 0, 0, this.width, this.height);
            // 绘制完背景图后，继续绘制其他内容
            this.fillWatermark();
            ctx.draw();
          },
          fail: (err) => {
            console.error('Failed to load background image:', err);
            // 如果背景图加载失败，使用填充颜色
            ctx.setFillStyle(this.fillColor);
            ctx.fillRect(0, 0, this.width, this.height);
            this.fillWatermark();
            ctx.draw();
          },
        });
      },
      // 填充水印（文字或图片）
      fillWatermark() {
        // 如果有水印图片，则绘制图片水印
        if (this.watermarkImage) {
          this.fillWatermarkImage();
          // 否则如果有水印文字，则绘制文字水印
        } else if (this.watermarkTxt) {
          this.fillWatermarkText();
        }
      },
      // 绘制文字水印
      fillWatermarkText() {
        // 如果没有水印文字，直接返回
        if (!this.watermarkTxt) {
          return;
        }
        // 计算水印文字的宽度
        var width = this.watermarkTxt.length * this.watermarkSize;
        // 保存当前绘图状态
        ctx.save();
        // 旋转画布 -10 度
        ctx.rotate((-10 * Math.PI) / 180);
        // 初始化绘制位置和计数器
        let x = 0;
        let y = 0;
        let i = 0;
        // 循环绘制水印文字
        while ((x <= this.width * 5 || y <= this.height * 5) && i < 300) {
          // 设置填充颜色
          ctx.setFillStyle(this.watermarkColor);
          // 设置字体大小
          ctx.setFontSize(this.watermarkSize);
          // 绘制文字
          ctx.fillText(this.watermarkTxt, x, y);
          // 更新 x 坐标
          x += width + width * 1.6;
          // 如果 x 超出画布宽度，换行
          if (x > this.width && y <= this.height) {
            x = -Math.random() * 100;
            y += this.watermarkSize * 3;
          }
          // 增加计数器
          i++;
        }
        // 恢复之前保存的绘图状态
        ctx.restore();
      },

      // 绘制图片水印
      fillWatermarkImage() {
        // 如果没有水印图片，直接返回
        if (!this.watermarkImage) {
          return;
        }
        // 定义绘制水印的函数
        const drawWatermark = (path) => {
          // 保存当前绘图状态
          ctx.save();
          // 旋转画布 -10 度
          ctx.rotate((-10 * Math.PI) / 180);
          // 初始化绘制位置和计数器
          let x = 0;
          let y = 0;
          let i = 0;
          // 循环绘制水印图片
          while ((x <= this.width * 5 || y <= this.height * 5) && i < 300) {
            // 绘制图片
            ctx.drawImage(path, x, y, this.watermarkSizeImage, this.watermarkSizeImage);
            // 更新 x 坐标
            x += this.watermarkSizeImage * 2.6;
            // 如果 x 超出画布宽度，换行
            if (x > this.width && y <= this.height) {
              x = -Math.random() * 100;
              y += this.watermarkSizeImage * 2;
            }
            // 增加计数器
            i++;
          }
          // 恢复之前保存的绘图状态
          ctx.restore();
          // 将之前的绘制操作应用到画布上
          ctx.draw(true);
        };

        // 加载图片
        uni.getImageInfo({
          src: this.watermarkImage,
          success: (res) => {
            // 调用绘制水印函数
            drawWatermark(this.watermarkImage);
          },
          fail: (err) => {
            // 打印加载失败错误
            console.error('Failed to load watermark image:', err);
          },
        });
      },
      // 触摸开始事件处理
      touchstart(e) {
        // 如果禁用了刮卡功能，直接返回
        if (this.disabled) {
          return;
        }
        // 记录触摸起始点的 X 坐标
        this.startX = e.touches[0].x;
        // 记录触摸起始点的 Y 坐标
        this.startY = e.touches[0].y;
      },

      // 触摸结束事件处理
      touchend(e) {
        // 获取已刮开的百分比
        this.getFilledPercentage();
      },

      // 触摸移动事件处理
      touchmove(e) {
        // 如果已完成或禁用了刮卡功能，直接返回
        if (this.complete || this.disabled) {
          return;
        }
        // 移动画笔到起始点
        ctx.moveTo(this.startX, this.startY);
        // 清除触摸区域的矩形
        ctx.clearRect(this.startX, this.startY, this.touchSize, this.touchSize);
        // 将之前的绘制操作应用到画布上
        ctx.draw(true);
        // 更新触摸点的 X 坐标
        this.startX = e.touches[0].x;
        // 更新触摸点的 Y 坐标
        this.startY = e.touches[0].y;
      },
      // 获取已刮开的百分比
      getFilledPercentage() {
        // 如果正在计算中，直接返回
        if (this.computing) {
          return;
        }
        // 标记为正在计算
        this.computing = true;
        // 获取画布图像数据
        uni.canvasGetImageData(
          {
            canvasId: 'scratch-card',
            x: 0,
            y: 0,
            width: this.width,
            height: this.height,
            success: (res) => {
              // 获取像素数据
              let pixels = res.data;
              let transPixels = [];
              // 遍历像素数据，统计透明像素
              for (let i = 0; i < pixels.length; i += 4) {
                if (pixels[i + 3] < 128) {
                  transPixels.push(pixels[i + 3]);
                }
              }
              // 计算透明像素百分比
              var percent = ((transPixels.length / (pixels.length / 4)) * 100).toFixed(2);
              // 如果达到指定百分比，触发成功事件
              if (percent >= this.percentage) {
                this.success();
              }
              // 标记计算完成
              this.computing = false;
              // 打印百分比
              console.log(percent);
            },
            fail: (e) => {
              // 打印失败信息
              console.log(e);
            },
          },
          this,
        );
      },
      // 刮卡完成处理
      success() {
        // 标记为完成状态
        this.complete = true;
        // 如果已经重置，直接返回
        if (this.reset) {
          return;
        }
        // 标记为已重置
        this.reset = true;
        // 移动画笔到原点
        ctx.moveTo(0, 0);
        // 清除整个画布
        ctx.clearRect(0, 0, this.width, this.height);
        // 描边
        ctx.stroke();
        // 将之前的绘制操作应用到画布上
        ctx.draw(true);
        // 触发完成事件
        this.$emit('complete', {});
      },
      generateLights() {
        const { totalLights, margin, lightSize } = this.lightConfig;
        const adjustedMargin = parseFloat(margin);
        const adjustedLightSize = parseFloat(lightSize);

        const width = this.viewWidth - 2 * adjustedMargin;
        const height = this.viewHeight - 2 * adjustedMargin;

        // 计算每边的灯数（不包括最后一个灯）
        const perimeter = 2 * (width + height);
        const topLights = Math.round((width / perimeter) * totalLights);
        const rightLights = Math.round((height / perimeter) * totalLights);
        const bottomLights = Math.round((width / perimeter) * totalLights);
        const leftLights = totalLights - topLights - rightLights - bottomLights;
        console.log(leftLights, topLights, rightLights, bottomLights);

        // 初始化灯数组
        this.lights = [];

        // 生成顶部的灯（不包括最后一个）
        for (let i = 0; i < topLights; i++) {
          this.lights.push({
            left: `${adjustedMargin + (width / topLights) * i}px`,
            top: `${adjustedMargin}px`,
            colorIndex: this.lights.length % (this.lightImgs.length || this.lightColors.length),
          });
        }

        // 修改右侧的灯生成
        for (let i = 0; i < rightLights; i++) {
          this.lights.push({
            right: `${adjustedMargin}px`,
            top: `${adjustedMargin + (height / rightLights) * i}px`,
            colorIndex: this.lights.length % (this.lightImgs.length || this.lightColors.length),
            position: 'right', // 添加位置标记
          });
        }

        // 修改底部的灯生成
        for (let i = 0; i < bottomLights; i++) {
          this.lights.push({
            right: `${adjustedMargin + (width / bottomLights) * i}px`,
            bottom: `${adjustedMargin}px`,
            colorIndex: this.lights.length % (this.lightImgs.length || this.lightColors.length),
            position: 'bottom', // 添加位置标记
          });
        }

        // 生成左侧的灯（不包括最后一个，因为它就是第一个顶部的灯）
        for (let i = 0; i < leftLights; i++) {
          this.lights.push({
            left: `${adjustedMargin}px`,
            bottom: `${adjustedMargin + (height / leftLights) * i}px`,
            colorIndex: this.lights.length % (this.lightImgs.length || this.lightColors.length),
            position: 'left', // 添加位置标记
          });
        }

        // // 如果有图片，预加载图片
        // if (this.lightImgs.length > 0) {
        // 	this.preloadImages();
        // }
      },
      // preloadImages() {
      // 	this.lightImages = this.lightImgs.map(src => {
      // 		const img = new Image();
      // 		img.src = src;
      // 		return img;
      // 	});
      // },
      getLightStyle(light, index) {
        const style = {
          width: this.lightConfig.lightSize,
          height: this.lightConfig.lightSize,
          position: 'absolute',
          transition: 'opacity 0.5s',
        };

        if (light.position === 'right') {
          style.right = light.right;
          style.top = light.top;
          style.transform = 'translate(50%, -50%)'; // 修改右侧灯的变换
        } else if (light.position === 'bottom') {
          style.right = light.right;
          style.bottom = light.bottom;
          style.transform = 'translate(50%, 50%)'; // 修改底部灯的变换
        } else if (light.position === 'left') {
          style.left = light.left;
          style.bottom = light.bottom;
          style.transform = 'translate(-50%, 50%)'; // 修改底部灯的变换
        } else {
          style.left = light.left;
          style.top = light.top;
          style.right = light.right;
          style.bottom = light.bottom;
          style.transform = 'translate(-50%, -50%)';
        }

        if (this.lightImgs.length === 0) {
          style.backgroundColor = this.getCurrentColor(light.colorIndex);
        }

        return style;
      },
      getCurrentColor(colorIndex) {
        if (this.lightImgs.length > 0) return ''; // 如果有图片，不返回颜色
        const totalSteps = this.lightColors.length;
        const currentStep = this.currentAnimationStep % totalSteps;
        const currentColorIndex = (colorIndex + currentStep) % totalSteps;
        return this.lightColors[currentColorIndex];
      },
      getCurrentImage(colorIndex) {
        if (this.lightImgs.length === 0) return ''; // 如果没有图片，返回空字符串
        const totalSteps = this.lightImgs.length;
        const currentStep = this.currentAnimationStep % totalSteps;
        const currentImageIndex = (colorIndex + currentStep) % totalSteps;
        return this.lightImgs[currentImageIndex];
      },
      startLightAnimation() {
        this.animationInterval = setInterval(() => {
          this.currentAnimationStep++;
          // 强制更新视图
          this.$forceUpdate();
        }, this.lightConfig.animationSpeed); // 使用 animationSpeed 来控制动画速度
      },
      stopLightAnimation() {
        if (this.animationInterval) {
          clearInterval(this.animationInterval);
        }
      },
      // 新增：更改动画速度的方法
      changeAnimationSpeed(newSpeed) {
        this.animationSpeed = newSpeed;
        // 重新启动动画以应用新的速度
        this.stopLightAnimation();
        this.startLightAnimation();
      },
    },
  };
</script>

<style lang="scss" scoped>
  .scratchCard {
    width: 100%;
    height: 100%;

    .scratchCard-content {
      width: 100%;
      height: 100%;
      position: relative;
    }
  }

  .scratchCard-content-value {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .content {
    position: relative;
    display: inline-block;
  }

  .option0 {
    opacity: 0;
  }

  .option1 {
    opacity: 1;
  }

  .canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .lights-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 10;
  }

  .light {
    position: absolute;
    border-radius: 50%;
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translate(-50%, -50%);
  }
</style>
