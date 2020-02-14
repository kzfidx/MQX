var api = "http://api.ipstack.com/check?access_key=01452ee4a01a8c3cde046d25475964c0&language=ZH&output=json"
// var api = "http://api.ipapi.com/check?access_key=2e38a809120030b43cb30d99eac2dd44&language=ZH&conection&format=1"

function checkIP(){
	let ipurl = {
		url: api, headers: {},
	};
	$task.fetch(ipurl).then(response => {
		var info = JSON.parse(response.body);
		title = info.continent_code + " " + info.country_code
		subtitle = info.location.country_flag_emoji + " " + info.country_name
		ip = info.ip
		description = info.location.country_flag_emoji + "-" + info.city +"-" + info.type
		$notify(title, subtitle, ip, description);
	}, reason => {
	$notify("IP信息获取失败", reason.error);
	});
}
checkIP()