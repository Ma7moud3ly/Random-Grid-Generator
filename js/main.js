    var sheet = document.getElementById('sheet'),
    context = sheet.getContext('2d');
    var image=null;
    var mw=788,mh=1160;
    var sw=40,sh=53,ss=53
    var factor;

    function resizeSheet(){
        h=parseInt($("#sheet-container").css("height"));
        factor=h/mh;
        if(factor>1)factor=1/factor
        w=parseInt(factor*mw);
        h=parseInt(factor*mh);
        sheet.width = w
        sheet.height = h
        if(canvas)resize(w,h)
    }


var canvas=new fabric.Canvas('sheet',{backgroundColor :'transparent'});

canvas.setBackgroundImage('imgs/bg.png', canvas.renderAll.bind(canvas), {
   scaleX: factor,
   scaleY: factor
});


resizeSheet();
window.addEventListener('resize',resizeSheet, false);

var hex=['1',' ','2',' ','3',' ','4',' ','5',' ','6','7',' ','8','9',' ','A','B',' ','C','D',' ','E','F',' ']

function rand() {
    return parseInt(Math.random() * (hex.length - 1) + 1);
}


function addText(t,r){
    var size=parseInt(ss*factor)
    var str="";
    for(var i=0;i<21;i++){
        str+=hex[rand()]
    }

    if(r==16){
        var s=$("#fn").val();
        if(s!=''){
            var i=parseInt((21-s.length)/2);
            str=str.substring(0,i)+s+str.substring(i+1)
        }
    }

    if(r==17){
        var s=$("#ln").val();
        if(s!=''){
            var i=parseInt((21-s.length)/2);
            str=str.substring(0,i)+s+str.substring(i+1)
        }
    }

    text=canvas.add(new fabric.Text(str, { 
        left: 0, 
        top:t-2,
        selectable:false, 
        fill: '#29c4ff',
        fontSize:size,
        charSpacing:200,
        fontFamily:'monospace',
        fontWeight: 700
    }));
}


function generate(){

    canvas.clear();

    canvas.setBackgroundImage('imgs/bg.png', canvas.renderAll.bind(canvas), {
       scaleX: factor,
       scaleY: factor,
       selectable:false
   });
    for(var r=0;r<23;r++)
        addText(factor*sh*r,r)

    fabric.Image.fromURL('imgs/effect.png', function(img) {
        effect=img;
        effect.set({ left:0, top:0,scaleX:factor,scaleY: factor,selectable:false});
        canvas.add(effect);
    });

    canvas.renderAll();

}

generate();


function resize(w,h) {
    var ww=canvas.getWidth();
    var hh=canvas.getHeight();
    var fw=w/ww;
    var fh=h/hh;
    canvas.setHeight(h);
    canvas.setWidth(w);
    if (canvas.backgroundImage) {
        var bi = canvas.backgroundImage;
        bi.width = bi.width * fw; bi.height = bi.height * fh;
    }
    var objects = canvas.getObjects();
    for (var i in objects) {
        var scaleX = objects[i].scaleX;
        var scaleY = objects[i].scaleY;
        var left = objects[i].left;
        var top = objects[i].top;

        var tempScaleX = scaleX * fw;
        var tempScaleY = scaleY * fh;
        var tempLeft = left * fw;
        var tempTop = top * fh;

        objects[i].scaleX = tempScaleX;
        objects[i].scaleY = tempScaleY;
        objects[i].left = tempLeft;
        objects[i].top = tempTop;

        objects[i].setCoords();
    }
    canvas.renderAll();
    canvas.calcOffset();
}


$("#gen").click(generate)



function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

function downloadCanvas(){
      resize(788,1160)
      var imgData = canvas.toDataURL('png');
      resize(mw*factor,mh*factor)
      var link = document.createElement("a");
      var strDataURI = imgData.substr(22, imgData.length);
      var blob = dataURLtoBlob(imgData);
      var objurl = URL.createObjectURL(blob);
      link.download = "random.png";
      link.href = objurl;
      link.click();
} 



$("#dwn").click(downloadCanvas);




$("#shw").click(function(){
   resize(mw,mh)
   var img = canvas.toDataURL('png');
   resize(mw*factor,mh*factor)
   $("#preview").attr("src",img)
});
