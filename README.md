# bulk-email-verifier
Domain and Email verification in Node, using SMTP connection.

It verified multiple domain MX record existence and multiple emails for single domain in one run.

### Installation
```
npm install --save-dev bulk-email-verifier
```

### To Verify Domain
```
var verify = require('bulk-email-verifier');

var domains = [
    'skyfut2.com',
    'yahoomail.com', 
    'yahoo.com', 
    'gmail.com',
    'abc2.com',
    'rediff.com'
];

verify.verifyDomainsMX(domains).then(function(res) {
    console.log('Domains Status: ', res);
});
```

### To Verify Multiples emails of a single domain
```
var domain = 'gmail.com';
var emails =  [
	'test3@gmail.com',
    'test1@gmail.com',
    'test2@gmail.com'
];

verify.verifyEmails(domain, emails, {}, function(err, data){
    console.log("Email Stats: ", err, data);	
});

```

### Feedback

Pull requests, feature ideas and bug reports are welcome

### License

MIT