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
                print(words)

                # Using ThreadPoolExecutor for parallel execution
                with ThreadPoolExecutor(max_workers=5) as executor:
                    user_answer_future = executor.submit(getRating, f"just add punctuations in suitable places to this plain text look meaningful->{words}")
                    rating_future = executor.submit(getRating, f" just give the candidate a rating out of 10 ,just give the number. for the question -> {question} the interview candidate answered {words}")
                    feedback_future = executor.submit(getRating, f"addessing the candidate as 'you', as an interviewer just give feedback in 100 words on what candidate can imporve in his answer for this particular question -> {question} and the answer of the candidate was {words}")
                    strengths_future = executor.submit(getRating, f"addessing the candidate as 'you' ,as an interviewer just give feedback in 50 words on what were the good points mentioned by the candidate for this particular question  question -> {question} and the answer of the candidate was -> {words}")
                    model_answer_future = executor.submit(getRating, f"summerize this in 100 words , use bold where necessary keep it short and consise, if you are using points, use proper regular expression around it so that its easier to process the text later {question.answer}")
                
                    # Getting results from futures
                    user_answer = user_answer_future.result()
                    print(user_answer)
                    rating = rating_future.result()
                    feedback = feedback_future.result()
                    strengths = strengths_future.result()
                    model_answer = model_answer_future.result()

                    print(rating)
                    print(feedback)
                    print(strengths)
                    print(model_answer)

                return JsonResponse({"user_answer": user_answer,"rating": rating,"feedback":feedback,"strengths":strengths,"model_anwer":model_answer,"question_id":question_id})
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
    

@api_view(['POST'])
def signup(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        username = request.POST.get('username')
        password = request.POST.get('password')

        # Check if the email is already taken
        print(username,email,password)
        if Users.objects.filter(email=email).exists():
            return JsonResponse({'message': 'Email is already taken'}, status=400)

        # Create the user
        hashed_password = make_password(password)  # Hash the password
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
                # Passwords match, user is authenticated
                return JsonResponse({
                    'message': 'Login successful',
                    'email': user.email,
                    'username': user.username
                }, status=200)
            else:
                # Passwords do not match
                return JsonResponse({'message': 'Invalid email or password'}, status=401)
        except Users.DoesNotExist:
            # User does not exist
            return JsonResponse({'message': 'Invalid email or password'}, status=401)

    return JsonResponse({'message': 'Method not allowed'}, status=405)



@api_view(['POST'])
def save_report(request):
    #print("hi")
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