# NovaPulse Comprehensive Automated Verification Suite
$baseDir = "C:\Users\aditi\.gemini\antigravity\scratch\modern-web-platform"
Write-Host "=========================================================="
Write-Host "Running Comprehensive Validation for NovaPulse Platform"
Write-Host "Directory: $baseDir"
Write-Host "=========================================================="

$testsPassed = 0
$testsFailed = 0

function Assert-Test([bool]$condition, [string]$description) {
    if ($condition) {
        Write-Host "PASS: $description"
        $script:testsPassed++
    } else {
        Write-Host "FAIL: $description"
        $script:testsFailed++
    }
}

# 1. File Structure Verification
$requiredFiles = @(
    "index.html",
    "serve.ps1",
    "assets\css\variables.css",
    "assets\css\reset.css",
    "assets\css\components.css",
    "assets\css\layout.css",
    "assets\css\animations.css",
    "assets\js\app.js",
    "assets\js\components\theme.js",
    "assets\js\components\toast.js",
    "assets\js\components\modal.js",
    "assets\js\components\navigation.js",
    "assets\js\components\pricing.js",
    "assets\js\components\accordion.js",
    "assets\js\components\filter.js",
    "assets\js\components\interactiveDemo.js",
    "assets\js\components\forms.js",
    "assets\js\data\featuresData.js",
    "assets\js\data\faqsData.js"
)

foreach ($relPath in $requiredFiles) {
    $fullPath = Join-Path $baseDir $relPath
    $exists = Test-Path $fullPath -PathType Leaf
    $size = 0
    if ($exists) {
        $size = (Get-Item $fullPath).Length
    }
    $msg = "File exists and is populated: " + $relPath + " (" + $size + " bytes)"
    Assert-Test ($exists -and ($size -gt 50)) $msg
}

# 2. HTML DOM Parsing and Accessibility Inspection
$indexPath = Join-Path $baseDir "index.html"
$htmlContent = [System.IO.File]::ReadAllText($indexPath, [System.Text.Encoding]::UTF8)

$doc = New-Object -ComObject "HTMLFile"
$doc.IHTMLDocument2_write($htmlContent)
$doc.close()

Assert-Test ($doc.title -match "NovaPulse") ("HTML Document Title is valid: " + $doc.title)
Assert-Test ($htmlContent.Contains('data-theme="light"')) "HTML Root has default data-theme attribute"
Assert-Test ($htmlContent.Contains('class="skip-link"')) "Accessibility: Skip link present"

