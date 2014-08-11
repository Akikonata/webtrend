<?php 
    require_once 'php/detect/Mobile_Detect.php';
    $detect = new Mobile_Detect;

    $pdfLink = 'http://developer.baidu.com/static/assets/reportpdf/%E7%99%BE%E5%BA%A6%E7%A7%BB%E5%8A%A8%E8%B6%8B%E5%8A%BF%E6%8A%A5%E5%91%8A2014Q2.pdf';

    if( $detect->isMobile() ){

    	if( $detect->isiOS() ){
    		include('max.html');
    	}else if( $detect->isAndroidOS() && floatval(substr($detect->version('Android'), 0, 3)) >= 4 ){
    		include('max.html');
    	}else{
    		include('min.html');
    	}
        
    }else{
        header("Location: " . $pdfLink);
    }
?>