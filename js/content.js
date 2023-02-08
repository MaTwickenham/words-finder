chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    //监听getSelection请求
    if(request.action === "getSelection"){
        //获取所选单词以及所在句子
        let selection = window.getSelection();
        //获取所选单词在页面位置
        let range = selection.getRangeAt(0).cloneRange();
        rect = range.getClientRects()[0];
        x = rect.left
        y = rect.top

        let textNode = selection.focusNode.parentElement;
        let text = textNode.innerText;
        if(text !== ""){
            //获取word 与 sentence
            let arr = text.split(".");
            let word = selection.toString();
            let sentence = arr.find(str => str.includes(word))
            alert(word);
            // //发送response给background
            sendResponse({word: word, sentence: sentence, pos: {x, y}});
        }
    } 
    else if(request.action == "translation"){
        let html = request.data;
        let posx = request.pos.x + 50
        let posy = request.pos.y + 50
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
        setStyles(resultDom, posx, posy);
        //添加释义div元素至dom
        document.body.appendChild(resultDom);
        sendResponse("sended!");
    }
})

function setStyles(element, x, y) {
    element.id = "word_description"
    element.style.position = "fixed";
    element.style.height = "auto";
    element.style.width = "200px";
    element.style.borderRadius = "10px"
    element.style.backgroundColor = "lightblue";
    element.style.left = x + "px"
    element.style.top = y + "px"
    element.style.zIndex = 1000
}