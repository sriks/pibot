A raspberrypi bot

## Configuration files 
Configuration files should be placed in ```/etc/pibot```

### config.json 
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

### schedule.json
Optional. Used to read scheduled events. 
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

### aws.json
Optional. To read AWS credentials. Formatted as http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-json-file.html

## Run
```CONFIG_PATH=/etc/pibot node pibot.js```
Or Using pm2
```CONFIG_PATH=/etc/pibot pm2 start pibot```

