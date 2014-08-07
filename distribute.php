<?php 
    require_once 'php/detect/Mobile_Detect.php';
    $detect = new Mobile_Detect;

    $pdfLink = 'http://www.baidu.com/';
// var_dump( floatval(substr($detect->version('Android'), 0, 3)) );
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