from django.shortcuts import render
import os
from PIL import Image
import base64
import json
from django.http import HttpResponse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt


# Create your views here.
def home(req):
    return render(req,"home.html")

@csrf_exempt
def compress_img(req,new_size_ratio=1, width=None, height=None, to_jpg=True):

    image_name=req.FILES.get("file",None)
    print(image_name)
    img = Image.open(image_name)
    print(req.POST["quality"])
    print(img.size)
    if req.POST["quality"]=='b':
        nquality=90
        new_size_ratio=1.0
    else:
        nquality=int(req.POST["quality"])
    
    # print the original image shape
    print("quality",nquality)
    print("[*] Image shape:", img.size)
    print("base :",settings.MEDIA_ROOT )

    # get the original image size in bytes
    image_size = int(req.POST["size"])
    print(image_size)

    # print the size before compression/resizing
    if new_size_ratio < 1.0:
        # if resizing ratio is below 1.0, then multiply width & height with this ratio to reduce image size
        img = img.resize((int(img.size[0] * new_size_ratio), int(img.size[1] * new_size_ratio)), Image.LANCZOS)
        # print new image shape
        print("[+] New Image shape:", img.size)

    elif width and height:
        # if width and height are set, resize with them instead
        img = img.resize((width, height), Image.LANCZOS)
        # print new image shape
        print("[+] New Image shape:", img.size)

    # split the filename and extension

    # make new filename appending _compressed to the original file name
    if to_jpg:
        # change the extension to JPEG
        new_filename = f"myimg_compressed.jpg"

    else:
        # retain the same extension of the original image
        new_filename = f"myimg_compressed.jpg"

    try:
        # save the image with the corresponding quality and optimize set to True
        img.save('/tmp/'+(new_filename), quality=nquality, optimize=True)

    except OSError:
        # convert the image to RGB mode first
        img = img.convert("RGB")

        # save the image with the corresponding quality and optimize set to True
        img.save(new_filename, quality=nquality, optimize=True)
    print("[+] New file saved:", new_filename)

    # get the new image size in bytes
    new_image_size = os.path.getsize('/tmp/'+new_filename)
    


    print(new_image_size)

    if(int(new_image_size<1000000)):
        n_size=str(int(int(new_image_size)/1000))+"KB"
    
    else:
        n_size=str(int(int(new_image_size)/1000000))+"MB"

    # print the new size in a good format
    # calculate the saving bytes
    saving_diff = new_image_size - image_size


    # print the saving percentage
    print(f"[+] Image size change: {saving_diff/image_size*100:.2f}% of the original image size.")  


    with open(settings.BASE_DIR+"/tmp/myimg_compressed.jpg"), "rb" as image_file:
        image_data = base64.b64encode(image_file.read()).decode('utf-8')

    return HttpResponse(json.dumps({'compressed_size': str(n_size),"image":image_data}), content_type="application/json")




def file_download_url(req):
    with open(os.path.join(settings.BASE_DIR,"myimg_compressed.jpg"),"rb") as f:
        data =f.read()
    with open(os.path.join(settings.BASE_DIR,"myimg_compressed.jpg"), 'wb') as f:
        f.write(data)

    f.close()
    os.remove(os.path.join(settings.BASE_DIR,"myimg_compressed.jpg"))
    response=HttpResponse(data,content_type='application/img.jpg')
    response['content-Disposition']='attachment;filename="my_imggg.jpg"'
    return response


         