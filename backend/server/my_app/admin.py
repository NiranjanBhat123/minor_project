# admin.py

from django.contrib import admin
from .models import Genre, Question

class QuestionAdmin(admin.ModelAdmin):
    list_display = ('question', 'genre')
    list_filter = ('genre',)  # Add this line to enable filtering by genre

admin.site.register(Genre)
admin.site.register(Question, QuestionAdmin)

