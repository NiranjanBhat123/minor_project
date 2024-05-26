from django.contrib import admin
from .models import Genre, Question,Report,Users

class QuestionAdmin(admin.ModelAdmin):
    list_display = ('question', 'genre')
    list_filter = ('genre',)

admin.site.register(Genre)
admin.site.register(Report)
admin.site.register(Users)
admin.site.register(Question, QuestionAdmin)