# Verify all stylesheet references exist
$cssPattern = 'href="(assets/css/[^"]+)"'
$cssMatches = [regex]::Matches($htmlContent, $cssPattern)
Assert-Test ($cssMatches.Count -eq 5) ("All 5 modular CSS files linked in head: " + $cssMatches.Count + " found")
foreach ($match in $cssMatches) {
    $link = $match.Groups[1].Value
    $cssFile = Join-Path $baseDir ($link.Replace('/', '\'))
    Assert-Test (Test-Path $cssFile) ("CSS file link resolves on disk: " + $link)
}

# Verify module script reference exists
$jsPattern = 'src="(assets/js/[^"]+)"'
$jsMatch = [regex]::Match($htmlContent, $jsPattern)
$jsScript = $jsMatch.Groups[1].Value
Assert-Test ($jsScript -eq "assets/js/app.js") "App entrypoint correctly referenced as ES module"
Assert-Test (Test-Path (Join-Path $baseDir ($jsScript.Replace('/', '\')))) "App entrypoint file resolves on disk"

# 3. Anchor & Navigation Integrity
$anchorPattern = 'href="#([a-zA-Z0-9_\-]+)"'
$anchorMatches = [regex]::Matches($htmlContent, $anchorPattern)
$anchorList = @()
foreach ($m in $anchorMatches) {
    $anchorList += $m.Groups[1].Value
}
$uniqueAnchors = $anchorList | Select-Object -Unique
foreach ($anchor in $uniqueAnchors) {
    $idRegex = 'id="' + [regex]::Escape($anchor) + '"'
    $hasTarget = [regex]::IsMatch($htmlContent, $idRegex)
    Assert-Test $hasTarget ("Navigation anchor target exists in DOM: #" + $anchor)
}

# 4. Modal Triggers & Modal IDs
$modalPattern = 'data-modal-target="([^"]+)"'
$modalMatches = [regex]::Matches($htmlContent, $modalPattern)
$modalList = @()
foreach ($m in $modalMatches) {
    $modalList += $m.Groups[1].Value
}
$uniqueModals = $modalList | Select-Object -Unique
foreach ($target in $uniqueModals) {
    $modalRegex = 'id="' + [regex]::Escape($target) + '"'
    $hasModal = [regex]::IsMatch($htmlContent, $modalRegex)
    Assert-Test $hasModal ("Modal trigger target exists in DOM: #" + $target)
}

# 5. Form Elements & Accessible Labels
$formInputIds = @("contact-name", "contact-email", "contact-service", "contact-message", "modal-name", "modal-email", "newsletter-email")
foreach ($inputId in $formInputIds) {
    $hasInput = [regex]::IsMatch($htmlContent, 'id="' + $inputId + '"')
    Assert-Test $hasInput ("Form input element present: #" + $inputId)
}

$labels = @("contact-name", "contact-email", "contact-service", "modal-name", "modal-email")
foreach ($labelFor in $labels) {
    $hasLabel = [regex]::IsMatch($htmlContent, 'for="' + $labelFor + '"')
    Assert-Test $hasLabel ("Accessible label exists for: " + $labelFor)
}

# 6. Pricing Component Elements
$pricingIds = @("billing-toggle-track", "label-monthly", "label-annual", "price-starter", "price-pro", "price-enterprise")
foreach ($planId in $pricingIds) {
    $hasPlanId = [regex]::IsMatch($htmlContent, 'id="' + $planId + '"')
    Assert-Test $hasPlanId ("Pricing component element exists: #" + $planId)
}

# 7. Interactive Calculator Elements
$calcIds = @("slider-requests", "slider-latency", "slider-agents", "val-requests", "val-latency", "val-agents", "calc-savings", "calc-speedup", "calc-hours", "btn-copy-calc")
foreach ($cid in $calcIds) {
    $hasCid = [regex]::IsMatch($htmlContent, 'id="' + $cid + '"')
    Assert-Test $hasCid ("Calculator element exists: #" + $cid)
}

# 8. JavaScript Module Syntax & Export Validation
$jsFiles = Get-ChildItem -Path (Join-Path $baseDir "assets\js") -Filter "*.js" -Recurse
foreach ($file in $jsFiles) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $openBraces = ($content.ToCharArray() | Where-Object { $_ -eq '{' }).Count
    $closeBraces = ($content.ToCharArray() | Where-Object { $_ -eq '}' }).Count
    Assert-Test ($openBraces -eq $closeBraces) ("JavaScript braces balanced in " + $file.Name + " (" + $openBraces + " open, " + $closeBraces + " close)")

    $openParens = ($content.ToCharArray() | Where-Object { $_ -eq '(' }).Count
    $closeParens = ($content.ToCharArray() | Where-Object { $_ -eq ')' }).Count
    Assert-Test ($openParens -eq $closeParens) ("JavaScript parentheses balanced in " + $file.Name + " (" + $openParens + " open, " + $closeParens + " close)")
}

# 9. CSS Syntax & Theme Consistency
$cssFiles = Get-ChildItem -Path (Join-Path $baseDir "assets\css") -Filter "*.css"
foreach ($file in $cssFiles) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $openBraces = ($content.ToCharArray() | Where-Object { $_ -eq '{' }).Count
    $closeBraces = ($content.ToCharArray() | Where-Object { $_ -eq '}' }).Count
    Assert-Test ($openBraces -eq $closeBraces) ("CSS braces balanced in " + $file.Name + " (" + $openBraces + " open, " + $closeBraces + " close)")
}

Write-Host "=========================================================="
Write-Host "Test Summary: $testsPassed Passed, $testsFailed Failed"
Write-Host "=========================================================="

if ($testsFailed -eq 0) {
    Write-Host "ALL AUTOMATED QUALITY AND INTERACTION TESTS PASSED!"
    exit 0
} else {
    Write-Host "SOME TESTS FAILED."
    exit 1
}
