from django.db import models
from django.utils import timezone

class Genre(models.Model):
    genre_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    abbrevation = models.CharField(max_length=10,default="")

    def __str__(self):
        return self.name
    
    def natural_key(self):
        return self.name

class Question(models.Model):
    question_id = models.AutoField(primary_key=True)
    genre = models.ForeignKey(Genre, on_delete=models.CASCADE)
    question = models.TextField()
    answer = models.TextField()

    def __str__(self):
        return self.question
    
    def natural_key(self):
        return self.question
    
class Users(models.Model):
    email = models.EmailField(primary_key=True)
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=100) 
    
    
    def __str__(self):
        return self.email
    

class Report(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    rating = models.FloatField()
    user_answer = models.TextField()
    feedback = models.TextField()
    submit_time = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'Report for {self.user.email} on question {self.question.question_id}'

    

