const miniappName = "88开奖网"; //站点标题用于分享时的标题
const shareH5Url = "https://h5.linfeng.tech/#/"; //H5分享路径

//本地环境配置
// const baseUrl = "3sc4695789.yicp.fun/bbs"; //你本地测试的接口地址
const baseUrl = "88tk.app/api"; //你本地测试的接口地址
const domain = 'https://' + baseUrl + "/app/"; //接口服务地址
// const baseUrl = "127.0.0.1:8280"; //你测试的接口地址
// const domain = 'http://' + baseUrl + "/app/"; //测试接口服务地址
const websocketUrl = 'ws://'+baseUrl+'/app/socket/';//IM通信地址
const imfile = 'https://' + baseUrl + "/"; //IM文件资源地址
const emojiUrl = 'https://demo.linfeng.tech/big/';//私聊表情包资源地址
const imgResource = 'https://demo.linfeng.tech/resource';//用户端的图标等静态资源 换成自己的

//线上环境配置
// const baseUrl = "wxapi.linfeng.tech";
// const domain = 'https://' + baseUrl + "/app/"; 
// const websocketUrl = 'wss://'+baseUrl+'/socket/'
// const imfile = 'https://' + baseUrl + "/"; 
// const emojiUrl = "https://demo.linfeng.tech/big/";
// const imgResource = 'https://demo.linfeng.tech/resource';//用户端的图标等静态资源

export default {
	baseUrl: baseUrl,
	domain: domain,
	miniappName: miniappName,
	shareH5Url: shareH5Url,
	websocketUrl: websocketUrl,
	imfile:imfile,
	emojiUrl:emojiUrl,
	imgResource:imgResource
}
