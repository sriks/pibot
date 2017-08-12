A raspberrypi bot

** configuration files **
Configuration files should be placed in ```/etc/pibot```

** config.json **
Default launch configuration. This is required.
```

{
    "name": "bot-name",
    "version": 1,
    "slackbot": {
        "token": "your-slackbot-token-here"
    },
    "speak": {
        "volume": "900"
    }
}
```
** Optional: **

** schedule.json **
Used to read scheduled events.
```
[
  {
      "active": false,
      "id": "switch.light.on",
      "cron": "25 7 * * 1-5",
      "lightid": "bedroom"
  },

  {
      "active": true,
      "id": "pibot.speak.test",
      "cron": "*/10 * * * * *",
      "speak": "Hello world!"
  }
]
```

** aws.json **
To read AWS credentials. Formatted as http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-json-file.html
