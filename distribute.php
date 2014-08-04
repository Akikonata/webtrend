<?php 
    require_once 'php/detect/Mobile_Detect.php';
    $detect = new Mobile_Detect;

    function ver($str){
    	$s = str_replace('_', '.', $str);
    	$arr = explode('.', $s);
    	return $arr[0].'.'.$arr[1];
    }

    if( $detect->isMobile() ){
    	$info = '';

    	if( $detect->isiOS() ){
    		$info = 'ios'.'_'.ver($detect->version('iPhone'));
    	}else if( $detect->isAndroidOS() ){
    		$info = 'android'.'_'.ver($detect->version('Android'));
    	}

        $link = 'http://' . $_SERVER['SERVER_NAME'] . dirname($_SERVER['REQUEST_URI']) . '/dist.html?p=' . $info;
        header("Location: $link");
    }else{
        header('Location: http://www.baidu.com');
    }
?>