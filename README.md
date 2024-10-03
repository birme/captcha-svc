# {{service}}

## Install

```
npm install
```

## Run
```
npm start
```

## Docker

```
docker build -t service:dev .
docker run --rm -d \
  -p 8000:8000 service:dev
