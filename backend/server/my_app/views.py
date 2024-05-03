from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from .videoProcessing import extract_text_from_video
import tempfile
from .models import *
import random
from .getRating import getRating


@api_view(['POST'])
def index_view(request):
    if request.method == "POST":
        try:
            if 'video' in request.FILES:
                video_file = request.FILES['video']
                question_id = request.POST.get('question_id')  
                question = Question.objects.get(question_id=question_id)
                with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as f:
                    for chunk in video_file.chunks():
                        f.write(chunk)
                    video_path = f.name
                
                words = extract_text_from_video(video_path)
                rating = getRating(f" just give the candidate a rating out of 10 ,just give the number. for the question -> {question} the interview candidate answered {words}")
                feedback = getRating(f"addessing the candidate as 'you', as an interviewer just give feedback in 100 words on what candidate can imporve in his answer for this particular question -> {question} and the answer of the candidate was {words}")
                strengths = getRating(f"addessing the candidate as 'you' ,as an interviewer just give feedback in 50 words on what were the good points mentioned by the candidate for this particular question  question -> {question} and the answer of the candidate was -> {words}")
                model_answer = getRating(f"summerize this in 100 words , use bold where necessary keep it short and consise, if you are using points, use proper regular expression around it so that its easier to process the text later {question.answer}")
                return JsonResponse({"rating": rating,"feedback":feedback,"strengths":strengths,"model_anwer":model_answer})
            else:
                return JsonResponse({"message": "No video received"}, status=400)
        except Exception as e:
            print("Error:", e)
            return JsonResponse({"message": "An error occurred"}, status=500)
        
    
    
    
def get_random_question(request,card_name):
    if request.method == 'GET':
        card_name = card_name

        try:
            genre = Genre.objects.get(abbrevation=card_name)
            questions = Question.objects.filter(genre=genre)

            if questions.exists():
                random_question = random.choice(questions)
                response_data = {
                    'question': random_question.question,
                    'id': random_question.question_id
                }
                return JsonResponse(response_data, status=200)
            else:
                return JsonResponse({'message': 'No questions found for this genre'}, status=404)
        except Genre.DoesNotExist:
            return JsonResponse({'message': 'Genre not found'}, status=404)
    else:
        return JsonResponse({'message': 'Method not allowed'}, status=405)
    
