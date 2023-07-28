# For more information, please refer to https://aka.ms/vscode-docker-python
FROM tiangolo/meinheld-gunicorn-flask:python3.9

EXPOSE 5000

# Install pip requirements
COPY requirements.txt .
RUN python3 -m pip install -r requirements.txt

WORKDIR /app
COPY . backend
ENV PYTHONPATH /app

# During debugging, this entry point will be overridden. For more information, please refer to https://aka.ms/vscode-docker-python-debug
ENTRYPOINT ["sh", "backend/entrypoint.sh"]
