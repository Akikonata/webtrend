(function(){

    

    function addBubble( conf ){
        '<li>3.43</li><li>2.77</li><li>0.80</li><li>0.80</li><li>0.70</li>'
    }

    Charts.add('bubble', {

        init : function(){

            $('<div class="bubble-container">
                    <ul class="value">

                    </ul>
                    <ul class="company">
                        <li>腾讯</li>
                        <li>百度</li>
                        <li>阿里</li>
                        <li>搜狐</li>
                        <li>新浪</li>
                    </ul>
                </div>');

        }

    });

})();