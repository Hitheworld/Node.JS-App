var express = require("express");
var path = require("path");
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var _ = require("underscore");
var Movie = require("./models/movie");
var User = require("./models/user");
var port = process.env.PORT || 3000;
var app = express();

mongoose.connect("mongodb://127.0.0.1:27017/imooc");

app.set("views","./views/pages");  //视图的默认目录
app.set("view engine","jade");
app.use(bodyParser.urlencoded({ extended: true }));   //格式化表单数据
app.use(express.static(path.join(__dirname,"public")));  //静态资源的获取
app.locals.moment = require("moment");  //时间模式化
app.listen(port);

console.log("电影站地址"+port);
/**
* mongoose
* 模式Schema(对字段和字段类型进行定义)、
* 模型Model(对传入的模式进行编译生成构造函数)、
* 文档实例化Documents(调用模型就可以进行实例化,传入数据,调用save(function(){..})方法)
	数据库查询
	    批量查询  Movie .find({})
	    单条查询  Movie .findOne({_id:id})
	删除
		单条删除(传入特定的k和y)  Movie .remove({_id:id},function(err,movie){if(err){...}})
*/

/*首页*/
app.get("/",function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}

		//渲染页面
		res.render("index",{
			title:"电影首页",
			movies: movies
		});
	});
});

// signup 注册
app.post("/user/signup", function(req, res){
	var _user = req.body.user;
	//  获取user， req.param("user")  (注意：param会先从路由里去拿，再去拿ajax data里的，最后再拿?userid里的)
	//  /user/signup/:userid   req.params.userid
	//  /user/signup/111?userid=1112     req.query.userid
	var user = new User(_user);

	user.save(function(err, user){
		if (err) {
			console.log(err);
		}
		console.log(user);
	});
});


/*详情页*/
app.get("/movie/:id",function(req,res){
	var id = req.params.id;

	Movie.findById(id, function(err,movie){
		res.render("detail",{
			title:"电影站-"+movie.title,
			movie: movie
		});
	});
});



/*后台管理-详情页-添加数据*/
app.get("/admin/movie",function(req,res){
	res.render("admin",{
		title:"后台管理-录入",
		movie:{
			title:"",
			doctor:"",
			country:"",
			year:"",
			poster:"",
			flash:"",
			summary:"",
			language:""
		}
	});
});


// admin update movie
app.get("/admin/update/:id",function(req,res){
	// 获取到id
	var id = req.params.id;

	//判断id是否存在
	if(id){
		Movie.findById(id,function(err,movie){
			res.render("admin",{
				title: "电影站-后台更新页面",
				movie: movie
			});
		});
	}
});



// admin post movie
app.post("/admin/movie/new",function(req,res){
	// 判断是否是新加或者是更新的数据
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;

	if(id !== "undefined"){
		Movie.findById(id, function(err, movie){
			if(err){
				console.log(err);
			}

			//替换老的数据
			_movie = _.extend(movie, movieObj);
			_movie.save(function(err, movie){
				if(err){
					console.log(err);
				}

				//重定向到详情页面
				res.redirect("/movie/"+movie._id);
			});
		});
	} else {

		// 新加的数据
		_movie = new Movie({
			doctor: movieObj.doctor,
			title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			year: movieObj.year,
			poster: movieObj.poster,
			summary: movieObj.summary,
			flash: movieObj.flash
		});

		_movie.save(function(err,movie){
			if(err){
				console.log(err);
			}

			//重定向到详情页面
			res.redirect("/movie/"+movie._id);
		});
	}
});

/*后台管理-首页*/
app.get("/admin/list",function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}

		//渲染页面
		res.render("list",{
			title:"后台管理-列表",
			movies: movies
		});
	});
});


// list delete movie
app.delete("/admin/list", function(req,res){
	var id = req.query.id;

	if(id){
		Movie.remove({_id: id}, function(err,movie){
			if(err){
				console.log(err);
			}
			else
			{
				res.json({success:1});
			}
		});
	}
});



