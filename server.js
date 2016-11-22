var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

var config = {
    user: 'ramit0402',
    database: 'ramit0402',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};
config=testdb();

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'someRandomSecretValue',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30}
}));

var users = [];
var comments = [];
var posts = [];
var counter;
var pool = new Pool(config);

get_posts();
get_comments();
get_users();

app.get('/posts', function (req, res) {
    res.redirect('/');
});

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}



app.get('/submit-comment/:postID', function(req, res){
    if (req.session && req.session.auth && req.session.auth.userId) {
        var postID = req.params.postID;
        var author = req.session.username;
        var content = escapeHtml(req.query.content);
        
        /* Write to database */
        var query = "INSERT INTO comments (post_id, comment_author, comment_content, comment_date) values ('"+postID+"','"+author+"','"+content+"',now());";
        pool.query(query, function(err, results){
            if (err){
                res.status(403).send(err.toString());
            } else {
                res.send(author);
            }
        });
    }
});


app.get('/posts/:postID', function (req, res) {
    get_posts();
    get_comments();
    get_users();
    res.send(postTemplate(req.params.postID));
});



app.get('/user/:username', function(req, res){
    var username = req.params.username;
    get_comments();
    var htmlTemplate=`
    <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>IMAD Blog WebApp</title>
            <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
            <link href="css/clean-blog.min.css" rel="stylesheet">
            <link href="vendor/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
            <link href='//fonts.googleapis.com/css?family=Lora:400,700,400italic,700italic' rel='stylesheet' type='text/css'>
            <link href='//fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800' rel='stylesheet' type='text/css'>
            <link href="../css/modal.css" rel="stylesheet">
            <link href="../css/post-comment.css" rel="stylesheet">
        </head>
        <body>
    `;
    for (var i = 0; i < comments.length; i++) {
                if (comments[i].comment_author === username){ 
                  htmlTemplate = htmlTemplate +  `
                   <div class="col-sm-8 col-sm-offset-2">
                        <div class="panel panel-white post panel-shadow">
                            <div class="post-heading">
                                <div class="pull-left image">
                                    <a href=/user/`+comments[i].comment_author+`><img src="http://bootdey.com/img/Content/user_`+findUser(comments[i].comment_author).displaypic+`.jpg" class="img-circle avatar" alt="user profile image"></a>
                                </div>
                                <div class="pull-left meta">
                                    <div class="title h5">
                                        <a href=/user/`+comments[i].comment_author+`><b>`+comments[i].comment_author+`</b></a> made a comment.
                                    </div>
                                    <h6 class="text-muted time">`+(comments[i].comment_date).toGMTString()+`</h6>
                                </div>
                            </div> 
                            <div class="post-description"> 
                                <p>`+comments[i].comment_content+`</p>
                            </div>
                        </div>
                    </div>
                            
                       ` ;
                   }
               }

       htmlTemplate = htmlTemplate + `
</body>
       	            <script src="vendor/jquery/jquery.min.js"></script>
            <script src="vendor/bootstrap/js/bootstrap.min.js"></script>
            <script src="js/clean-blog.min.js"></script>
            <script src="../main.js"></script>
            <script src="../article.js"></script>
        </body>
        </html>
       `;
          res.send(htmlTemplate);
});	



