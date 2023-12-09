var s="";
var u="";

function uploadbtn(){
    document.getElementsByClassName("upload_file")[0].click();
}

function svgchange(){
    document.getElementsByClassName("upload_svg")[0].style.display="none";
    document.getElementsByClassName("compress_svg")[0].style.display="block";
    document.getElementsByClassName("status")[0].style.display="none";
    document.getElementsByClassName("status")[0].style.width="0%";
    setTimeout(statuschange,1000);
}

function statuschange(){
    document.getElementsByClassName("status")[0].style.display="block";
    document.getElementsByClassName("compress_svg")[0].classList="compress_svg_a";
    setTimeout(statusview,1000);
}

function statusview(){
    document.getElementsByClassName("status")[0].style.width="100%";
    setTimeout(svgcompleted,2000);
    console.log(s);
}

function loadcomplete(){
    document.getElementsByClassName("img_thumb")[0].style.display="none";
}

function svgcompleted(){
    document.getElementsByClassName("coust_opt")[0].style.pointerEvents="all";
    document.getElementsByClassName("coust_opt")[0].style.opacity="1";
    document.getElementsByClassName("download_link")[0].style.opacity="1";
    document.getElementsByClassName("compress_svg_a")[0].classList="compress_svg";
    document.getElementsByClassName("completed_svg")[0].style.display="block";
    document.getElementsByClassName("compress_svg")[0].style.display="none";
    document.getElementsByClassName("download_link")[0].style.pointerEvents="all";
    document.getElementsByClassName("download_link")[0].style.backgroundColor="#ffffff";
    document.getElementsByClassName("download_link")[0].style.color="#000000";
    document.getElementsByClassName("file_size")[0].innerHTML="compresed to : "+s;
    document.getElementsByClassName("imgg")[0].src="data:image/png;base64,"+u;
    document.getElementsByClassName("img_thumb")[0].style.display="flex";
    setTimeout(loadcomplete,2000);
}

function up(event){
    var inp=document.getElementsByClassName("upload_file")[0];
    document.getElementsByClassName("main_cont")[0].style.zIndex="-1";
    document.getElementsByClassName("nxt_1")[0].style.zIndex="999";
    document.getElementsByClassName("status")[0].style.width="70%";

    let pile=inp.files;
    var totalBytes=pile[0].size;

    var imgg=document.getElementsByClassName("imgg")[0];
    imgg.src = URL.createObjectURL(event.target.files[0]);
    var k=URL.createObjectURL(event.target.files[0]);
    console.log(imgg.src)
    console.log(k.toString());


    formData.append('file', pile[0]);
    formData.append("csrfmiddlewaretoken", $("input[name=csrfmiddlewaretoken]").val())

    if(totalBytes < 1000000){   
        var _size = Math.floor(totalBytes/1000) + 'KB';
        formData.append('size',totalBytes)

        formData.append('quality','b');

        $.ajax({
            type: "POST",
            url: "/compress",
            mimeType:'application/json',
            contentType: false,
            processData: false,
            data:formData,
            success: function (request) {
                document.getElementsByClassName("status")[0].style.width="100%";
                setTimeout(svgchange,2000);
                s=(request.compressed_size);
                u=request.image;
            }
        });
    }
    else{
        var _size = Math.floor(totalBytes/1000000) + 'MB';
    }
    document.getElementsByClassName("file_original")[0].innerHTML="original size : "+_size;
}



function cosutmizeclick(){
    console.log(formData);
    formData.delete("quality");
    formData.append("quality",document.getElementsByClassName("radio_inp")[0].value);
    document.getElementsByClassName("home_url")[0].style.display="none";
    document.getElementsByClassName("upload_svg")[0].style.display="block";
    document.getElementsByClassName("download_link")[0].style.display="flex";
    document.getElementsByClassName("download_link")[0].style.pointerEvents="none";
    document.getElementsByClassName("download_link")[0].style.opacity="0.5";
    document.getElementsByClassName("completed_svg")[0].style.display="none";
    $.ajax({
        type: "POST",
        url: "/compress",
        mimeType:'application/json',
        contentType: false,
        processData: false,
        data:formData,
        success: function (request) {
            document.getElementsByClassName("status")[0].style.width="100%";
            setTimeout(svgchange,2000);
            s=(request.compressed_size);
            u=request.image;
        }
    });
}

function filedrag(){
    document.getElementsByClassName("drag_and_drop")[0].style.border="2px solid #cccccc"; 
}


function selectopt(){
    document.getElementsByClassName("coust_radio")[0].checked=true;
}

function btnchange(){
    document.getElementsByClassName("download_link")[0].style.display="none";
    document.getElementsByClassName("home_url")[0].style.display="flex";
}