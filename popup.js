// function for blocking type STRING to Input tags
function inNumber() {
  46 == event.keyCode ||
    (47 < event.keyCode && event.keyCode < 58) ||
    (event.returnValue = !1);
}

// function for comma(,) check for Number Format
function commachecker(idx) {
  setTimeout(function () {
    var text = document.querySelectorAll(".val")[idx].value;
    text = text.replace(/,/g, "");
    text = text.replace(/ /g, ""); // 공백제거
    document.querySelectorAll(".val")[idx].value = text;
  }, 0); // paste Event 발생 후에 처리하기 위해 setTimeout 0seconds 설정
}

document.querySelectorAll(".val").forEach((elem, idx) => {
  elem.addEventListener("keypress", inNumber);
  elem.addEventListener("paste", function () {
    commachecker(idx); // 실행 없이 인자 넘기는 방법
  });
});

// functions for sound effects
function beep() {
  var audio = new Audio();
  audio.src = "sound/battlelogbeep.mp3";
  audio.play();
}

function errsound() {
  var audio = new Audio();
  audio.src = "sound/errorsound.mp3";
  audio.play();
}

// function for copy value to CLipboard
function clipBcopy() {
  var tempvalue = document.getElementById("BTC").value;
  if (tempvalue === "") {
    errsound();
  } else {
    beep();
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = tempvalue;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  }
}

document.querySelector("#copy").addEventListener("click", clipBcopy);
// document.querySelector("#copy").addEventListener("click", overlaycheck);

// function for load BTC price
var btckrw;
var btcusdt;

// https://api.upbit.com/v1/ticker?markets=KRW-BTC,KRW-ETH 로 이더리움 지원

function upbit() {
  var data = null;
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      var upbitData = this.responseText;
      upbitData = JSON.parse(upbitData);
      btckrw = upbitData[0].trade_price;
      btckrw = parseFloat(btckrw);
      // console.log(btckrw); // Upbit BTC/KRW 현재가
      return btckrw;
    }
  });
  xhr.open(
    "GET",
    "https://api.upbit.com/v1/candles/weeks?market=KRW-BTC&count=1&trade_price"
  );
  xhr.send(data);
}

function binance() {
  var data = null;
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      var binanceData = this.responseText;
      binanceData = JSON.parse(binanceData);
      btcusdt = parseFloat(binanceData.price).toFixed(2);
      btcusdt = parseFloat(btcusdt);
      // console.log(btcusdt); // Binance BTC/USDT 현재가
      return btcusdt;
    }
  });
  xhr.open("GET", "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT");
  xhr.send(data);
}

$("#KRW").on("propertychange change keyup paste click", function () {
  upbit();
  binance();
  var CountKRW = parseFloat(document.getElementById("KRW").value);
  var oneUSDTperKRW = (btckrw / btcusdt).toFixed(4);
  if (CountKRW) {
    document.getElementById("BTC").value = (CountKRW / btckrw).toFixed(8);
    document.getElementById("USDT").value = (CountKRW / oneUSDTperKRW).toFixed(
      7
    );
  } else {
    document.getElementById("BTC").value = "";
    document.getElementById("USDT").value = "";
  }
});

$("#USDT").on("propertychange change keyup paste click", function () {
  upbit();
  binance();
  var CountUSDT = parseFloat(document.getElementById("USDT").value);
  var oneUSDTperKRW = (btckrw / btcusdt).toFixed(4);
  if (CountUSDT) {
    document.getElementById("BTC").value = (CountUSDT / btcusdt).toFixed(8);
    document.getElementById("KRW").value = (CountUSDT * oneUSDTperKRW).toFixed(
      6
    );
  } else {
    document.getElementById("BTC").value = "";
    document.getElementById("KRW").value = "";
  }
});

$("#BTC").on("propertychange change keyup paste click", function () {
  upbit();
  binance();
  var CountBTC = parseFloat(document.getElementById("BTC").value);
  if (CountBTC) {
    document.getElementById("USDT").value = btcusdt * CountBTC;
    document.getElementById("KRW").value = btckrw * CountBTC;
  } else {
    document.getElementById("USDT").value = "";
    document.getElementById("KRW").value = "";
  }
});

$("#memo").on("propertychange change keyup paste click input", function () {
  memoContent = document.getElementById("memo").value;
  localStorage.setItem("memo", memoContent);
});

// 즉시실행함수 global 선언 불가
upbit();
binance();

// hostname 별로 함수 실행
function autoCal() {
  chrome.tabs.executeScript(
    {
      code: "window.location.hostname.split('.')[1];",
    },
    function (result) {
      hostname = result[0];
      if (hostname == "binance") {
        binanceAuto();
      } else if (hostname == "huobi") {
        alert(`${hostname} 거래소는 준비중입니다..`);
      } else if (hostname == "okex") {
        alert(`${hostname} 거래소는 준비중입니다..`);
      } else if (hostname == "kucoin") {
        alert(`${hostname} 거래소는 준비중입니다..`);
      } else if (hostname == "mxc") {
        alert(`${hostname} 거래소는 준비중입니다..`);
      } else if (hostname == "bithumb") {
        alert(`${hostname} 거래소는 준비중입니다..`);
      } else if (hostname == "gate") {
        alert(`${hostname} 거래소는 준비중입니다..`);
      } else {
        errsound();
      }
    }
  );
}