function createTemplateArticle(data) {
    
    var title = data.title;
    var date = data.date;
    var heading = data.heading;
    var content = data.content;
    
    var htmlTemplate = `
        <!DOCTYPE html>
<html lang="en">
<head>
	<link rel="icon" type="image/png" href="images/logo_blog.png" sizes="16x16">
	<link rel="icon" type="image/png" href="images/logo_blog.png" sizes="32x32">
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<title>Home-Blog</title>

	<!--BOOTSTRAP CSS-->
	<link href="css/bootstrap.css" rel="stylesheet">

	<!--CUSTOM CSS-->
	<link href="css/style-article.css" rel="stylesheet">

	<!--JQUERY JAVASCRIPT-->
	<script src="js/jquery.js"></script>

	<!--BOOTSTRAP JAVASCRIPT-->
	<script src="js/bootstrap.js"></script>
</head>
	
<body>
	<!--NAVBAR-->
	<nav class="navbar navbar-inverse navbar-fixed-top">
		<div class="container-fluid"><!-- Brand and toggle get grouped for better mobile display -->
			<div class="navbar-header">
				<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
					<span class="sr-only">Toggle navigation</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</button>
				<a class="navbar-brand" href="/"><img src="images/logo_blog.png" alt="LOGO" ></a>
			</div>

			<!-- Collect the nav links, forms, and other content for toggling -->
			<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
				<ul class="nav navbar-nav">
					<!--<li class="active"><a href="#">Link <span class="sr-only">(current)</span></a></li>-->----
					<li><a id="home" href="/">Home</a></li>
					<li><a id="article" href="#articleSection">My Articles</a></li>
					<li class="dropdown">
						<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Browse <span class="caret"></span></a>
						<ul class="dropdown-menu">
							<li><a href="#trendingSection"><span class="btn-sm glyphicon glyphicon-headphones" aria-hidden="true"></span>    Trending</a></li>
							<li><a href="#featuredSection"><span class="btn-sm glyphicon glyphicon-headphones" aria-hidden="true"></span>    Featured </a></li>
							<li><a href="#newSection"><span class="btn-sm glyphicon glyphicon-headphones" aria-hidden="true"></span>    New Articles</a></li>
							<li><a href="#specialSection"><span class="btn-sm glyphicon glyphicon-headphones" aria-hidden="true"></span>    This Weeks Special</a></li>
							<li><a href="#blogSection"><span class="btn-sm glyphicon glyphicon-headphones" aria-hidden="true"></span>    All Blogs</a></li>
							<li role="separator" class="divider"></li>
							<li><a href="#peopleSection"><span class="btn-sm glyphicon glyphicon-menu-right" aria-hidden="true"></span>    People</a></li>
						</ul>
					</li>
					<li><a href="#aboutSection">About Me</a></li>
				</ul>
			</div><!-- /.navbar-collapse -->
		</div><!-- /.container-fluid -->
	</nav>
	<!--NAVBAR END-->

	<!--CONATINER START-->
	<div class="container col-md-8 col-md-offset-2">
		<h3>${heading}</h3>
        <div>${date.toDateString()}</div>
        <hr/>
        <div>${content}</div>
	</div>
	<!--CONATINER END-->
	<script type="text/javascript" src="/ui/article.js"></script>
</body>
</html>`; 
    return htmlTemplate;
}

function createTemplateSection(data) {
    
    var content = data.content;
    
    var htmlTemplate = `
        <!DOCTYPE html>
<html lang="en">
<head>
	<link rel="icon" type="image/png" href="images/logo_blog.png" sizes="16x16">
	<link rel="icon" type="image/png" href="images/logo_blog.png" sizes="32x32">
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<title>Home-Blog</title>

	<!--BOOTSTRAP CSS-->
	<link href="css/bootstrap.css" rel="stylesheet">

	<!--CUSTOM CSS-->
	<link href="css/style.css" rel="stylesheet">

	<!--JQUERY JAVASCRIPT-->
	<script src="js/jquery.js"></script>

	<!--BOOTSTRAP JAVASCRIPT-->
	<script src="js/bootstrap.js"></script>
</head>
	
<body>
	<!--NAVBAR-->
	<nav class="navbar navbar-inverse navbar-fixed-top">
		<div class="container-fluid"><!-- Brand and toggle get grouped for better mobile display -->
			<div class="navbar-header">
				<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
					<span class="sr-only">Toggle navigation</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</button>
				<a class="navbar-brand" href="/"><img src="images/logo_blog.png" alt="LOGO" ></a>
			</div>

			<!-- Collect the nav links, forms, and other content for toggling -->
			<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
				<ul class="nav navbar-nav">
					<!--<li class="active"><a href="#">Link <span class="sr-only">(current)</span></a></li>-->----
					<li><a id="home" href="/">Home</a></li>
					<li><a id="article" href="#articleSection">My Articles</a></li>
					<li class="dropdown">
						<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Browse <span class="caret"></span></a>
						<ul class="dropdown-menu">
							<li><a href="#trendingSection"><span class="btn-sm glyphicon glyphicon-headphones" aria-hidden="true"></span>    Trending</a></li>
							<li><a href="#featuredSection"><span class="btn-sm glyphicon glyphicon-headphones" aria-hidden="true"></span>    Featured </a></li>
							<li><a href="#newSection"><span class="btn-sm glyphicon glyphicon-headphones" aria-hidden="true"></span>    New Articles</a></li>
							<li><a href="#specialSection"><span class="btn-sm glyphicon glyphicon-headphones" aria-hidden="true"></span>    This Weeks Special</a></li>
							<li><a href="#blogSection"><span class="btn-sm glyphicon glyphicon-headphones" aria-hidden="true"></span>    All Blogs</a></li>
							<li role="separator" class="divider"></li>
							<li><a href="#peopleSection"><span class="btn-sm glyphicon glyphicon-menu-right" aria-hidden="true"></span>    People</a></li>
						</ul>
					</li>
					<li><a href="#aboutSection">About Me</a></li>
				</ul>
			</div><!-- /.navbar-collapse -->
		</div><!-- /.container-fluid -->
	</nav>
	<!--NAVBAR END-->

	<!--CONATINER START-->
	${content}
	<!--CONATINER END-->
	<script type="text/javascript" src="/ui/article.js"></script>
</body>
</html>`; 
    return htmlTemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var pool = new Pool(config);
app.get('test-db', function (req, res) {
    pool.query('')
});

app.get('/article/:articleName', function (req,  res){
    
    pool.query("SELECT * FROM article WHERE title= '" + req.params.articleName+"'", function(err, result){
        if(err) {
            res.status(500).send(err.toString());
        } else {
            if (result.rows.length === 0) {
                res.status(404).send('Article Not Found ')
            } else {
                var articleData = result.rows[0];
                res.send(createTemplateArticle(articleData));
            }
        }
    });
});

app.get('/sec/:sectionName', function (req,  res){
    
    pool.query("SELECT * FROM section WHERE title= '" + req.params.sectionName+"'", function(err, result){
        if(err) {
            res.status(500).send(err.toString());
        } else {
            if (result.rows.length === 0) {
                res.status(404).send('Article Not Found ')
            } else {
                var articleData = result.rows[0];
                res.send(createTemplateSection(articleData));
            }
        }
    });
});

function hash (input, salt) {
    // How do we create a hash?
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ["pbkdf2", "10000", salt, hashed.toString('hex')].join('$');
}


app.get('/hash/:input', function(req, res) {
   var hashedString = hash(req.params.input, 'this-is-some-random-string');
   res.send(hashedString);
});

app.post('/create-user', function (req, res) {
   // username, password
   // JSON
   var username = req.body.username;
   var password = req.body.password;
   
   var salt = crypto.randomBytes(128).toString('hex');
   var dbString = hash(password, salt);
   pool.query('INSERT INTO "user" (username, password) VALUES ($1, $2)', [username, dbString], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send('User successfully created: ' + username);
      }
   });
});

