function initialize_webiopi(){
    // webiopiの準備が終わってからstyles.cssを適用する
    applyCustomCss('styles.css');

    // タッチエリアの設定
    var touchArea = $("#touchArea")[0];

    // タッチイベントのイベントリスナーの登録
    touchArea.addEventListener("touchstart", touchEvent, false);
    touchArea.addEventListener("touchmove", touchEvent, false);
    touchArea.addEventListener("touchend", touchEndEvent, false);

    // クリックイベントのイベントリスナーの登録
    touchArea.addEventListener("click", clickEvent, false);

    // GPIOの状態を監視しない
    webiopi().refreshGPIO(false);
}

// 前に送信したデューティー比を覚えておく
var rate25Prev = 0;
var rate24Prev = 0;
var rate23Prev = 0;
var rate22Prev = 0;

// デューティー比がth (0.0～1.0) 以上変化した時のみ値を送信
var th = 0.1;
// モーターの最大速度 (0.0～1.0)。モーターを保護する意味で1.0にはしない方が良い
var maxSpeed = 0.8;
// 命令送信ごとに増加するIDを作成（iOSのSafariでPOSTがキャッシュされることの対策）
var commandID = 0;

function touchEvent(e){
    e.preventDefault();

    var touch = e.touches[0];  
    var width = document.getElementById("touchArea").offsetWidth;
    var height = document.getElementById("touchArea").offsetHeight;

    if(touch.pageX<width/3){ // 左旋回
        var rate = maxSpeed*(width/3-touch.pageX)/(width/3);

        // 前回送信時と値が大きく違うときのみ送信
        if(Math.abs(rate-rate24Prev)>th || Math.abs(rate-rate23Prev)>th){
            webiopi().callMacro("pwm4Write", [0, rate, rate, 0, commandID++]);
            rate25Prev = 0;
            rate24Prev = rate;
            rate23Prev = rate;
            rate22Prev = 0;
        }
    }else if(touch.pageX<2*width/3){ // 前後移動
        // 左右の車輪の速さの違いの補正
        var modL = (1.2-0.8)*(touch.pageX-width/3)/(width/3) + 0.8;
        var modR = (0.8-1.2)*(touch.pageX-width/3)/(width/3) + 1.2;

        if(touch.pageY<height/2){
            var rate = maxSpeed*(height/2-touch.pageY)/(height/2);
            modL *= rate;
            modR *= rate;

            if(modL > 1.0){ modL = 1.0; }
            if(modR > 1.0){ modR = 1.0; }

            // 前回送信時と値が大きく違うときのみ送信
            if(Math.abs(modL-rate25Prev)>th || Math.abs(modR-rate23Prev)>th){
                webiopi().callMacro("pwm4Write", [modL, 0, modR, 0, commandID++]);
                rate25Prev = modL;
                rate24Prev = 0;
                rate23Prev = modR;
                rate22Prev = 0;
            }
        }else{
            var rate = maxSpeed*(touch.pageY-height/2)/(height/2);
            modL *= rate;
            modR *= rate;

            if(modL > 1.0){ modL = 1.0; }
            if(modR > 1.0){ modR = 1.0; }

            // 前回送信時と値が大きく違うときのみ送信
            if(Math.abs(modL-rate24Prev)>th || Math.abs(modR-rate22Prev)>th){
                webiopi().callMacro("pwm4Write", [0, modL, 0, modR, commandID++]);
                rate25Prev = 0;
                rate24Prev = modL;
                rate23Prev = 0;
                rate22Prev = modR;
            }
        }

    }else{ // 右旋回
        var rate = maxSpeed*(touch.pageX - 2*width/3)/(width/3);

        // 前回送信時と値が大きく違うときのみ送信
        if(Math.abs(rate-rate25Prev)>th || Math.abs(rate-rate22Prev)>th){
            webiopi().callMacro("pwm4Write", [rate, 0, 0, rate, commandID++]);
            rate25Prev = rate;
            rate24Prev = 0;
            rate23Prev = 0;
            rate22Prev = rate;
        }
    }

}

// タッチ終了時のイベントリスナー
function touchEndEvent(e){
    e.preventDefault();

    webiopi().callMacro("pwm4Write", [0, 0, 0, 0, commandID++]);
    rate25Prev = 0;
    rate24Prev = 0;
    rate23Prev = 0;
    rate22Prev = 0;
}

// クリック時のイベントリスナー（主にPC用）
function clickEvent(e){

    var width = document.getElementById("touchArea").offsetWidth;
    var height = document.getElementById("touchArea").offsetHeight;

    if(e.pageX<width/3){ // 左旋回
        var rate = maxSpeed*(width/3-e.pageX)/(width/3);

        webiopi().callMacro("pwm4Write", [0, rate, rate, 0, commandID++]);
        rate25Prev = 0;
        rate24Prev = rate;
        rate23Prev = rate;
        rate22Prev = 0;
    }else if(e.pageX<2*width/3){ // 前後移動
        // 左右の車輪の速さの違いの補正
        var modL = (1.2-0.8)*(e.pageX-width/3)/(width/3) + 0.8;
        var modR = (0.8-1.2)*(e.pageX-width/3)/(width/3) + 1.2;

        if(e.pageY>=2*height/5 && e.pageY<3*height/5){
            webiopi().callMacro("pwm4Write", [0, 0, 0, 0, commandID++]);
            rate25Prev = 0;
            rate24Prev = 0;
            rate23Prev = 0;
            rate22Prev = 0;
        }else if(e.pageY<height/2){
            var rate = maxSpeed*(height/2-e.pageY)/(height/2);
            modL *= rate;
            modR *= rate;

            if(modL > 1.0){ modL = 1.0; }
            if(modR > 1.0){ modR = 1.0; }

            webiopi().callMacro("pwm4Write", [modL, 0, modR, 0, commandID++]);
            rate25Prev = modL;
            rate24Prev = 0;
            rate23Prev = modR;
            rate22Prev = 0;
        }else{
            var rate = maxSpeed*(e.pageY-height/2)/(height/2);
            modL *= rate;
            modR *= rate;

            if(modL > 1.0){ modL = 1.0; }
            if(modR > 1.0){ modR = 1.0; }

            webiopi().callMacro("pwm4Write", [0, modL, 0, modR, commandID++]);
            rate25Prev = 0;
            rate24Prev = modL;
            rate23Prev = 0;
            rate22Prev = modR;
        }

    }else{ // 右旋回
        var rate = maxSpeed*(e.pageX - 2*width/3)/(width/3);

        webiopi().callMacro("pwm4Write", [rate, 0, 0, rate, commandID++]);
        rate25Prev = rate;
        rate24Prev = 0;
        rate23Prev = 0;
        rate22Prev = rate;
    }

}
function applyCustomCss(custom_css){
    var head = document.getElementsByTagName('head')[0];
    var style = document.createElement('link');
    style.rel = "stylesheet";
    style.type = 'text/css';
    style.href = custom_css;
    head.appendChild(style);
}
