
// Initialize Firebase
var config = {
	apiKey: "AIzaSyBYNkGhE41RP5bzmtKuBMryriYfEjZVoo0",
	authDomain: "sert-smash-freshly-baked.firebaseapp.com",
	databaseURL: "https://sert-smash-freshly-baked.firebaseio.com/",
	storageBucket: "gs://sert-smash-freshly-baked.appspot.com",
};

var app = firebase.initializeApp(config);
var database = null;
var database = firebase.database;

var user = null;

$("#pageLogin").click(function(e) {
	e.preventDefault();

	email = $("#inputEmail").val();
	password = $("#inputPassword").val();

	pageLogin(email, password);

	if (user == null) {
		user = firebase.auth().currentUser;
	}

	if (user.displayName == null) {
		$("#setup").modal("show");
	} else {
		$("#login").remove();
		animateStart();
	}
});

$("#pageRegister").click(function(e) {
	e.preventDefault();

	email = $("#inputEmail").val();
	password = $("#inputPassword").val();

	pageRegister(email, password);
});

$("#submitName").click(function(e) {
	e.preventDefault();

	teamName = $("#inputTeam").val();
    teamRealName =$("#inputName").val();

	user.updateProfile({
		displayName: teamName,
        name: teamRealName
	});

    firebase.database().ref("users/" + user.uid).set({
        number: teamName,
        name: teamRealName
    });

	$("#setup").modal("hide");

    $("#login").remove();

    animateStart();
});

$("#createTeam").click(function(e) {
	e.preventDefault();

	$("#setupTeam").modal("show");
});

$("#submitNewTeam").click(function(e) {
	e.preventDefault();

	teamName = $("#inputNewTeam").val();

	firebase.database().ref("users/" + user.uid + "/teams/" + teamName).set({
		name: teamName
	});

	$("#setupTeam").modal("hide");
});

function animateStart() {
	$("#textstuff").animate({
		opacity: "0.0"
	}, "slow");

	$("#headstuff").animate({
		height: "-=200px"
	}, "slow");

	$("#headstuff").promise().done(function() {

		$("#smalltext").text("");

		$("#headstuff").animate({
			height: "+=50px"
		}, "slow");

		$("#bigtext").text("Robot Informations");

		$("#textstuff").animate({
			opacity: "0.75"
		}, "slow");

		$("#headstuff").promise().done(function() {
			appendData();
		});
	});
}

function appendData() {
	$("#teams").show();

    //Append team info.
	$("#welcomeBack").text("Welcome Back Team #" + user.displayName + "!");
	$("#emailRef").text("Logged in as " + user.email);

	//Append teams.
	firebase.database().ref("/users/" + user.uid + "/teams/").once("value").then(function(snapshot) {
        $("#teamsList").append($("<li class='list-group-item'>")).text("Team #" + snapshot.val());
    });
}

function pageLogin(email, password) {
	//Login
	firebase.auth().signInWithEmailAndPassword(email, password);
}

function pageRegister(email, password) {
	//Register
	firebase.auth().createUserWithEmailAndPassword(email, password);
}
