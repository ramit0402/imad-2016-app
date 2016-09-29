<?php
include 'connect.php';
?>

<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" type="text/css" href="css/style.css" />
<title>Online Book Shopping</title>
</head>

<body>
<div id="container">
	<div id="header">
	<img width="8%" src="images/logo.png" alt="web developer directory">
        <h1><span class="blue-text">Bay</span> OfBooks</h1>
        <h2><a href="login.html"><span class="bl-text">Login</span></a> | <a href="signup.php"><span class="white-text">Sign Up</span></a></h2>
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
	 
	 
	 
	 <div id="leftmenu">
        <h3>Categories</h3>
        <ul>
            <li><a href="browse.html">Art & Photography</a></li>
            <li><a href="browse.html">Biography</a></li>
            <li><a href="browse.html">Business & Investments</a></li>
            <li><a href="browse.html">Children's Book</a></li>
            <li><a href="browse.html">College Text & Reference</a></li>
            <li><a href="browse.html">Computer & Internet</a></li>
            <li><a href="browse.html">Cooking Food & Wine</a></li>
            <li><a href="browse.html">Educational & Professional</a></li>
            <li><a href="browse.html">Entertainment</a></li>
            <li><a href="browse.html">Entrance Exam Prep</a></li>
        </ul>
    </div><!--leftmenu end-->
    
	<div id="content">
		<!--CONTENT HERE-->
    </div><!--content end-->
	
</div><!--container end-->
</body>
</html>