app.post('/login', function (req, res) {
   var username = req.body.username;
   var password = req.body.password;
   
   pool.query('SELECT * FROM "user" WHERE username = $1', [username], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          if (result.rows.length === 0) {
              res.status(403).send('username/password is invalid');
          } else {
              // Match the password
              var dbString = result.rows[0].password;
              var salt = dbString.split('$')[2];
              var hashedPassword = hash(password, salt); // Creating a hash based on the password submitted and the original salt
              if (hashedPassword === dbString) {
                
                // Set the session
                req.session.auth = {userId: result.rows[0].id};
                // set cookie with a session id
                // internally, on the server side, it maps the session id to an object
                // { auth: {userId }}
                
                res.send('credentials correct!');
                
              } else {
                res.status(403).send('username/password is invalid');
              }
          }
      }
   });
});

app.get('/check-login', function (req, res) {
   if (req.session && req.session.auth && req.session.auth.userId) {
       // Load the user object
       pool.query('SELECT * FROM "user" WHERE id = $1', [req.session.auth.userId], function (err, result) {
           if (err) {
              res.status(500).send(err.toString());
           } else {
              res.send(result.rows[0].username);    
           }
       });
   } else {
       res.status(400).send('You are not logged in');
   }
});

app.get('/logout', function (req, res) {
   delete req.session.auth;
   res.send('<html><body>Logged out!<br/><br/><a href="/">Back to home</a></body></html>');
});

app.get('/css/:input', function (req, res) {
  res.sendFile(path.join(__dirname, 'css', req.params.input));
});

app.get('/js/:input', function (req, res) {
  res.sendFile(path.join(__dirname, 'js', req.params.input));
});

app.get('/article/css/:input', function (req, res) {
  res.sendFile(path.join(__dirname, 'css', req.params.input));
});

app.get('/article/js/:input', function (req, res) {
  res.sendFile(path.join(__dirname, 'js', req.params.input));
});

app.get('/sec/css/:input', function (req, res) {
  res.sendFile(path.join(__dirname, 'css', req.params.input));
});

app.get('/sec/js/:input', function (req, res) {
  res.sendFile(path.join(__dirname, 'js', req.params.input));
});

app.get('/images/:input', function (req, res) {
  res.sendFile(path.join(__dirname, 'images', req.params.input));
});

app.get('/article/images/:input', function (req, res) {
  res.sendFile(path.join(__dirname, 'images', req.params.input));
});

app.get('/sec/images/:input', function (req, res) {
  res.sendFile(path.join(__dirname, 'images', req.params.input));
});

app.get('/fonts/:input', function (req, res) {
  res.sendFile(path.join(__dirname, 'fonts', req.params.input));
});

app.get('/article/fonts/:input', function (req, res) {
  res.sendFile(path.join(__dirname, 'fonts', req.params.input));
});

app.get('/sec/fonts/:input', function (req, res) {
  res.sendFile(path.join(__dirname, 'fonts', req.params.input));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
