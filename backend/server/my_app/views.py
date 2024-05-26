from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from .videoProcessing import extract_text_from_video
import tempfile
from .models import *
import random
from .getRating import getRating
from concurrent.futures import ThreadPoolExecutor
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone
from django.core import serializers
from django.db import connection
from django.views.decorators.csrf import csrf_exempt


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

                def get_rating(question, words):
                    return getRating(f" just give the candidate a rating out of 10,just give the number. for the question -> {question} the interview candidate answered {words}")

                def get_feedback(question, words):
                    return getRating(f"addessing the candidate as 'you', as an interviewer just give feedback in 100 words on what candidate can imporve in his answer for this particular question -> {question}.  the feedback based on this answer ->  {words}. only if the candidate failed to answer, then give the feedback accordingly saying he must learn the concepts before taking an interview")

                def get_strengths(question, words):
                    return getRating(f"addessing the candidate as 'you',as an interviewer just give feedback in 50 words on what were the good points mentioned by the candidate for this particular question. if candidate has not answered anything, give a harsh feedback.  question is -> {question} and the answer of the candidate was -> {words}")

                def get_model_answer(question):
                    return getRating(f"summerize this in 200 words.do not use any text styling.this is the text to summerise  -> {question.answer}")

                def get_answer_future(words):
                    return getRating(f"just add punctuations in suitable places to this plain text to be meaningful {words}")

                with ThreadPoolExecutor() as executor:
                    futures = [
                        executor.submit(get_rating, question, words),
                        executor.submit(get_feedback, question, words),
                        executor.submit(get_strengths, question, words),
                        executor.submit(get_model_answer, question),
                        executor.submit(get_answer_future, words)
                    ]

                    results = [future.result() for future in futures]

                return JsonResponse({
                    "rating": results[0],
                    "feedback": results[1],
                    "strengths": results[2],
                    "model_answer": results[3],
                    "user_answer": results[4]
                })
            else:
                return JsonResponse({"message": "No video received"}, status=400)
        except Exception as e:
            print("Error:", e)
            return JsonResponse({"message": "An error occurred"}, status=500)


def get_random_question(request, card_name):
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


@api_view(['POST'])
def signup(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        username = request.POST.get('username')
        password = request.POST.get('password')
        if Users.objects.filter(email=email).exists():
            return JsonResponse({'message': 'Email is already taken'}, status=400)

        hashed_password = make_password(password)
        user = Users(email=email, username=username, password=hashed_password)
        user.save()

        return JsonResponse({'message': 'User created successfully'}, status=201)

    return JsonResponse({'message': 'Method not allowed'}, status=405)


@api_view(['POST'])
def login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        try:
            user = Users.objects.get(email=email)
            if check_password(password, user.password):
                return JsonResponse({
                    'message': 'Login successful',
                    'email': user.email,
                    'username': user.username
                }, status=200)
            else:
                return JsonResponse({'message': 'Invalid email or password'}, status=401)
        except Users.DoesNotExist:
            return JsonResponse({'message': 'user does not exist'}, status=401)

    return JsonResponse({'message': 'Method not allowed'}, status=405)


@api_view(['POST'])
def save_report(request):
    if request.method == 'POST':
        user_email = request.data.get('email')
        user = Users.objects.get(email=user_email)

        rating = request.data.get('rating')
        user_answer = request.data.get('user_answer')
        feedback = request.data.get('feedback')
        question_id = request.data.get('question_id')

        print(user_email)

        try:
            question = Question.objects.get(question_id=question_id)
        except Question.DoesNotExist:
            return Response({'message': 'Question not found'}, status=404)

        report = Report(
            user=user,
            question=question,
            rating=rating,
            user_answer=user_answer,
            feedback=feedback,
            submit_time=timezone.now()
        )
        report.save()

        return Response({'message': 'Report saved successfully'}, status=201)

    return Response({'message': 'Method not allowed'}, status=405)


def profile(request, email):
    if request.method == "GET":
        try:
            query = """
                SELECT 
                    my_app_users.email,
                    my_app_users.username,
                    my_app_genre.name AS genre_name,
                    my_app_question.question,
                    my_app_report.rating,
                    my_app_report.user_answer,
                    my_app_report.feedback,
                    my_app_report.submit_time,
                    my_app_report.id
                FROM 
                    my_app_report
                INNER JOIN 
                    my_app_users ON my_app_report.user_id = my_app_users.email
                INNER JOIN 
                    my_app_question ON my_app_report.question_id = my_app_question.question_id
                INNER JOIN 
                    my_app_genre ON my_app_question.genre_id = my_app_genre.genre_id
                WHERE 
                    my_app_users.email = %s
            """
            with connection.cursor() as cursor:
                cursor.execute(query, [email])

                rows = cursor.fetchall()

            data = []
            for row in rows:
                result = {

                    "email": row[0],
                    "username": row[1],
                    "genre_name": row[2],
                    "question": row[3],
                    "rating": row[4],
                    "user_answer": row[5],
                    "feedback": row[6],
                    "submit_time": row[7].strftime("%Y-%m-%d %H:%M:%S"),
                    "id": row[8]
                }
                data.append(result)

            return JsonResponse(data, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def delete_report(request, report_id):
    if request.method == "DELETE":
        try:
            report = Report.objects.get(id=report_id)
            report.delete()
            return JsonResponse({"message": "Report deleted successfully"}, status=200)
        except Report.DoesNotExist:
            return JsonResponse({"error": "Report not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)
