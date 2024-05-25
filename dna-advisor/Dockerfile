FROM python:3.10

WORKDIR /app/

COPY ./requirements.txt .
RUN pip install -r requirements.txt \
  && pip cache purge

COPY . .

CMD ["python", "main.py"]