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
        <footer style="margin-top:300px">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <div class="text-center center-block">
            <p class="txt-railway">- BLOGS ONLINE -</p>
            <a href="https://github.com/ramit0402"><i class="fa fa-github" style="font-size:36px"></i></a>
            <a href="https://www.facebook.com/ramitlegend"><i class="fa fa-facebook-official" style="font-size:36px"></i></a>
            <a href="https://plus.google.com/u/1/+RamitMuralidharan02"><i class="fa fa-google-plus-official" style="font-size:36px"></i></a>
            <a href="https://twitter.com/ramit1996"><i class="fa fa-twitter" style="font-size:36px"></i></a>
            <a href="mailto:ramit0402@gmail.com"><i class="fa fa-google" style="font-size:36px"></i></a>
        </div>
    </footer>
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
    <footer style="margin-top:300px">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <div class="text-center center-block">
            <p class="txt-railway">- BLOGS ONLINE -</p>
            <a href="https://github.com/ramit0402"><i class="fa fa-github" style="font-size:36px"></i></a>
            <a href="https://www.facebook.com/ramitlegend"><i class="fa fa-facebook-official" style="font-size:36px"></i></a>
            <a href="https://plus.google.com/u/1/+RamitMuralidharan02"><i class="fa fa-google-plus-official" style="font-size:36px"></i></a>
            <a href="https://twitter.com/ramit1996"><i class="fa fa-twitter" style="font-size:36px"></i></a>
            <a href="mailto:ramit0402@gmail.com"><i class="fa fa-google" style="font-size:36px"></i></a>
        </div>
    </footer>
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