// bookorder USDT => KRW CALCULATION (ONLY BINANCE AVAILABLE)

document.querySelector("#bookbutton").addEventListener("click", autoCal);

function binanceAuto() {
  chrome.tabs.executeScript(
    {
      code:
        'var success;\
      var topW = document.getElementById("topWON");\
      var bottomW = document.getElementById("bottomWON");\
      if(topW == null){\
        try{var overlayItem1 = document.createElement("div");\
        overlayItem1.className = "overlayItem";\
        var title1 = document.createElement("div");\
        title1.className = "title";\
        var divEle1 = document.createElement("div");\
        divEle1.id = "topWON";\
        overlayItem1.appendChild(title1);\
        overlayItem1.appendChild(divEle1);\
        var titleText1 = document.createTextNode("합 KRW: ");\
        var valueText1 = document.createTextNode("Loading...");\
        divEle1.appendChild(valueText1);\
        title1.appendChild(titleText1);\
        var target1 = document.querySelectorAll(".overlay")[0].querySelector(".content");\
        target1.appendChild(overlayItem1);}\
        catch(e){\
          success=0;setTimeout(function(){location.reload(true);},1000);success}\
        }\
        \
        if(bottomW == null){\
        try{\
        var overlayItem2 = document.createElement("div");\
        overlayItem2.className = "overlayItem";\
        var title2 = document.createElement("div");\
        title2.className = "title";\
        var divEle2 = document.createElement("div");\
        divEle2.id = "bottomWON";\
        overlayItem2.appendChild(title2);\
        overlayItem2.appendChild(divEle2);\
        var titleText2 = document.createTextNode("합 KRW: ");\
        var valueText2 = document.createTextNode("Loading...");\
        divEle2.appendChild(valueText2);\
        title2.appendChild(titleText2);\
        var target2 = document.querySelectorAll(".overlay")[1].querySelector(".content");\
        target2.appendChild(overlayItem2);}\
        catch(e){\
          success=0;setTimeout(function(){location.reload(true);},1000);success}\
        }',
    },
    function (result) {
      if (result == false) {
        errsound();
      } else {
        beep();
        chrome.tabs.executeScript({
          code:
            'var btckrw; var btcusdt;\
            function upbit() {\
            var data = null;\
            var xhr = new XMLHttpRequest();\
            xhr.addEventListener("readystatechange", function () {\
              if (this.readyState === this.DONE) {\
                var upbitData = this.responseText;\
                upbitData = JSON.parse(upbitData);\
                btckrw = upbitData[0].trade_price;\
                btckrw = parseFloat(btckrw);\
                return btckrw;\
              }\
            });\
            xhr.open(\
              "GET",\
              "https://api.upbit.com/v1/candles/weeks?market=KRW-BTC&count=1&trade_price"\
            );\
            xhr.send(data);\
          }\
          \
          function binance() {\
            var data = null;\
            var xhr = new XMLHttpRequest();\
            xhr.addEventListener("readystatechange", function () {\
              if (this.readyState === this.DONE) {\
                var binanceData = this.responseText;\
                binanceData = JSON.parse(binanceData);\
                btcusdt = parseFloat(binanceData.price).toFixed(2);\
                btcusdt = parseFloat(btcusdt);\
                return btcusdt;\
              }\
            });\
            xhr.open("GET", "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT");\
            xhr.send(data);\
          }\
          function writeKRW(){\
            upbit();\
            binance();\
            var topW = document.getElementById("topWON");\
            var bottomW = document.getElementById("bottomWON");\
            var topUSDT = (document.querySelectorAll(".overlay")[0].querySelector(".content").querySelectorAll(".overlayItem")[2].querySelectorAll("div")[1].innerText);\
            topUSDT = parseFloat(topUSDT.replace(",",""));\
            var bottomUSDT = (document.querySelectorAll(".overlay")[1].querySelector(".content").querySelectorAll(".overlayItem")[2].querySelectorAll("div")[1].innerText);\
            bottomUSDT = parseFloat(bottomUSDT.replace(",",""));\
            var oneUSDTperKRW = (btckrw / btcusdt).toFixed(4);\
            if(!isNaN(oneUSDTperKRW)){\
              topW.innerText = (topUSDT * oneUSDTperKRW).toFixed(2);\
              bottomW.innerText = (bottomUSDT * oneUSDTperKRW).toFixed(2);\
            }\
          }\
          setInterval(function(){writeKRW()},1500);',
        });
      }
    }
  );
}

var newbie = localStorage.getItem("memo"); // 사이트 첫 방문인가 판별
if (newbie == null || newbie == "") {
  // localStorage.setItem("newbie", false);
  // localStorage.setItem("Colour", "lime");
  // colour = "lime";
} else {
  document.getElementById("memo").value = localStorage.getItem("memo");
  // colour = localStorage.getItem("Colour");
}
