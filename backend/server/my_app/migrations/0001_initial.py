# Generated by Django 4.2.11 on 2024-05-24 06:39

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Genre',
            fields=[
                ('genre_id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('abbrevation', models.CharField(default='', max_length=10)),
            ],
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('question_id', models.AutoField(primary_key=True, serialize=False)),
                ('question', models.TextField()),
                ('answer', models.TextField()),
                ('genre', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='my_app.genre')),
            ],
        ),
        migrations.CreateModel(
            name='Users',
            fields=[
                ('email', models.EmailField(max_length=254, primary_key=True, serialize=False)),
                ('username', models.CharField(max_length=100)),
                ('password', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Report',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rating', models.FloatField()),
                ('user_answer', models.TextField()),
                ('feedback', models.TextField()),
                ('submit_time', models.DateTimeField(default=django.utils.timezone.now)),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='my_app.question')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='my_app.users')),
            ],
        ),
    ]
