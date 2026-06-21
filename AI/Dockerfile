FROM python:3.10-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*


RUN useradd -m -u 1000 user
WORKDIR /code


COPY --chown=user:user ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

RUN mkdir -p /code/.cache && chown -R user:user /code/.cache
ENV HF_HOME=/code/.cache


COPY --chown=user:user . /code

USER user

EXPOSE 7860

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860", "--forwarded-allow-ips", "*"]