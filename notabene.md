#GENERAL
- If a cookie is HTTP only, it can't be read by JavaScript.
- You can use: __osascript -e 'tell application "Terminal" to do script "echo hello"'__, to launch a script in a new window.

#APACHE
- You can't pass variables to .htaccess from your conf files.

Instead you could do something with SetEnvIf, in your instance however you've simply used the HTTP_HOST variable.

SetEnvIf Host "local.pegs.website" NODE_URL=http://local.pegs.website:8090