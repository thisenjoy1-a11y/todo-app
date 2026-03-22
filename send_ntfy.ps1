$topic = "minhwan-todo-7am-2026"
$click = "https://scintillating-kangaroo-219763.netlify.app/todo.html?briefing=1"

$title = [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String("7Jik7KCEIDfsi5wg67iM66as7ZWR"))
$body  = [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String("7Jik64qYIO2VoCDsnbzsnYQg7ZmV7J247ZWY7IS47JqU"))

$json = ConvertTo-Json @{ topic = $topic; title = $title; message = $body; click = $click }

Invoke-RestMethod `
    -Uri "https://ntfy.sh" `
    -Method POST `
    -ContentType "application/json; charset=utf-8" `
    -Body ([System.Text.Encoding]::UTF8.GetBytes($json))

Write-Output "Done"
