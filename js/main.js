function loadLoginForm () {
    var loginHtml = `
    <div class="col-md-4 col-md-offset-4" style="border:1px solid black; border-radius:20px; padding:10px" >
        <h3>Login/Register</h3>
        <label for="username" class="col-sm-3 control-label">Username</label>
        <input type="text" class="form-control" id="username"  />
        <br/>
        <label for="password" class="col-sm-3 control-label">Password</label>
        <input type="password" class="form-control" id="password" />
        <br/>
        <input type="submit" style="margin-left:100px" class="btn btn-default" id="login_btn" value="Login" />
        <input type="submit" class="btn btn-default" id="register_btn" value="Register" />
        </br>
        </div>
        `;
    document.getElementById('login_area').innerHTML = loginHtml;
    
    // Submit username/password to login
    var submit = document.getElementById('login_btn');
    submit.onclick = function () {
        // Create a request object
        var request = new XMLHttpRequest();
        
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
                  submit.value = 'Sucess!';
              } else if (request.status === 403) {
                  submit.value = 'Invalid credentials. Try again?';
              } else if (request.status === 500) {
                  alert('Something went wrong on the server');
                  submit.value = 'Login';
              } else {
                  alert('Something went wrong on the server');
                  submit.value = 'Login';
              }
              loadLogin();
          }  
          // Not done yet
        };
        
        // Make the request
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        console.log(username);
        console.log(password);
        request.open('POST', '/login', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({username: username, password: password}));  
        submit.value = 'Logging in...';
        
    };
    
    var register = document.getElementById('register_btn');
    register.onclick = function () {
        // Create a request object
        var request = new XMLHttpRequest();
        
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
                  alert('User created successfully');
                  register.value = 'Registered!';
              } else {
                  alert('Could not register the user');
                  register.value = 'Register';
              }
          }
        };
        
        // Make the request
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        console.log(username);
        console.log(password);
        request.open('POST', '/create-user', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({username: username, password: password}));  
        register.value = 'Registering...';
    
    };
}

function loadLoggedInUser (username) {
    var loginArea = document.getElementById('login_area');
    var log = document.getElementById('login');
    log.innerHTML = `
        <li><a id="login" href="/logout">Logout</a></li>
    `;
    loginArea.innerHTML=`
    <div class="row">
		<div class="col-md-12">
			<div class="col-md-3">
				<img src="images/article3.jpg" class="img-responsive" alt="Image Article 3" >
			</div>
			<div class="col-md-6 " style="margin-top:40px">
				<a href="article/article-one"><h4>SHOPPING CASUAL WEAR AT CRAFTSVILLA</h4></a>
				<p>    If you know me, you know how obsessed I am with palazzos and all things comfy. My search for them led me to Craftsvilla and to be honest I was pleasantly overwhelmed and spoilt for choice.  Since I only wanted to look for something casual, that you can wear every day at home or work, I was happy that there were categories for office wear and casuals, party wear, and festive wear. It makes it really easy to look for what you want exactly, instead of getting lost.....</p>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="col-md-3 col-md-offset-3">
				<img src="images/article4.jpg" class="img-responsive" alt="Image Article 4" >
			</div>
			<div class="col-md-6 " style="margin-top:40px">
			    <a href="article/article-five"><h4>MAFIA III REVIEW - LOYALTY IS ROYALTY</h4></a>
				<p>    The Mafia series has had a bit of a patchy history so far, with the first game being beloved and the second getting a tepid response largely thanks to its open world which served as little more than decoration. With some six years since the release of Mafia II we get yet another developer trying to bring series back to into the public eye. The story setup is that a young black man by the name of Lincoln Clay returns from serving in the Vietnam war, and once again finds himself caught up in his families problems involving the various local gangs......</p>
			</div>
		</div>
	</div>
    `;
    
}

function loadLogin () {
    // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                loadLoggedInUser(this.responseText);
            } else {
                loadLoginForm();
            }
        }
    };
    
    request.open('GET', '/check-login', true);
    request.send(null);
}

function loadArticles () {
        // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            var articles = document.getElementById('articles');
            if (request.status === 200) {
                var content = '<ul>';
                var articleData = JSON.parse(this.responseText);
                for (var i=0; i< articleData.length; i++) {
                    content += `<li>
                    <a href="/articles/${articleData[i].title}">${articleData[i].heading}</a>
                    (${articleData[i].date.split('T')[0]})</li>`;
                }
                content += "</ul>"
                articles.innerHTML = content;
            } else {
                articles.innerHTML('Oops! Could not load all articles!')
            }
        }
    };
    
    request.open('GET', '/get-articles', true);
    request.send(null);
}


// The first thing to do is to check if the user is logged in!
loadLogin();

// Now this is something that we could have directly done on the server-side using templating too!
loadArticles();