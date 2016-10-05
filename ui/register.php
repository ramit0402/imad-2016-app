<?php
include 'connect.php';
?>

<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" type="text/css" href="css/stylec.css" />
<title>Online Book Shopping</title>
</head>

<body>
<div id="container">
	<div id="header">
	<img width="8%" src="images/logo.png" alt="web developer directory">
        <h1><span class="blue-text">Bay</span> OfBooks</h1>
        <h2><a href="login.html"><span class="bl-text">Login</span></a> | <a href="signup.html"><span class="white-text">Sign Up</span></a></h2>
     </div><!--header end-->
	 
	 <ul class="menu">
		<li class="dropdown">
			<a href="index.html" class="dropbtn">Home</a>
		</li>
		<li class="dropdown">
			<a href="#" class="dropbtn">Authors</a>
			<div class="dropdown-content">
				<a href="#">Link 1</a>
				<a href="#">Link 2</a>
				<a href="#">Link 3</a>
			</div>
		</li>
		<li class="dropdown">
			<a href="#" class="dropbtn">Publisher</a>
			<div class="dropdown-content">
				<a href="#">Link 1</a>
				<a href="#">Link 2</a>
				<a href="#">Link 3</a>
			</div>
		</li>
		<li class="dropdown">
			<a href="#" class="dropbtn">Indian Writing</a>
			<div class="dropdown-content">
				<a href="#">Link 1</a>
				<a href="#">Link 2</a>
				<a href="#">Link 3</a>
			</div>
		</li>
		<li class="dropdown">
			<a href="#" class="dropbtn">Fiction</a>
			<div class="dropdown-content">
				<a href="#">Link 1</a>
				<a href="#">Link 2</a>
				<a href="#">Link 3</a>
			</div>
		</li>
		<li class="dropdown">
			<a href="#" class="dropbtn">Non Fiction</a>
			<div class="dropdown-content">
				<a href="#">Link 1</a>
				<a href="#">Link 2</a>
				<a href="#">Link 3</a>
			</div>
		</li>
		<li class="dropdown">
			<a href="contact.html" class="dropbtn">Contact Us</a>
		</li>
	</ul>
    
	<div id="content">
		<section>
			<h2>Sign Up</h2>
			<form method="post" action="register_insert.php">
				<p>
					<label for="name">Name:</label>
					<input type="text" name="name">
				</p>
				<p>
					<label for="email">Email Address: </label>
					<input type="email" name="email">
				</p>
				<p>
					<label for="password"> PASSWORD: </label>
					<input type="password" name="password" >
				</p>
				<p>
					<label for="phone">Phone Number: </label>
					<input type="text" name="phone">
				</p>
				<p>
					<label for="add1">Address Line 1: </label>
					<input type="text" name="add1">
				</p>
				<p>
					<label for="add2">Address Line 2: </label>
					<input type="text" name="add2">
				</p>
				<p>
					<label for="state">State: </label>
					<input type="text" name="state">
				</p>
				<p>
					<label for="city">City: </label>
					<input type="text" name="city">
				</p>
				<p>
					<label for="pin">Pin Code: </label>
					<input type="text" name="pin">
				</p>
				<p>
					<input type="submit" value="Sign Up">
				</p>
			</form>
		</section>
    </div><!--content end-->
	
</div><!--container end-->
</body>
</html>