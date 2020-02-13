var token = "e03510c6fccc76decc0303855da55508f1caa6af";
var city ="here"

function aqi(){
	let qurl = {
		url: "https://api.waqi.info/feed/" + city + "/?token=" + token, headers: {},
	};
	$task.fetch(qurl).then(response => {
		var obj = JSON.parse(response.body);
		info = obj.data.aqi
		SyncTime = obj.data.time.s
		if (info<50){text = "🟢，良好";}
		if (51<info<100){text = "🟡，中等";}
		if (info<50){text = "🟠，對敏感人群有害";}
		if (info<50){text = "🔴，不健康!";}
		if (info<50){text = "🟣，極不健康!";}
		if (info<50){text = "🟤，有毒害!";}
		$notify("AQIcn.org", "截至" + SyncTime, "當前位置AQI：" + info + text);
	}, reason => {
	$notify("AQIcn.org 信息获取失败", reason.error);
	});
}
aqi()