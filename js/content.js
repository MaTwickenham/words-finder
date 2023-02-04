chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    //监听getSelection请求
    if(request.action === "getSelection"){
        //获取所选单词以及所在句子
        let selection = window.getSelection();
        let textNode = selection.focusNode.parentElement;
        let text = textNode.innerText;
        if(text !== ""){
            //获取word 与 sentence
            let arr = text.split(".");
            let word = selection.toString();
            let sentence = arr.find(str => str.includes(word))
            alert(word);
            // //发送response给background
            sendResponse({word: word, sentence: sentence});
        }
    } 
    else if(request.action == "translation"){
        let html = request.data;
        //生成dom
        let parser = new DOMParser();
        transDom = parser.parseFromString(html, "text/html");
        //获取英文释义
        description = transDom.childNodes[1].childNodes[0].childNodes[6].content;
        //创建dom元素
        let resultDom = document.createElement("div");
        let closeBtn = document.createElement("button");
        closeBtn.innerText = "关闭";
        closeBtn.onclick = () => {
            let target = document.getElementById("word_description");
            target.parentNode.removeChild(target);
        }
        resultDom.innerText = description;
        resultDom.appendChild(closeBtn);
        //设置样式
        resultDom.id = "word_description"
        resultDom.style.position = "absolute";
        resultDom.style.height = "200px";
        resultDom.style.width = "400px";
        resultDom.style.backgroundColor = "grey";
        resultDom.style.opacity = "60%"
        resultDom.style.left = "100px";
        resultDom.style.top = "100px";
        //添加释义div元素至dom
        document.body.appendChild(resultDom);
        sendResponse("sended!");
    }
})