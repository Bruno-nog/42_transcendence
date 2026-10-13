# Execution:

## add .env file
```
POSTGRES_USER=bruno
POSTGRES_PASSWORD=1234
POSTGRES_DB=transcendence
DATABASE_URL=postgresql://bruno:1234@db:5432/transcendence
TMDB_API_KEY=1f80937de1f4ff93588373b36e7b6dde
SECRET_KEY=d00d78f8dafde68448d096ca5c388c1adcfb66c1d4664ab92ead27140dccd924
```

```docker compose up --build```

```docker compose up -d``` runs in the background

```docker compose down```  The PostgreSQL container is removed

```docker compose down -v```  The PostgreSQL volume is also removed

and then in another terminal:

```docker exec -it transcendence_db psql -U bruno -d transcendence```

You can add an film going through this localhost:
https://localhost:8000/search?title=Tenet
![](media/images/route_search.png)

You can see all routes in this link: https://localhost:8000/docs#/
![](media/images/fastapi_routes.png)
## Commands to test:

```\dt```  database

```\l```  list of databases

```SELECT * FROM users;```

```SELECT * FROM reviews;```

```SELECT * FROM media;```

```DELETE FROM media;```  it will delete all of the films

## Backend structure

The FastAPI backend is organized by responsibility:

```text
backend/
├── main.py              # Application factory and router registration
├── routers/             # HTTP endpoints grouped by feature
│   ├── auth.py
│   ├── media.py
│   ├── reviews.py
│   └── users.py
├── schemas.py           # Request payload validation
├── services/tmdb.py     # TMDB integration
├── models.py            # SQLAlchemy models
├── database.py          # Engine and database session
└── auth.py              # Authentication dependency
```

Each router keeps HTTP concerns close to its endpoints, while TMDB calls and
request schemas are kept outside `main.py`. The application still starts with
the existing command:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload \
  --ssl-keyfile ../certs/localhost.key \
  --ssl-certfile ../certs/localhost.crt
```
