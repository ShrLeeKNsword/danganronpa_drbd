
function getEasyMathQuestion (input_a,input_b,input_method){
	var que = '';
	var st_a = String(input_a);
	var st_b = String(input_b);
	switch(input_method){
		case 1 :{
			que = st_a + '+' + st_b;
		}
		case 2 :{
			que = st_a + '-' + st_b;
		}
		case 3 :{
			que = st_a + '*' + st_b;
		}
	};
	que = que + '=？'
};

function getEasyMathAnswer (input_a,input_b,input_method){
	var ans = null;
	switch(input_method){
		case 1 :{
			ans = input_a + input_b;
		}
		case 2 :{
			ans = input_a - input_b;
		}
		case 3 :{
			ans = input_a * input_b;
		}
	};
};

function getQuestionFromNet (id){
	if(id != null){
		console.log("正在试图抓取题目！");
	}else{
		return;
	}
}

function getAnswerFromNet (id){
	if(id != null){
		console.log("正在试图抓取答案！");
	}else{
		return;
	}
}

function GetRandomNum(Min,Max)
{   
	var Range = Max - Min;   
	var Rand = Math.random();
	var final_radom = Min + Math.round(Rand * Range);
	console.log("随机数" + final_radom);
	return(final_radom);   
}  


window.onload = function () {
    var url = "HTTPS://drbd.rpgca.tk/checkqs.json"/*json文件url，本地的就写本地的位置，如果是服务器的就写服务器的路径*/
    var request = new XMLHttpRequest();
    request.open("get", url);/*设置请求方法与路径*/
    request.send(null);/*不发送数据到服务器*/
    request.onload = function () {/*XHR对象获取到返回信息后执行*/
        if (request.status == 200) {/*返回状态为200，即为数据获取成功*/
            var json = JSON.parse(request.responseText);
            for(var i=0;i<json.length;i++){
            	console.log(json[i].name);
            }
            console.log(json);
			
		var get_user_ans = window.prompt("请输入官方给与的序列号:");
		console.log(li_windowInput + "输入的答案");
			
		}else{
			var check = true;
			while (check){
				var num_a = GetRandomNum(0,99);
				var num_b = GetRandomNum(0,99);
				var num_function = GetRandomNum(0,3);
				
				var math_question = getEasyMathQuestion(num_a,num_b,num_function);
				var math_answer = getEasyMathAnswer(num_a,num_b,num_function);
				
				var get_user_ans = parseInt(window.prompt("请回答一道数学题:" + math_question));
				console.log("输入的答案:" + math_answer);
				if (math_question == math_answer) {
					check = false;
					console.log("回答正确！网页即将跳转！");
				}else{
					console.log("回答错误！请再来一遍！");
				}
			}
		}
	}
}
