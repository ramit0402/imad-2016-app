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

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'someRandomSecretValue',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30}
}));

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
					<li><a href="/">Home</a></li>
					<li class="dropdown">
						<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Browse <span class="caret"></span></a>
						<ul class="dropdown-menu">
							<li><a href="/sec/trending"><span class="btn-sm glyphicon glyphicon-headphones" aria-hidden="true"></span>    Trending</a></li>
							<li><a href="/sec/trending"><span class="btn-sm glyphicon glyphicon-headphones" aria-hidden="true"></span>    Featured </a></li>
							<li><a href="/sec/trending"><span class="btn-sm glyphicon glyphicon-headphones" aria-hidden="true"></span>    New Articles</a></li>
							<li><a href="/sec/trending"><span class="btn-sm glyphicon glyphicon-headphones" aria-hidden="true"></span>    This Weeks Special</a></li>
							<li><a href="/sec/trending"><span class="btn-sm glyphicon glyphicon-headphones" aria-hidden="true"></span>    All Blogs</a></li>
							<li role="separator" class="divider"></li>
							<li><a href="/sec/trending"><span class="btn-sm glyphicon glyphicon-menu-right" aria-hidden="true"></span>    People</a></li>
						</ul>
					</li>
					<li><a href="ui/about.html">About Me</a></li>
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
        <hr/>
      <h4>Comments</h4>
      <div id="comment_form">
      </div>
      <div id="comments">
        <center>Loading comments...</center>
      </div>
      <footer id="footer">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
            <div class="text-center center-block"  style="margin-top:200px">
                <p class="txt-railway">- BLOGS ONLINE -</p>
                <a href="https://github.com/ramit0402"><i class="fa fa-github" style="font-size:36px"></i></a>
                <a href="https://www.facebook.com/ramitlegend"><i class="fa fa-facebook-official" style="font-size:36px"></i></a>
                <a href="https://plus.google.com/u/1/+RamitMuralidharan02"><i class="fa fa-google-plus-official" style="font-size:36px"></i></a>
                <a href="https://twitter.com/ramit1996"><i class="fa fa-twitter" style="font-size:36px"></i></a>
                <a href="mailto:ramit0402@gmail.com"><i class="fa fa-google" style="font-size:36px"></i></a>
            </div>
        </footer>
	</div>
	
	<!--CONATINER END-->
	<script type="text/javascript" src="../js/article.js"></script>
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
					<li><a href="/">Home</a></li>
					<li class="dropdown">
						<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Browse <span class="caret"></span></a>
						<ul class="dropdown-menu">
							<li><a href="trending"><span class="btn-sm glyphicon glyphicon-headphones" aria-hidden="true"></span>    Trending</a></li>
							<li><a href="trending"><span class="btn-sm glyphicon glyphicon-headphones" aria-hidden="true"></span>    Featured </a></li>
							<li><a href="trending"><span class="btn-sm glyphicon glyphicon-headphones" aria-hidden="true"></span>    New Articles</a></li>
							<li><a href="trending"><span class="btn-sm glyphicon glyphicon-headphones" aria-hidden="true"></span>    This Weeks Special</a></li>
							<li><a href="trending"><span class="btn-sm glyphicon glyphicon-headphones" aria-hidden="true"></span>    All Blogs</a></li>
							<li role="separator" class="divider"></li>
							<li><a href="trending"><span class="btn-sm glyphicon glyphicon-menu-right" aria-hidden="true"></span>    People</a></li>
						</ul>
					</li>
					<li><a href="ui/about.html">About Me</a></li>
				</ul>
			</div><!-- /.navbar-collapse -->
		</div><!-- /.container-fluid -->
	</nav>
	<!--NAVBAR END-->
	<!--CONATINER START-->
	<div class="container col-md-10 col-md-offset-1" style="padding-top:150px;text-align:center">
    	${content}
    	<footer id="footer" >
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
            <div class="text-center center-block" style="padding-top:200px" >
                <p class="txt-railway" style="padding-top:200px">- BLOGS ONLINE -</p>
                <a href="https://github.com/ramit0402"><i class="fa fa-github" style="font-size:36px"></i></a>
                <a href="https://www.facebook.com/ramitlegend"><i class="fa fa-facebook-official" style="font-size:36px"></i></a>
                <a href="https://plus.google.com/u/1/+RamitMuralidharan02"><i class="fa fa-google-plus-official" style="font-size:36px"></i></a>
                <a href="https://twitter.com/ramit1996"><i class="fa fa-twitter" style="font-size:36px"></i></a>
                <a href="mailto:ramit0402@gmail.com"><i class="fa fa-google" style="font-size:36px"></i></a>
            </div>
        </footer>
    </div>
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
   // {"username": "tanmai", "password": "password"}
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

app.get('/get-comments/:articleName', function (req, res) {
   // make a select request
   // return a response with the results
   pool.query('SELECT comment.*, "user".username FROM article, comment, "user" WHERE article.title = $1 AND article.id = comment.article_id AND comment.user_id = "user".id ORDER BY comment.timestamp DESC', [req.params.articleName], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send(JSON.stringify(result.rows));
      }
   });
});

app.post('/submit-comment/:articleName', function (req, res) {
   // Check if the user is logged in
    if (req.session && req.session.auth && req.session.auth.userId) {
        // First check if the article exists and get the article-id
        pool.query('SELECT * from article where title = $1', [req.params.articleName], function (err, result) {
            if (err) {
                res.status(500).send(err.toString());
            } else {
                if (result.rows.length === 0) {
                    res.status(400).send('Article not found');
                } else {
                    var articleId = result.rows[0].id;
                    // Now insert the right comment for this article
                    pool.query(
                        "INSERT INTO comment (comment, article_id, user_id) VALUES ($1, $2, $3)",
                        [req.body.comment, articleId, req.session.auth.userId],
                        function (err, result) {
                            if (err) {
                                res.status(500).send(err.toString());
                            } else {
                                res.status(200).send('Comment inserted!')
                            }
                        });
                }
            }
       });     
    } else {
        res.status(403).send('Only logged in users can comment');
    }
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