export default {

	// 公共跳转方法
	jump(url, type = 1) {
		// 保留当前页面，跳转到应用内的某个页面
		if (type == 1) {
			uni.navigateTo({
				url: url
			})
		}

		// 关闭当前页面，跳转到应用内的某个页面
		if (type == 2) {
			uni.redirectTo({
				url: url
			})
		}
		// 关闭所有页面，打开到应用内的某个页面
		if (type == 3) {
			uni.reLaunch({
				url: url
			})
		}

		// 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
		if (type == 4) {
			uni.switchTab({
				url: url
			})
		}
	},
	tostring(value) {
		return JSON.stringify(value);
	},
	toast(title, icon = 'none') {
		uni.showToast({
			title: title,
			icon: icon,
			duration: 1500
		});
	},
	copy(res, isToast = true) {
		uni.setClipboardData({
			data: res,
			success: function() {
				if (isToast) {
					uni.showToast({
						title: "复制成功",
						duration: 2000,
						icon: "none",
					});
				}
			},
			fail() {
				console.log('copy fail')
			}
		});

	},
	myCache(key, value, seconds = 3600 * 24) {
		let nowTime = Date.parse(new Date()) / 1000;
		if (key && value) {
			let expire = nowTime + Number(seconds);
			uni.setStorageSync(key, JSON.stringify(value) + '|' + expire)
		} else if (key && !value) {
			let val = uni.getStorageSync(key);
			if (val) {
				let temp = val.split('|')
				if (!temp[1] || temp[1] <= nowTime) {
					uni.removeStorageSync(key)
					return '';
				} else {
					return JSON.parse(temp[0]);
				}
			}
		}
	},
	// 将文本中的网址样式修改为蓝色，并添加链接
	formatText(text) {
		const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
		const urls = text.match(urlRegex);
		let formattedText = text;
		if (urls) {
			urls.forEach((url) => {
				if (formattedText.includes(`<img src="${url}"`) || formattedText.includes(
					`<img src='${url}'`)) {
					return; // Skip processing the URL if it's within an <img> tag
				}
				const link = `<a href="${url}" style="color: #aaaaff;">${url}</a>`;
				formattedText = formattedText.replace(url, link);
			});
		}
		return formattedText;
	},
	//url路径解密函数
	decryptUrl(encryptedUrl) {
		var decryptionKey = 'linfengcommunitySYKey'; // 与后端相同的解密密钥
		// 自定义解密逻辑
		// 这里使用与加密相反的操作，将密文的每个字符减去密钥的字符来还原明文
		var decryptedUrl = '';
		for (var i = 0; i < encryptedUrl.length; i++) {
			var encryptedChar = encryptedUrl.charAt(i);
			var decryptedChar = String.fromCharCode(encryptedChar.charCodeAt(0) - decryptionKey.charCodeAt(i %
				decryptionKey.length));
			decryptedUrl += decryptedChar;
		}
		return decryptedUrl;
	},
	// 获取星期数
	getWeek(query) {
		const date = new Date(query);
		const day = date.getDay();
		const weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
		const week = weeks[day];
		return week
	}

}