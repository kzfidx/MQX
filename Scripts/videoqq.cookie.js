/*
[MITM]
*.video.qq.com

[rewrite_local]
# 189及以前版本
^https:\/\/access.video.qq.com\/user\/auth_refresh url script-response-body videoqq.cookie.js
# 190及以后版本
^https:\/\/access.video.qq.com\/user\/auth_refresh url script-request-header videoqq.cookie.js

[task_local]
1 0 * * * videoqq.js

by https://github.com/chavyleung/scripts/tree/master/videoqq
*/


const cookieName = '腾讯视频'
const cookieKey = 'chavy_cookie_videoqq'
const authUrlKey = 'chavy_auth_url_videoqq'
const authHeaderKey = 'chavy_auth_header_videoqq'
const chavy = init()

const cookieVal = $request.headers['Cookie']
if (cookieVal) {
	if ($request.url.indexOf('auth_refresh') > 0) {
		const authurl = $request.url
		const authHeader = JSON.stringify($request.headers)
		if (cookieVal) chavy.setdata(cookieVal, cookieKey)
		if (authurl) chavy.setdata(authurl, authUrlKey)
		if (authHeader) chavy.setdata(authHeader, authHeaderKey)
		chavy.msg(`${cookieName}`, '獲取Cookie: 成功', '')
		chavy.log(`[${cookieName}] 獲取Cookie: 成功, Cookie: ${cookieVal}`)
		chavy.log(`[${cookieName}] 獲取Cookie: 成功, AuthUrl: ${authurl}`)
		chavy.log(`[${cookieName}] 獲取Cookie: 成功, AuthHeader: ${authHeader}`)
	} else {
		chavy.setdata(cookieVal, cookieKey)
		chavy.setdata(``, authUrlKey)
		chavy.setdata(``, authHeaderKey)
		chavy.msg(`${cookieName}`, '獲取Cookie: 成功', '')
		chavy.log(`[${cookieName}] 獲取Cookie: 成功, Cookie: ${cookieVal}`)
	}
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
chavy.done()