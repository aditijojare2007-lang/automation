param (
    [int]$Port = 8080
)

$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $baseDir) { $baseDir = Get-Location }

$ip = [System.Net.IPAddress]::Loopback
$listener = $null

# Try port 8080, fallback to 8085 or 8090 if busy
foreach ($p in @($Port, 8085, 8090, 3000)) {
    try {
        $endpoint = New-Object System.Net.IPEndPoint ($ip, $p)
        $listener = New-Object System.Net.Sockets.TcpListener $endpoint
        $listener.Start()
        $Port = $p
        break
    } catch {
        $listener = $null
    }
}

if ($null -eq $listener) {
    Write-Error "Could not bind to any local port."
    exit 1
}

$url = "http://localhost:$Port/"
Write-Host "======================================================"
Write-Host "⚡ NovaPulse Local Server running at: $url"
Write-Host "Serving files from: $baseDir"
Write-Host "Press Ctrl+C to terminate."
Write-Host "======================================================"

# Automatically open the site in the user's default browser
try {
    Start-Process $url
} catch {
    Write-Warning "Could not automatically launch browser. Please open $url manually."
}

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".svg"  = "image/svg+xml"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".ico"  = "image/x-icon"
}

try {
    while ($true) {
        $client = $listener.AcceptTcpClient()
        $stream = $client.GetStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $requestLine = $reader.ReadLine()

        if ($requestLine) {
            $parts = $requestLine.Split(" ")
            if ($parts.Length -ge 2) {
                $rawPath = $parts[1].Split("?")[0]
                if ($rawPath -eq "/" -or $rawPath -eq "") {
                    $rawPath = "/index.html"
                }

                $relPath = $rawPath.TrimStart("/").Replace("/", "\")
                $filePath = Join-Path $baseDir $relPath

                if (Test-Path $filePath -PathType Leaf) {
                    $bytes = [System.IO.File]::ReadAllBytes($filePath)
                    $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                    $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }

                    $header = "HTTP/1.1 200 OK`r`nContent-Type: $mime`r`nContent-Length: $($bytes.Length)`r`nAccess-Control-Allow-Origin: *`r`nConnection: close`r`n`r`n"
                    $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
                    $stream.Write($headerBytes, 0, $headerBytes.Length)
                    $stream.Write($bytes, 0, $bytes.Length)
                } else {
                    $body = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                    $header = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n"
                    $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
                    $stream.Write($headerBytes, 0, $headerBytes.Length)
                    $stream.Write($body, 0, $body.Length)
                }
            }
        }

        $stream.Flush()
        $client.Close()
    }
} finally {
    $listener.Stop()
}
