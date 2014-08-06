<?php 
    require_once 'php/detect/Mobile_Detect.php';
    $detect = new Mobile_Detect;

    if( $detect->isMobile() ){
        include('index.html');
    }else{
        include('min.html');
    }
?>