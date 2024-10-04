# Captcha Service

Provides a backend with endpoint to generate CAPTCHA and verify a CAPTCHA text.

[![Badge OSC](https://img.shields.io/badge/Evaluate-24243B?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl8yODIxXzMxNjcyKSIvPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI3IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiLz4KPGRlZnM%2BCjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhcl8yODIxXzMxNjcyIiB4MT0iMTIiIHkxPSIwIiB4Mj0iMTIiIHkyPSIyNCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjQzE4M0ZGIi8%2BCjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzREQzlGRiIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM%2BCjwvc3ZnPgo%3D)](https://app.osaas.io/browse/birme-captcha-svc)

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
docker build -t captcha-svc:dev .
docker run --rm -d \
  -p 8000:8000 captcha-svc:dev
```

## Usage

Get Captcha:

```
% curl http://localhost:8000/captcha
{"id":"victorious-tender-gold","svg": "data:image/svg+xml;base64,..."}
```

Verify Captcha `DR0O`:

Correct captcha:
```
% curl -v http://localhost:8000/verify/victorious-tender-gold/DR0O
< HTTP/1.1 200 OK
< vary: Origin
< access-control-allow-origin: *
< content-type: application/json; charset=utf-8
< content-length: 32
< Date: Thu, 03 Oct 2024 14:41:33 GMT
< Connection: keep-alive
< Keep-Alive: timeout=72
< 
* Connection #0 to host localhost left intact
{"message":"Captcha is correct"}
```

Wrong captcha:
```
% curl -v http://localhost:8000/verify/victorious-tender-gold/DR0L
< HTTP/1.1 400 Bad Request
< vary: Origin
< access-control-allow-origin: *
< content-type: application/json; charset=utf-8
< content-length: 34
< Date: Thu, 03 Oct 2024 14:42:28 GMT
< Connection: keep-alive
< Keep-Alive: timeout=72
< 
* Connection #0 to host localhost left intact
{"message":"Captcha is incorrect"}
```

## Example React

Example implementation in React

```javascript
'use client';

export default function Page() {
  const [captchaSvg, setCaptchaSvg] = useState<string | null>(null);
  const [captchaId, setCaptchaId] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [invalidCaptcha, setInvalidCaptcha] = useState(true);

  useEffect(() => {
    fetch(new URL('/captcha', 'http://localhost:8000'))
      .then((response) => response.json())
      .then((data) => {
        setCaptchaSvg(data.svg);
        setCaptchaId(data.id);
      });
  }, []);

  const onCaptchaChange = (value: string) => {
    setCaptcha(value);
    fetch(new URL(`/verify/${captchaId}/${value}`, 'http://localhost:8000'))
      .then((response) => {
        setInvalidCaptcha(!response.ok);
      })
      .catch(() => {
        setInvalidCaptcha(true);
      });
  };

  return (
    <div className="flex flex-wrap mt-10 md:flex-nowrap gap-4">
      {captchaSvg && (
        <Image src={captchaSvg} className="bg-white" alt="Captcha" />
      )}
      <Input
        name="captcha"
        placeholder="Enter the text from the image"
        description="This is used to prevent automated submissions."
        required
        maxLength={4}
        value={captcha}
        onValueChange={onCaptchaChange}
      />
      <Input type="submit" value="Send" isDisabled={invalidCaptcha} />
    </div>
  );
}
```
