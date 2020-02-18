const cookieName = '芒果TV'
const signurlKey = 'chavy_signurl_mgtv'
const signheaderKey = 'chavy_signheader_mgtv'
const chavy = init()
const signurlVal = chavy.getdata(signurlKey)
const signheaderVal = chavy.getdata(signheaderKey)

sign()

function sign() {
	const url = { url: signurlVal, headers: JSON.parse(signheaderVal) }
	url.body = '{}'
	chavy.post(url, (error, response, data) => {
		chavy.log(`${cookieName}, data: ${data}`)
		const title = `${cookieName}`
		let subTitle = ''
		let detail = ''
		const result = JSON.parse(data.match(/\(([^\)]*)\)/)[1])
		if (result.code == 200) {
			subTitle = `簽到結果: 成功`
			detail = `共簽: ${result.data.curDay}天, 連簽: ${result.data.curDayTotal}天, 積分: ${result.data.balance} （+${result.data.credits}）`
		} else if (result.code == 1002) {
			subTitle = `簽到結果: 成功 (重復簽到)`
		} else {
			subTitle = `簽到結果: 失敗`
			detail = `編碼: ${result.code}, 說明: ${result.msg}`
		}
		chavy.msg(title, subTitle, detail)
		chavy.done()
	})
}

function init() {
	isSurge = () => {
		return undefined === this.$httpClient ? false : true
	}
	isQuanX = () => {
		return undefined === this.$task ? false : true
	}
	getdata = (key) => {
		if (isSurge()) return $persistentStore.read(key)
		if (isQuanX()) return $prefs.valueForKey(key)
	}
	setdata = (key, val) => {
		if (isSurge()) return $persistentStore.write(key, val)
		if (isQuanX()) return $prefs.setValueForKey(key, val)
	}
	msg = (title, subtitle, body) => {
		if (isSurge()) $notification.post(title, subtitle, body)
		if (isQuanX()) $notify(title, subtitle, body)
	}
	log = (message) => console.log(message)
	get = (url, cb) => {
		if (isSurge()) {
			$httpClient.get(url, cb)
		}
		if (isQuanX()) {
			url.method = 'GET'
			$task.fetch(url).then((resp) => cb(null, {}, resp.body))
		}
	}
	post = (url, cb) => {
		if (isSurge()) {
			$httpClient.post(url, cb)
		}
		if (isQuanX()) {
			url.method = 'POST'
			$task.fetch(url).then((resp) => cb(null, {}, resp.body))
		}
	}
	done = (value = {}) => {
		$done(value)
	}
	return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
}