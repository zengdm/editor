var Editor = function() {
	this.init();
}
Editor.prototype = {

	init: function() {
		this.bindEvent();
	},

	bindEvent: function() {
		var that = this;
		var h = 0; //设置一个变量
		var textNum = 5000; //限制文字字数
		var limitNum = 500; //限制图片描述字数

		//添加模块
		$(document).on('click', '.addcover-text', function() {
			__textThis = $(this);
			h += 1; //第单击一次i的值加1
			__textThis.attr("addval", h);
			that.addcovertext();

			isOne = __textThis.parent().parent().attr('data-id')
			if (typeof isOne==='undefined') {
				document.body.scrollTop = document.body.scrollHeight;
			};
			
			//字数控制
			var pattern = '还可以输入<i> ' + textNum + ' </i>字';
			$('.num-word').html(pattern);
			$('.addto-textbox-textarea').keyup(function() {
				var remain = $(this).val().length;
				if(remain > textNum) {
					var exceed = remain - textNum;
					pattern = '已超出<i style="color:#e24343"> ' + exceed + ' </i>字';
					$(this).css('background', 'rgba(226, 67, 67, 0.5)');
				} else {
					var result = textNum - remain;
					pattern = '还可以输入<i> ' + result + ' </i>字';
					$(this).css('background', 'none');
				}
				$(this).next().html(pattern);
			});

		});

		$(document).on('click', '.addcover-picture', function() {
			__pictureThis = $(this);
			h += 1; //第单击一次i的值加1
			__pictureThis.attr("addval", h);
			__pictureThis.find(".file-input-one").off();
			__pictureThis.find(".file-input-one").change(function(e) {
				UpLoad(h);
			});

			isOne = __pictureThis.parent().parent().attr('data-id')
			if (typeof isOne==='undefined') {
				document.body.scrollTop = document.body.scrollHeight;
			};
		});

		//调节模块顺序
		$('form').on('click', '.addto-text-upicon', function() {
			var atext = $(this).parents('.addto-text');
			console.log(atext.length)
			if(atext.length > 0) {

				var id = $(this).parents('.addto-text').attr('data-id');
				that.sortList(id, 'up');
			} else {
				console.log('picup')
				var id = $(this).parents('.addto-picture').attr('data-id');
				that.sortList(id, 'up');
			}
		});

		$('form').on('click', '.addto-text-downicon', function() {
			var atext = $(this).parents('.addto-text');
			console.log(atext.length)
			if(atext.length > 0) {

				var id = $(this).parents('.addto-text').attr('data-id');
				that.sortList(id, 'down');
			} else {
				console.log('picdown')
				var id = $(this).parents('.addto-picture').attr('data-id');
				that.sortList(id, 'down');
			}
		});

		//删除模块
		$('form').on('click', '.addto-text-closeicon', function() {
			var aa = $(this).parents('.addto-text');
			if(aa.length > 0) {
				if(confirm('是否删除此版块?')) {
					$(this).parents('.addto-text').remove();
					console.log('删除.');
				}
			} else {
				if(confirm('是否删除此版块?')) {
					$(this).parents('.addto-picture').remove();
					console.log('删除.');
				}
			}
		});

		//鼠标滑动样式
		$('form').on('mouseover', '.addcover-bottom>div', function() {
			$(this).addClass('addcove-hover');
		})
		$('form').on('mouseout', '.addcover-bottom>div', function() {
			$(this).removeClass('addcove-hover');
		})
		$('form').on('click', '.add-btn', function() {
			$(this).slideUp(200);
			$(this).next().slideDown(200);
		})
		$('form').on('click', '.close-add-btn', function() {
			$(this).parents('.addcover-bottom').slideUp(200);
			$(this).parents('.addcover-bottom').prev().slideDown(200);
		})
		$('form').on('focus','.addto-textbox-textarea',function(){
   			  $(this).parents('.addto-text-intro').addClass('focus');
		})
		$('form').on('blur','.addto-textbox-textarea',function(){
   			  $(this).parents('.addto-text-intro').removeClass('focus');
		})
		$('form').on('focus','.intro',function(){
   			  $(this).parents('.addto-picture-intro').addClass('focus');
		})
		$('form').on('blur','.intro',function(){
   			  $(this).parents('.addto-picture-intro').removeClass('focus');
		})
		function UpLoad(e) {
			// 图片赋值
			that.addcoverpicture();
			var f = __pictureThis.find('.file-input-one').get(0).files[0];
			fileType = f.type;
			console.log(fileType);
			//alert(fileType);
			var baseBox = $('.base');

			var imgUrlInput = $('.imgUrl');

			var Orientation = '';

			if(/image\/\w+/.test(fileType)) {
				var fileReader = new FileReader();
				EXIF.getData(f, function() {
					// alert(EXIF.pretty(this));  
					EXIF.getAllTags(this);
					//alert(EXIF.getTag(this, 'Orientation'));   
					Orientation = EXIF.getTag(this, 'Orientation');
				});

				fileReader.readAsDataURL(f);

				fileReader.onload = function(event) {
					var result = event.target.result; //返回的dataURL
					
					//若图片大小大于1M，压缩后再上传，否则直接上传
					var maxW = 1200;
					var maxH = 1000;
					var rat = maxW / maxH;

					var image = new Image();
					image.src = result; //;e.target.result;  
					image.onload = function() {
						var expectWidth = this.naturalWidth;
						var expectHeight = this.naturalHeight;

						if(this.naturalWidth > this.naturalHeight && this.naturalWidth > maxW) {
							expectWidth = maxW;
							expectHeight = expectWidth * this.naturalHeight / this.naturalWidth;
						} else if(this.naturalHeight > this.naturalWidth && this.naturalHeight > maxH) {
							expectHeight = maxH;
							expectWidth = expectHeight * this.naturalWidth / this.naturalHeight;
						}
						var canvas = document.createElement("canvas");
						var ctx = canvas.getContext("2d");
						canvas.width = expectWidth;
						canvas.height = expectHeight;
						//console.log(canvas.width+':'+canvas.height);
						ctx.drawImage(this, 0, 0, expectWidth, expectHeight);
						var base64 = null;
						//修复ios  
						if(navigator.userAgent.match(/iphone/i)) { 
							//如果方向角不为1，都需要进行旋转 added by lzk  
							if(Orientation != "" && Orientation != 1) {
								//alert('旋转处理');  
								switch(Orientation) {
									case 6: //需要顺时针（向左）90度旋转  
										//alert('需要顺时针（向左）90度旋转');  
										rotateImg(this, 'left', canvas);
										break;
									case 8: //需要逆时针（向右）90度旋转  
										//alert('需要顺时针（向右）90度旋转');  
										rotateImg(this, 'right', canvas);
										break;
									case 3: //需要180度旋转  
										//alert('需要180度旋转');  
										rotateImg(this, 'right', canvas); //转两次  
										rotateImg(this, 'right', canvas);
										break;
								}
							}
							base64 = canvas.toDataURL(fileType, 0.8);
						} else if(navigator.userAgent.match(/Android/i)) { // 修复android  
							var canvas = document.getElementById("canvas");
							canvas.width = this.width;
							canvas.height = this.height; //计算等比缩小后图片宽高
							var ctx = canvas.getContext('2d');
							var expectHeight = this.naturalHeight;
							console.log(canvas.width + '/' + canvas.height);
							//等比压缩
							if(canvas.width / canvas.height > rat) {
								if(canvas.width > maxW) {
									canvas.width = maxW;
									canvas.height = parseInt((canvas.height * maxW) / this.width);
								}
							} else {
								if(canvas.height > maxH) {
									canvas.height = maxH;
									canvas.width = parseInt((canvas.width * maxH) / this.height);
								} else {

								}
							}
							console.log(canvas.width + '=>' + canvas.height);
							ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
							base64 = canvas.toDataURL(fileType, 0.8); //重新生成图片
							// var encoder = new JPEGEncoder();  
							// base64 = encoder.encode(ctx.getImageData(0, 0, expectWidth, expectHeight), 80);  
						} else {
							//alert(Orientation);  
							if(Orientation != "" && Orientation != 1) {
								//alert('旋转处理');  
								switch(Orientation) {
									case 6: //需要顺时针（向左）90度旋转  
										//alert('需要顺时针（向左）90度旋转');  
										rotateImg(this, 'left', canvas);
										break;
									case 8: //需要逆时针（向右）90度旋转  
										//alert('需要顺时针（向右）90度旋转');  
										rotateImg(this, 'right', canvas);
										break;
									case 3: //需要180度旋转  
										//alert('需要180度旋转');  
										rotateImg(this, 'right', canvas); //转两次  
										rotateImg(this, 'right', canvas);
										break;
								}
							}

							base64 = canvas.toDataURL(fileType, 0.8);

						}
						var postData = base64.replace("data:" + fileType + ";base64,", '');

						//console.log(base64)
						$('#base' + that.dataId).attr("data-base", base64);
						$.post('//m.club.diandong.com/api/async/upload/', {
							opt: 'upload',
							imgsrc: postData,
							/*debug: 500,*/
							rnd: Math.random()
						}, function(result) {
							//console.log(result)
							var html = '';
							if(result.code == 200) {

								html += '<input type="hidden" id="imgUrl_1" class="imgUrl_1" name="content[]" value="' + result.data.src + '">' +
									'<div class="addto-picturebox-img"><img src="' + result.data.src + '" alt=""></div>' +
									'<div class="addto-picturebox-text">' +
									'<textarea placeholder="在此添加上方图片的描述，描述不超过500字。" class="intro" id="picture-intro" name="remark[]"></textarea><span class="num-word-picture"></span>' +
									'</div>' +
									'<input type="hidden" id="pic-focus" class="pic-focus" name="focus[]" value="0">';
								//                                      +'<div class="addto-picturebox-setcover">设为封面</div>';
								$('#list' + that.dataId).find('.addto-picturebox').html(html);
							
							} else {
								html += '<input type="hidden" id="imgUrl_1" class="imgUrl_1" name="content[]" value="' + result.data.src + '">' +
									'<div class="reupload">' +
									'<img src="//i1.dd-img.com/assets/image/1498708269-8df4c8fd1bfc0ffa-192w-192h.png" alt="">' +
									'</div>';
								//console.log($('#list' + that.dataId))
								$('#list' + that.dataId).find('.addto-picturebox').html(html);
								//   alert("1" + result.msg);
							}

							var pattern = '还可以输入<i> ' + limitNum + ' </i>字';
							$('.num-word-picture').html(pattern);
							$('.intro').keyup(function() {
								var remain = $(this).val().length;
								if(remain > limitNum) {
									var exceed = remain - limitNum;
									pattern = '已超出<i style="color:#e24343"> ' + exceed + ' </i>字';
									$(this).css('background', 'rgba(226, 67, 67, 0.5)');
								} else {
									var result = limitNum - remain;
									pattern = '还可以输入<i> ' + result + ' </i>字';
									$(this).css('background', 'none');
								}
								$(this).next().html(pattern);
							});

						});
					};

				}
			} else {
				alert("请选择图片");
			};
		}

		//对图片旋转处理 added by lzk  
		function rotateImg(img, direction, canvas) {
			//alert(img);  
			//最小与最大旋转方向，图片旋转4次后回到原方向    
			var min_step = 0;
			var max_step = 3;
			//var img = document.getElementById(pid);    
			if(img == null) return;
			//img的高度和宽度不能在img元素隐藏后获取，否则会出错    
			var height = img.height;
			var width = img.width;
			//var step = img.getAttribute('step');    
			var step = 2;
			if(step == null) {
				step = min_step;
			}
			if(direction == 'right') {
				step++;
				//旋转到原位置，即超过最大值    
				step > max_step && (step = min_step);
			} else {
				step--;
				step < min_step && (step = max_step);
			}
			//旋转角度以弧度值为参数    
			var degree = step * 90 * Math.PI / 180;
			var ctx = canvas.getContext('2d');
			switch(step) {
				case 0:
					canvas.width = width;
					canvas.height = height;
					ctx.drawImage(img, 0, 0);
					break;
				case 1:
					canvas.width = height;
					canvas.height = width;
					ctx.rotate(degree);
					ctx.drawImage(img, 0, -height);
					break;
				case 2:
					canvas.width = width;
					canvas.height = height;
					ctx.rotate(degree);
					ctx.drawImage(img, -width, -height);
					break;
				case 3:
					canvas.width = height;
					canvas.height = width;
					ctx.rotate(degree);
					ctx.drawImage(img, -width, 0);
					break;
			}
		}

	},

	addcovertext: function() {
		var that = this;
		var texthtml = '';
		var dataId = __textThis.attr('addval');
		texthtml += '<div class="addto-text" data-id="' + dataId + '">' +
			'<div class="addto-text-intro">' +
			'<div class="addto-text-h2 fn-right">' +
			'<i class="addto-text-closeicon iconfont">&#xe69a;</i>' +
			'<div class="i2"><i class="addto-text-upicon iconfont">&#xe636;</i>' +
			'<i class="addto-text-downicon iconfont">&#xe635;</i></div>' +
			'</div>' +
			'<div class="addto-textbox">' +
			'<textarea class="addto-textbox-textarea" name="content[]"  placeholder="在此输入正文内容"></textarea><span class="num-word"></span>' +
			'</div>' +
			'</div>' +
			'<a href="javascript:;" class="add-btn">+</a>' +
			'<div class="addcover-bottom fn-hide">' +
			'<a href="javascript:;" class="close-add-btn">×</a>' +
			'<div class="addcover-text" addval=""><i class="iconfont addcover-text-icon">&#xe6b9;</i>添加文字</div>' +
			'<div class="addcover-picture" addval="">' +
			'<input type="file" name="headpic[]" class="file-input-one"  id="file-input-one">' +
			'<input type="hidden" id="imgUrl_1" class="imgUrl" name="pics[]" value="">' +
			'<i class="addcover-picture-icon iconfont">&#xe6a8;</i>添加图片' +
			'</div>' +
			'</div>' +
			'</div>';


		var dataId = __textThis.parent().parent().attr('data-id');
		if (typeof dataId === 'undefined') {
			$('#canvas').before(texthtml);
		}else{
			__textThis.parent().parent().after(texthtml)
		}

		//隐藏操作框
		$('.addto-text').find('.addcover-bottom').slideUp(200);
		$('.addto-text').find('.add-btn').show();
		$('.addto-picture').find('.addcover-bottom').slideUp(200);
		$('.addto-picture').find('.add-btn').show();
	},
	addcoverpicture: function() {
		//console.log("111")
		var that = this;
		var picturehtml = "";
		var base64 = $('.base').attr('data-base');
		var imgUrlInput = $('.imgUrl').val();
		var dataId = __pictureThis.attr('addval');
		that.dataId = dataId;
		picturehtml += '<div class="addto-picture" id="list' + dataId + '"  data-id="' + dataId + '">' +
			'<div class="addto-picture-intro">' +
			'<div class="addto-text-h2 fn-right">' +
			'<i class="addto-text-closeicon iconfont">&#xe69a;</i>' +
			'<div class="i2"><i class="addto-text-upicon iconfont">&#xe636;</i>' +
			'<i class="addto-text-downicon iconfont">&#xe635;</i></div>' +
			'</div>' +
			'<input type="hidden" id="base' + dataId + '" class="base" name="base" data-base="">' +
			'<div class="addto-picturebox">' +
			'<input type="hidden" id="imgUrl_1" class="imgUrl_1" name="content[]" value="' + imgUrlInput + '">' +
			'<img class="upload-loading" src="//i1.dd-img.com/assets/image/1498632696-0ba068b9ac87cbc5-400w-400h.gif" alt="">' +
			'</div>' +
			'</div>' +
			'<a href="javascript:;" class="add-btn">+</a>' +
			'<div class="addcover-bottom fn-hide">' +
			'<a href="javascript:;" class="close-add-btn">×</a>' +
			'<div class="addcover-text" addval=""><i class="iconfont addcover-text-icon">&#xe6b9;</i>添加文字</div>' +
			'<div class="addcover-picture" addval="">' +
			'<input type="file" name="headpic[]" class="file-input-one"  id="file-input-one">' +
			'<input type="hidden" id="imgUrl_1" class="imgUrl" name="pics[]" value="">' +
			'<i class="addcover-picture-icon iconfont">&#xe6a8;</i>添加图片' +
			'</div>' +
			'</div>' +
			'</div>';


		var dataId = __pictureThis.parent().parent().attr('data-id');
		if (typeof dataId === 'undefined') {
			$('#canvas').before(picturehtml);
		}else{
			__pictureThis.parent().parent().after(picturehtml)
		}

		//隐藏操作框
		$('.addto-text').find('.addcover-bottom').slideUp(200);
		$('.addto-text').find('.add-btn').show();
		$('.addto-picture').find('.addcover-bottom').slideUp(200);
		$('.addto-picture').find('.add-btn').show();

		if (typeof isOne==='undefined') {
			document.body.scrollTop = document.body.scrollHeight;
		};
	},
	sortList: function(id, move) {
		var aDiv = document.querySelectorAll(".addto-text,.addto-picture");
		var aLen = aDiv.length;
		var arr = [];

		var preDiv = downDiv = '';
		for(var i = 0; i < aLen; i++) {
			var curId = $(aDiv[i]).attr('data-id');
			//console.log(curId);
			if(curId == id) {
				if(move == 'up') {
					// 上移
					if(!arr.length) {
						return false;
					} else {
						preDiv = arr.pop();
						arr.push(aDiv[i]);
						arr.push(preDiv);
						preDiv = '';
					}
				} else {
					// 下移
					if(arr.length == (aLen - 1)) {
						//console.log('push down');
						arr.push(aDiv[i]);
						return false;
					} else {
						console.log('set donw');
						downDiv = aDiv[i];
					}
				}
			} else {
				arr.push(aDiv[i]);
				if(downDiv) {
					//console.log('push->'+downDiv);
					arr.push(downDiv);
					downDiv = '';
				}
			}
			//aDiv是元素的集合，并不是数组，所以不能直接用数组的sort进行排序。
		}
		//console.log(arr);
		for(var i = 0; i < arr.length; i++) {
			$('#canvas').before(arr[i]); //将排好序的元素重新排列
		}
	}

}