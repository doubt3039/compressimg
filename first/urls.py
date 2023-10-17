from django.urls import path

from . import views


urlpatterns = [
    path('',views.home,name='home'),
    path('compress',views.compress_img,name="compress"),
    path('download',views.file_download_url,name="download")
]