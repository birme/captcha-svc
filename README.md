# Captcha Service

Provides a backend with endpoint to generate CAPTCHA and verify a CAPTCHA text.

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