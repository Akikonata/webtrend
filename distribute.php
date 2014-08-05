<?php 
    require_once 'php/detect/Mobile_Detect.php';
    $detect = new Mobile_Detect;

    if( $detect->isMobile() ){
        $link = 'http://' . $_SERVER['SERVER_NAME'] . dirname($_SERVER['REQUEST_URI']) . '/dist.html';
        header("Location: $link");
    }else{
        header('Location: http://www.baidu.com');
    }
?>