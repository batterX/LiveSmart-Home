<?php

/*
    Included on begin of every .php file

    Handles:
    * Session Start
    * Language Setup

    @author Ivan Gavrilov
*/


// Secure Session Cookie
$secure = false; // Set to true if using https.
$httponly = true; // This stops javascript from being able to access the session id.
$cookieParams = session_get_cookie_params(); // Gets current cookies params.
session_set_cookie_params($cookieParams["lifetime"], $cookieParams["path"], $cookieParams["domain"], $secure, $httponly);

// Session Start
session_start();
session_regenerate_id();



// Set Language
$lang = isset($_GET['lang']) ? $_GET['lang'] : (isset($_SESSION['lang']) ? $_SESSION['lang'] : "en");
if($lang != "en" && $lang != "de") $lang = "en";
$_SESSION['lang'] = $lang;

// Get Language Strings
$strings = file_get_contents('common/lang.json');
$strings = json_decode($strings, true);
$strings = ($lang == "de") ? $strings['tables'][1] : $strings['tables'][0];



// Version Hash
$versionHash = "1553590182030";