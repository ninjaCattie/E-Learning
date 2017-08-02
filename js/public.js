$(function() {
	//Bmob初始化
	Bmob.initialize("74c6938ff0014153a3fca0b45b948558", "b723c9f04019ff5386c2f45a3e80ea78");
	//登录
	$(document).on("pageInit", "#Account-login", function(e, id, page) {
		$(page).on("click", "#login", function() {
			var username = $("#username").val();
			var pwd = $("#pwd").val();
			if(username == null || username == "") {
				$.alert("请输入用户名");
				return false;
			}
			if(pwd == null || pwd == "") {
				$.alert("请输入密码");
				return false;
			} else {
				Bmob.User.logIn(username, pwd, {
					success: function(user) {
						setTimeout(function() {
							window.location.href = "../Home/index.html";
						}, 300);
					},
					error: function(user, error) {
						$.alert("Error:" + error.code + " " + error.message);
					}
				})
			}

		});
	});
	//注册
	$(document).on("pageInit", "#Account-register", function(e, id, page) {
		$(page).on("click", "#register", function() {
			var username = $("#username").val();
			var pwd = $("#pwd").val();

			if(username == null || username == "") {
				$.alert("请输入用户名");
				return false;
			}
			if(pwd == null || pwd == "") {
				$.alert("请输入密码");
				return false;
			} else {
				var user = new Bmob.User();
				user.set({
					"username": username,
					"password": pwd,
					"Image": "../../img/resetImg.jpg"
				});
				/*
				var MyUser = Bmob.Object.extend("myUser");
				var myUser = new MyUser();
				myUser.set({
					"username": username,
					"password": pwd,
					"Image": "../../img/resetImg.jpg",
				})
				myUser.save(null, {
					success: function(myUser) {},
					error: function(myUser, error) {
						$.alert('添加数据失败，返回错误信息：' + error.description);
					}
				});*/
				user.signUp(null, {
					success: function(user) {
						$.alert("注册成功！");
						setTimeout(function() {
							window.location.href = "../Home/index.html";
						}, 300);
					},
					error: function(user, error) {
						$.alert("Error: " + error.code + " " + error.message);
					}
				});
			}

		});

	});
	//个人中心首页
	$(document).on("pageInit", "#Member-index", function(e, id, page) {
		//判断登录状态
		var currentUser = Bmob.User.current();
		if(currentUser) {
			var username = currentUser.get("username");
			var userimg = currentUser.get("Image");

			$(".username").text(username);
			$(".userpic img").attr("src", userimg);
		} else {
			//去往登录界面
			window.location.href = "../Account/login.html";
		}
		$(page).on("click", "#backLogin", function() {
			Bmob.User.logOut();
			location.reload(true);
		});
	});
	//Home-首页
	$(document).on("pageInit", "#Home-index", function(e, id, page) {
		//Banner
		var Banner = Bmob.Object.extend("Banner");
		var query = new Bmob.Query(Banner);
		query.find({
			success: function(results) {
				var sBanner = "";
				for(var i = 0; i < results.length; i++) {
					var object = results[i];
					var sbanner = "<a href = '" + object.get("WebsiteUrl") + "' class='swiper-slide'><img src='" + object.get("ImageUrl") + " '/></a>"
					sBanner += sbanner;
				}
				$(".swiper-container-index .swiper-wrapper").append(sBanner);

				//swiper配置
				var indexSwiper = new Swiper(".swiper-container-index", {
					loop: true,
					autoplay: 5000,
					autoplayDisableOnInteraction: false,
					pagination: '.swiper-pagination-index',
					paginationClickable: true
				});
			},
			error: function(error) {
				$.alert("数据查询失败！错误码：" + error.code + "错误信息：" + error.message);
			}
		});
		//视频推荐
		var videoAdvice = Bmob.Object.extend("ExpertVideo");
		var query = new Bmob.Query(videoAdvice);
		query.find({
			success: function(result) {
				var num = result.length >= 4 ? 4 : result.length;
				var sVideoAdvice = "";

				for(var i = 0; i < num; i++) {
					var object = result[i];
					var Author = "";
					var id = object.id;
					var image = object.get("Image");
					var hotPoint = object.get("clicknum");
					var title = object.get("title");
					switch(object.get("Author")) {
						case "0":
							Author = "芭比bong";
							break;
						case "1":
							Author = "菠萝毛毛球";
							break;
						case "2":
							Author = "草莓宇航员";
							break;
						default:
							Author = "神秘人";
							break;
					}
					sVideoAdvice += "<li><a href='../Video/Detail.html?url=" + id + "' external>";
					sVideoAdvice += '<div class="vImg"><img src="' + image + '" alt="">';
					sVideoAdvice += '<div class="watchArea"><i class="watchIcon"></i><span class="num">' + hotPoint + '</span>';
					sVideoAdvice += '</div></div><div class="vTitle">' + title + '</div>';
					sVideoAdvice += '<div class="vPlayer">' + Author + '</div></a></li>';
				}
				$(".vul").append(sVideoAdvice);
			},
			error: function(error) {
				$.alert("数据查询失败！错误码：" + error.code + "错误信息：" + error.message);
			}
		});
		//音频推荐
		var audioAdvice = Bmob.Object.extend("ExpertAudio");
		var query = new Bmob.Query(audioAdvice);
		query.find({
			success: function(results) {
				var num = results.length > 6 ? 6 : results.length;
				var sAudioAdvice = "";

				for(var i = 0; i < num; i++) {
					var object = results[i];
					var imgSrc = object.get("Image");
					var proId = object.id;
					var clicknum = object.get("clicknum");
					var title = object.get("title");
					var author = object.get("Author");
					sAudioAdvice += '<li><a href="../Audio/Detail.html?id=' + proId + '" external>';
					sAudioAdvice += '<div class="aImg"><img src="' + imgSrc + '">';
					sAudioAdvice += '<div class="watchArea"><i class="listenIcon"></i>';
					sAudioAdvice += '<span class="num">' + clicknum + '</span></div></div>';
					sAudioAdvice += '<div class="vTitle">' + title + '</div>';
					sAudioAdvice += '<div class="vPlayer">' + author + '</div></a></li>';
				}

				$(".aul").append(sAudioAdvice);
			}
		})
	});
	//视频详情页
	$(document).on("pageInit", "#Video-detail", function(e, id, page) {
		//本视频id
		var vid = window.location.toString().split("=");
		vid = vid[1];
		var ExpertVideo = Bmob.Object.extend("ExpertVideo");
		//创建查询对象，入口参数是对象类的实例
		var query = new Bmob.Query(ExpertVideo);
		//查询单条数据，第一个参数是这条数据的objectId值
		query.get(vid, {
			success: function(expertVideo) {
				// 查询成功，调用get方法获取对应属性的值
				var Url = expertVideo.get("Url");
				var title = expertVideo.get("title");
				var intro = expertVideo.get("intro");
				var update = expertVideo.updatedAt;
				expertVideo.set("clicknum", expertVideo.get("clicknum") + 1);
				expertVideo.save(null, {
					success: function(objectUpdate) {
						var clicknum = objectUpdate.get("clicknum");
						$("#clicknum").text(clicknum);
					},
					error: function(model, error) {
						alert("更新失败！");
					}
				});
				var videoText = "";
				videoText += '<video width="100%" height="100%" controls="controls" preload="auto">';
				videoText += '<source src="' + Url + '" type="video/mp4"></source></video>';
				$(".videoArea").append(videoText);
				$(".videoTitle").text(title);
				$(".videoinfo").text(intro);
				$("#updatetime").text(update);
			},
			error: function(object, error) {
				$.alert("数据查询失败！错误码：" + error.code + "错误信息：" + error.message);
			}
		});
		//评论
		var editcomHref = "../PubView/comment.html?id=" + vid;
		$("#editComment").attr("href", editcomHref);
		var showComment = Bmob.Object.extend("Comment");
		var query = new Bmob.Query(showComment);
		query.equalTo("proId", vid);
		query.find({
			success: function(results) {
				var num = results.length >= 3 ? 3 : results.length;
				var sLi = "";
				if(num > 0) {
					var userImg = [];
					var userName = [];
					for(var i = 0; i < num; i++) {
						var object = results[i];
						var query = new Bmob.Query(Bmob.User);
						var authorId = object.get("authorId");
						query.get(authorId, {
							success: function(result) {
								nameObj = result.get("username");
								imgObj = result.get("Image");
								userImg.push(imgObj);
								userName.push(nameObj);
							},
							error: function(error) {
								nameObj = "../../img/member.png";
								imgObj = "未知";
								userImg.push(imgObj);
								userName.push(nameObj);
							}
						});
					}
					setTimeout(function() {
						if(userImg.length != 0) {
							for(var i = 0; i < userImg.length; i++) {
								var object = results[i];
								var content = object.get("content");
								var date = object.createdAt;

								sLi += '<li><div class="firLine"><div class="userImg">';
								sLi += '<img src="' + userImg[i] + '"/></div>';
								sLi += '<div class="right"><div class="username">' + userName[i] + '</div>';
								sLi += '<div class="commenttime">' + date + '</div></div></div>';
								sLi += '<div class="list-block"><div class="commentcon">' + content + '</div></div></li>';
							}
						} else {
							$.alert("加载速度出错");
							console.log(new Date());
						}
						$(".commentUl").append(sLi);
					}, 300);
				} else {
					sLi = '<li style="text-align:center;font-size:20px;height:5rem;line-height:5rem;">还没有评论哦！快去评论吧！</li>';
					$(".commentUl").append(sLi);
				}
			}
		});
		//收藏
		var star = Bmob.Object.extend("Star");
		var query = new Bmob.Query(star);
		var currentUser = Bmob.User.current();
		if(currentUser) {
			query.equalTo("userId", currentUser.id);
			query.equalTo("proId", vid);
			query.find({
				success: function(result) {
					if(result.length == 0) {
						$(".starIcon").removeClass("active");
						console.log("no");
					} else {
						$(".starIcon").addClass("active");
						console.log("yes");
					}
				},
				error: function(error) {
					alert(error.message);
				},
			})
		} else {
			$.alert("请先登录！");
			setTimeout(function() {
				window.location.href = "../Account/login.html";
			}, 500);
		}
		$(page).on("click", ".bar-videode", function(e, id) {
			var star = Bmob.Object.extend("Star");
			var query = new Bmob.Query(star);
			var currentUser = Bmob.User.current();
			if(currentUser) {
				query.equalTo("userId", currentUser.id);
				query.equalTo("proId", vid);
				query.find({
					success: function(result) {
						if(result.length == 0) {
							$(".starIcon").addClass("active");
							var Star = Bmob.Object.extend("Star");
							var star = new Star();
							star.set({
								"proId": vid,
								"userId": currentUser.id,
								"type": "2",
							});
							star.save(null, {
								success: function(object) {
									console.log("保存成功！");
								},
								error: function(model, error) {
									alert("添加收藏失败-错误码：" + error.code + "错误信息：" + error.message);
								}
							});
						} else {
							$(".starIcon").removeClass("active");
							query.destroyAll({
								success: function() {
									console.log("删除成功！");
								},
								error: function(model, error) {
									console.log("删除收藏失败-错误码：" + error.code + "错误信息：" + error.message);
								}
							});
						}
					},
					error: function(error) {
						alert(error.message);
					},
				})
			} else {
				$.alert("请先登录！");
				setTimeout(function() {
					window.location.href = "../Account/login.html";
				}, 500);
			}
		})
	});
	//视频中心首页
	$(document).on("pageInit", "#Video-index", function(e, id, page) {
		//二级菜单方法
		$(page).on("click", ".node", function(e, id) {
			if($(this).children(".icon").hasClass("icon-down")) {
				$(this).children(".icon").removeClass("icon-down").addClass("icon-up");
				$(this).siblings(".branch").show();
			} else {
				$(this).children(".icon").removeClass("icon-up").addClass("icon-down");
				$(this).siblings(".branch").hide();
			}
		});
		//初始展示6条视频数据
		var videoAdvice = Bmob.Object.extend("ExpertVideo");
		var query = new Bmob.Query(videoAdvice);
		query.find({
			success: function(result) {
				var num = result.length >= 6 ? 6 : result.length;
				var sVideoAdvice = "";

				for(var i = 0; i < num; i++) {
					var object = result[i];
					var Author = "";
					var id = object.id;
					var image = object.get("Image");
					var hotPoint = object.get("clicknum");
					var title = object.get("title");
					switch(object.get("Author")) {
						case "0":
							Author = "芭比bong";
							break;
						case "1":
							Author = "菠萝毛毛球";
							break;
						case "2":
							Author = "草莓宇航员";
							break;
						default:
							Author = "神秘人";
							break;
					}
					sVideoAdvice += "<li><a href='../Video/Detail.html?url=" + id + "' external>";
					sVideoAdvice += '<div class="vImg"><img src="' + image + '" alt="">';
					sVideoAdvice += '<div class="watchArea"><i class="watchIcon"></i><span class="num">' + hotPoint + '</span>';
					sVideoAdvice += '</div></div><div class="vTitle">' + title + '</div>';
					sVideoAdvice += '<div class="vPlayer">' + Author + '</div></a></li>';
				}
				$(".vul").append(sVideoAdvice);
			},
			error: function(error) {
				$.alert("数据查询失败！错误码：" + error.code + "错误信息：" + error.message);
			}
		});
		//树状列表选择tab切换
		$(page).on("click", ".branch li", function(e, id) {
			$(this).addClass("active").siblings("li").removeClass("active");
		});
		//分类查询
		$(page).on("click", "#typeSearch", function(e, id) {
			var type = $("#typeBranch li.active").attr("data-type");
			if(type != "all") {
				var typeSearch = Bmob.Object.extend("ExpertVideo");
				var query = new Bmob.Query(typeSearch);
				query.equalTo("vtype", type);
				query.find({
					success: function(results) {
						// 循环处理查询到的数据
						var sVideoAdvice = "";

						for(var i = 0; i < results.length; i++) {
							var object = results[i];
							var Author = "";
							var id = object.id;
							var image = object.get("Image");
							var hotPoint = object.get("clicknum");
							var title = object.get("title");
							switch(object.get("Author")) {
								case "0":
									Author = "芭比bong";
									break;
								case "1":
									Author = "菠萝毛毛球";
									break;
								case "2":
									Author = "草莓宇航员";
									break;
								default:
									Author = "神秘人";
									break;
							}
							sVideoAdvice += "<li><a href='../Video/Detail.html?url=" + id + "' external>";
							sVideoAdvice += '<div class="vImg"><img src="' + image + '" alt="">';
							sVideoAdvice += '<div class="watchArea"><i class="watchIcon"></i><span class="num">' + hotPoint + '</span>';
							sVideoAdvice += '</div></div><div class="vTitle">' + title + '</div>';
							sVideoAdvice += '<div class="vPlayer">' + Author + '</div></a></li>';
						}
						$(".vul").empty().append(sVideoAdvice);
					},
					error: function(error) {
						$.alert("查询失败: " + error.code + " " + error.message);
					}
				});
			} else {
				setTimeout(function() {
					var allSearch = Bmob.Object.extend("ExpertVideo");
					var query = new Bmob.Query(allSearch);
					// 查询所有数据
					query.find({
						success: function(results) {
							// 循环处理查询到的数据
							var sVideoAdvice = "";

							for(var i = 0; i < results.length; i++) {
								var object = results[i];
								var Author = "";
								var id = object.id;
								var image = object.get("Image");
								var hotPoint = object.get("clicknum");
								var title = object.get("title");
								switch(object.get("Author")) {
									case "0":
										Author = "芭比bong";
										break;
									case "1":
										Author = "菠萝毛毛球";
										break;
									case "2":
										Author = "草莓宇航员";
										break;
									default:
										Author = "神秘人";
										break;
								}
								sVideoAdvice += "<li><a href='../Video/Detail.html?url=" + id + "' external>";
								sVideoAdvice += '<div class="vImg"><img src="' + image + '" alt="">';
								sVideoAdvice += '<div class="watchArea"><i class="watchIcon"></i><span class="num">' + hotPoint + '</span>';
								sVideoAdvice += '</div></div><div class="vTitle">' + title + '</div>';
								sVideoAdvice += '<div class="vPlayer">' + Author + '</div></a></li>';
							}
							$(".vul").empty().append(sVideoAdvice);
						},
						error: function(error) {
							$.alert("查询失败: " + error.code + " " + error.message);
						}
					});
				}, 300);
			}
		})
	});
	//评论页
	$(document).on("pageInit", "#PubView-comment", function(e, id, page) {
		//本评论页作品id
		var proid = window.location.toString().split("=");
		proid = proid[1];
		var showComment = Bmob.Object.extend("Comment");
		var query = new Bmob.Query(showComment);
		query.equalTo("proId", proid);
		query.find({
			success: function(results) {
				var sLi = "";
				var userImg = [];
				var userName = [];
				for(var i = 0; i < results.length; i++) {
					var object = results[i];
					var query = new Bmob.Query(Bmob.User);
					var authorId = object.get("authorId");
					query.get(authorId, {
						success: function(result) {
							nameObj = result.get("username");
							imgObj = result.get("Image");
							userImg.push(imgObj);
							userName.push(nameObj);
						},
						error: function(error) {
							nameObj = "../../img/member.png";
							imgObj = "未知";
							userImg.push(imgObj);
							userName.push(nameObj);
						}
					});
					console.log(new Date() + userImg);
				}
				setTimeout(function() {
					if(userImg.length != 0) {
						for(var i = 0; i < userImg.length; i++) {
							var object = results[i];
							var content = object.get("content");
							var date = object.createdAt;

							sLi += '<li><div class="firLine"><div class="userImg">';
							sLi += '<img src="' + userImg[i] + '"/></div>';
							sLi += '<div class="right"><div class="username">' + userName[i] + '</div>';
							sLi += '<div class="commenttime">' + date + '</div></div></div>';
							sLi += '<div class="list-block"><div class="commentcon">' + content + '</div></div></li>';
						}
					} else {
						$.alert("加载速度出错");
						console.log(new Date());
					}
					$(".commentUl").append(sLi);
				}, 300);
			},
			error: function(error) {
				$.alert("查询出错！错误码：" + error.code + "错误信息：" + error.message);
			}
		});
		//发布评论
		$(page).on("click", "#pubCom", function(e, id) {
			var content = $("#comment").val();
			var currentUser = Bmob.User.current();
			var proId = proid;
			if(currentUser) {
				var authorId = currentUser.id;
				if(content == null || content == "") {
					$.alert("内容不得为空！");
				} else {
					//创建类和实例
					var Comment = Bmob.Object.extend("Comment");
					var commentItem = new Comment();
					commentItem.set("proId", proId);
					commentItem.set("content", content);
					commentItem.set("authorId", authorId);
					//添加数据，第一个入口参数是null
					commentItem.save(null, {
						success: function() {
							location.reload();
						},
						error: function(error) {
							// 添加失败
							alert('添加数据失败，返回错误信息：' + error.description);
						}
					});
				}
			} else {
				//去往登录界面
				window.location.href = "../html/Account/login.html";
			}
		});

	});
	//音频详情页
	$(document).on("pageInit", "#Audio-detail", function(e, id, page) {
		//本音频id
		var aid = window.location.toString().split("=");
		aid = aid[1];
		var ExpertAudio = Bmob.Object.extend("ExpertAudio");
		var query = new Bmob.Query(ExpertAudio);
		var audio = document.getElementById("audio");

		//查询单条数据，第一个参数是这条数据的objectId值
		query.get(aid, {
			success: function(expertAudio) {
				// 查询成功，调用get方法获取对应属性的值
				var Url = expertAudio.get("Url");
				var title = expertAudio.get("title");
				var Image = expertAudio.get("Image");
				expertAudio.set("clicknum", expertAudio.get("clicknum") + 1);
				expertAudio.save(null, {
					success: function(objectUpdate) {
						console.log(objectUpdate.get("clicknum"));
					},
					error: function(model, error) {
						alert("更新失败！");
					}
				});
				$("#music-img").attr("src", Image);
				$(".audioTitle").text(title);
				$("#title").text(title);
				$("#audio source").attr("src", Url);
			},
			error: function(object, error) {
				$.alert("数据查询失败！错误码：" + error.code + "错误信息：" + error.message);
			}
		});
		//评论
		var editcomHref = "../PubView/comment.html?id=" + aid;
		$("#editComment").attr("href", editcomHref);
		//收藏
		var star = Bmob.Object.extend("Star");
		var query = new Bmob.Query(star);
		var currentUser = Bmob.User.current();
		if(currentUser) {
			query.equalTo("userId", currentUser.id);
			query.equalTo("proId", aid);
			query.find({
				success: function(result) {
					if(result.length == 0) {
						$(".starIcon").removeClass("active");
						console.log("no");
					} else {
						$(".starIcon").addClass("active");
						console.log("yes");
					}
				},
				error: function(error) {
					alert(error.message);
				},
			})
		} else {
			$.alert("请先登录！");
			setTimeout(function() {
				window.location.href = "../Account/login.html";
			}, 500);
		}
		$(page).on("click", ".starIcon", function(e, id) {
			var star = Bmob.Object.extend("Star");
			var query = new Bmob.Query(star);
			var currentUser = Bmob.User.current();
			if(currentUser) {
				query.equalTo("userId", currentUser.id);
				query.equalTo("proId", aid);
				query.find({
					success: function(result) {
						if(result.length == 0) {
							$(".starIcon").addClass("active");
							var Star = Bmob.Object.extend("Star");
							var star = new Star();
							star.set({
								"proId": aid,
								"userId": currentUser.id,
								"type": "1",
							});
							star.save(null, {
								success: function(object) {
									console.log("保存成功！");
								},
								error: function(model, error) {
									alert("添加收藏失败-错误码：" + error.code + "错误信息：" + error.message);
								}
							});
						} else {
							$(".starIcon").removeClass("active");
							query.destroyAll({
								success: function() {
									console.log("删除成功！");
								},
								error: function(model, error) {
									console.log("删除收藏失败-错误码：" + error.code + "错误信息：" + error.message);
								}
							});
						}
					},
					error: function(error) {
						alert(error.message);
					},
				})
			} else {
				$.alert("请先登录！");
				setTimeout(function() {
					window.location.href = "../Account/login.html";
				}, 500);
			}
		});
		//音频播放
		var $audio = $("#audio")[0];
		$voiceBar = $("#voice-bar");
		$voicedBar = $("#voiced-bar");
		$musicBar = $("#music-bar");
		$loadBar = $("#load-bar");
		$playedBar = $("#played-bar");
		$currentTime = $("#current-time");
		$totalTime = $("#total-time");
		//是否循环播放
		audio.loop = true;
		//是否自动播放
		audio.autoplay = false;
		// 是否自动缓冲加载
		audio.autobuffer = false;

		//计算歌曲时长
		setTimeout(function() {
			var fen = parseInt(audio.duration / 60);
			var miao = parseInt(audio.duration % 60);
			if(miao < 10) {
				miao = '0' + miao;
			}
			var totalTime = fen + ':' + miao;
			$totalTime.text(totalTime);
		}, 3000);

		// 初始化音量
		audio.volume = 0.5;
		var voicedBarWidth = ($audio.volume / 1) * $voiceBar.width() + "px";
		$voicedBar.css("width", voicedBarWidth);
		//静音按钮
		$(page).on("click", "#jingyin", function(e, id) {
			audio.volume = 0;
			$voicedBar.css("width", 0);
		});
		//音量调节
		$(page).on("click", "#voice-bar", function(e, id) {
			var voiceBarWidth = $voiceBar.width();
			var newVolume = (e.offsetX / voiceBarWidth);
			audio.volume = newVolume;

			//音量条更新
			var voicedBarWidth = (audio.volume / 1) * $voiceBar.width() + "px";
			$voicedBar.css("width", voicedBarWidth);
		});
		//音频播放
		function updatePlayedBar() {
			//进度条跟随
			var musicBarWidth = $musicBar.width();
			var playedBarWidth = (audio.currentTime / audio.duration) * musicBarWidth + 'px';
			var time = '00:00';
			$playedBar.width(playedBarWidth);
			//进度数字跟随
			if(audio.currentTime % 60 < 10) {
				time = parseInt(audio.currentTime / 60) + ':0' + parseInt(audio.currentTime % 60);
			} else {
				time = parseInt(audio.currentTime / 60) + ':' + parseInt(audio.currentTime % 60);
			}
			$currentTime.text(time);
		}
		var num = 1;
		var timer;
		var timerBuffer;
		$(page).on("click", "#play", function(e, id) {
			if(num == "1") {
				audio.play();
				$(this).children("i").removeClass("playIcon").addClass("pauseIcon");
				num = -num;
				//进度条
				timer = setInterval(updatePlayedBar, 1000);
			} else {
				audio.pause();
				$(this).children("i").removeClass("pauseIcon").addClass("playIcon");
				num = -num;
				clearInterval(timer);
			}
		});
		//缓冲条
		setInterval(function() {
			var buffered, percent;
			// 已缓冲部分
			audio.readyState == 4 && (buffered = audio.buffered.end(0));
			// 已缓冲百分百
			audio.readyState == 4 && (percent = Math.round(buffered / audio.duration * 100) + '%');
			var loadWid = (Math.round(buffered / audio.duration * 100) * $musicBar.width() * 0.01) + 'px';
			$loadBar.css("width", loadWid);
		}, 1000);

		//拖动滚动条
		$(page).on("click", "#music-bar", function(e, id) {
			var musicBarWidth = $musicBar.width();
			var newCurrentTime = (event.offsetX / musicBarWidth) * audio.duration;
			audio.currentTime = newCurrentTime;
			var playedBarWidth = (audio.currentTime / audio.duration) * musicBarWidth;
			$playedBar.css("width", playedBarWidth + "px");
		});
	});
	//音频中心首页
	$(document).on("pageInit", "#Audio-index", function(e, id, page) {
		//二级菜单方法
		$(page).on("click", ".node", function(e, id) {
			if($(this).children(".icon").hasClass("icon-down")) {
				$(this).children(".icon").removeClass("icon-down").addClass("icon-up");
				$(this).siblings(".branch").show();
			} else {
				$(this).children(".icon").removeClass("icon-up").addClass("icon-down");
				$(this).siblings(".branch").hide();
			}
		});
		//树状列表选择tab切换
		$(page).on("click", ".branch li", function(e, id) {
			$(this).addClass("active").siblings("li").removeClass("active");
		});
		//展示所有的音频数据
		function findAll() {
			var audioAdvice = Bmob.Object.extend("ExpertAudio");
			var query = new Bmob.Query(audioAdvice);
			query.find({
				success: function(result) {
					var sAudioAdvice = "";

					for(var i = 0; i < result.length; i++) {
						var object = result[i];
						var id = object.id;
						var Author = object.get("Author");
						var hotPoint = object.get("clicknum");
						var title = object.get("title");

						sAudioAdvice += '<li><a href="../Audio/Detail.html?id=' + id + '" external><div class="atitle">' + title + '</div>';
						sAudioAdvice += '<div class="player">' + Author + '</div><div class="time">' + hotPoint + '</div><i class="hotIcon"></i></a></li>';
					}
					$(".audioUl").text("");
					$(".audioUl").append(sAudioAdvice);
				},
				error: function(error) {
					$.alert("数据查询失败！错误码：" + error.code + "错误信息：" + error.message);
				}
			});
		}
		findAll();
		//分类查询
		$(page).on("click", "#typeSearch", function(e, id) {
			var type = $("#typeBranch li.active").attr("data-type");
			if(type != "all") {
				var typeSearch = Bmob.Object.extend("ExpertAudio");
				var query = new Bmob.Query(typeSearch);
				query.equalTo("atype", type);
				query.find({
					success: function(result) {
						var sAudioAdvice = "";

						for(var i = 0; i < result.length; i++) {
							var object = result[i];
							var id = object.id;
							var Author = object.get("Author");
							var hotPoint = object.get("clicknum");
							var title = object.get("title");

							sAudioAdvice += '<li><a href="../Audio/Detail.html?id=' + id + '" external><div class="atitle">' + title + '</div>';
							sAudioAdvice += '<div class="player">' + Author + '</div><div class="time">' + hotPoint + '</div><i class="hotIcon"></i></a></li>';
						}
						$(".audioUl").text("");
						$(".audioUl").append(sAudioAdvice);
					},
					error: function(error) {
						$.alert("数据查询失败！错误码：" + error.code + "错误信息：" + error.message);
					}
				});

			} else {
				findAll();
			}
		});
	});
	//我收藏的音频
	$(document).on("pageInit", "#Member-starAudio", function(e, id, page) {
		var currentUser = Bmob.User.current();
		var userId = currentUser.id;

		var star = Bmob.Object.extend("Star");
		var query = new Bmob.Query(star);
		query.equalTo({
			"userId": userId,
			"type": "1",
		});
		query.find({
			success: function(results) {
				if(results.length > 0) {
					var aDate = [];
					var aProId = [];
					for(var i = 0; i < results.length; i++) {
						var date = results[i].createdAt;
						var proId = results[i].get("proId");
						aDate.push(date);
						aProId.push(proId);
					}
					var audioSearch = Bmob.Object.extend("ExpertAudio");
					var query = new Bmob.Query(audioSearch);
					var sItem = "";
					console.log(aDate);
					for(var i = 0; i < results.length; i++) {
						var index = i;
						query.get(aProId[i], {
							success: function(result) {
								var id = result.id;
								var title = result.get("title");
								var author = result.get("Author");
								var clicknum = result.get("clicknum");

								sItem += '<div class="dayscon"><div class="daytime">' + aDate[index] + '</div>';
								sItem += '<ul class="audioUl"><li><a href="../Audio/Detail.html?id=' + id + '" external>';
								sItem += '<div class="atitle">' + title + '</div>';
								sItem += '<div class="player">' + author + '</div><div class="time">' + clicknum + '</div>';
								sItem += '<i class="hotIcon"></i></a></li></ul></div>';
								$(".days").append(sItem);
								sItem = "";
							},
							error: function(error) {
								console.log("查询出错！")
							}
						})
					}
				} else {
					var sItem = '<div style="text-align:center;font-size:20px;height:5rem;line-height:5rem;">还没有收藏哦</div>';
					$(".days").append(sItem);
				}
			}
		})
	});
	//我收藏的视频
	$(document).on("pageInit", "#Member-starVideo", function(e, id, page) {
		var currentUser = Bmob.User.current();
		var userId = currentUser.id;

		var star = Bmob.Object.extend("Star");
		var query = new Bmob.Query(star);
		query.equalTo({
			"userId": userId,
			"type": "2",
		});
		query.find({
			success: function(results) {
				console.log(results);
				if(results.length > 0) {
					var aDate = [];
					var aProId = [];
					for(var i = 0; i < results.length; i++) {
						var date = results[i].createdAt;
						var proId = results[i].get("proId");
						aDate.push(date);
						aProId.push(proId);
					}
					var audioSearch = Bmob.Object.extend("ExpertVideo");
					var query = new Bmob.Query(audioSearch);
					var sItem = "";
					for(var i = 0; i < results.length; i++) {
						var index = i;
						query.get(aProId[i], {
							success: function(result) {
								var id = result.id;
								var title = result.get("title");
								var author = "";
								switch(result.get("Author")) {
									case "0":
										author = "芭比bong";
										break;
									case "1":
										author = "菠萝毛毛球";
										break;
									case "2":
										author = "草莓宇航员";
										break;
									default:
										author = "神秘人";
										break;
								}
								var clicknum = result.get("clicknum");
								var img = result.get("Image");
								sItem += '<div class="dayscon"><div class="daytime">' + aDate[index] + '</div>';
								sItem += '<div class="videoList"><ul class="vul"><li><a href="../Video/Detail.html?id=' + id + '" external>';
								sItem += '<div class="vImg"><img src="' + img + '"><div class="watchArea">';
								sItem += '<i class="watchIcon"></i><span class="num">' + clicknum + '</span>';
								sItem += '</div></div><div class="vTitle">' + title + '</div>';
								sItem += '<div class="vPlayer">' + author + '</div></a></li></ul></div></div>';
								$(".days").append(sItem);
								sItem = "";
							},
							error: function(error) {
								console.log("查询出错！")
							}
						})
					}
				} else {
					var sItem = '<div style="text-align:center;font-size:20px;height:5rem;line-height:5rem;">还没有收藏哦</div>';
					$(".days").append(sItem);
				}
			}
		})
	});
	//社区首页
	$(document).on("pageInit", "#Sociaty-index", function(e, id, page) {});
	//个人中心详情页
	$(document).on("pageInit", "#Member-detail", function(e, id, page) {
		var currentUser = Bmob.User.current();
		var username = currentUser.get("username");
		var userimg = currentUser.get("Image");
		$("#username").text(username);
		$("#userImg img").attr("src", userimg);
		console.log(currentUser)
	});
	//个人中心详情页-修改昵称
	$(document).on("pageInit", "#Member-editNickName", function(e, id, page) {
		var currentUser = Bmob.User.current();
		var username = currentUser.get("username");
		$("#newNickname").val(username);
		$(page).on("click", "#config", function(e, id) {
			e.preventDefault();
			var newUname = $("#newNickname").val();
			if(newUname != "" || newUname != null) {
				var query = new Bmob.Query(Bmob.User);
				// 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
				query.get(currentUser.id, {
					success: function(object) {
						// 回调中可以取得这个 GameScore 对象的一个实例，然后就可以修改它了
						object.set('username', newUname);
						object.save();
						console.log("修改昵称成功！");
						setTimeout(function() {
							window.location.href = "Detail.html";
						}, 300);
					},
					error: function(object, error) {
						console.log("修改昵称失败！");
					}
				});
			} else {
				$.alert("昵称不能为空！");
			}
		});
	})
	//sui初始化
	$.init();
});