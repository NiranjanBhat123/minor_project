from django.contrib import admin
from django.urls import path,include
from .import views


urlpatterns = [
   path('',views.index_view),
   path('api/get-random-question/<str:card_name>/', views.get_random_question, name='get_random_question'),
   path('api/signup/',views.signup),
   path('api/login/',views.login),
   path('api/save_report/', views.save_report, name='save_report'),
]