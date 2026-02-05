Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  OptiPath Deployment Test Suite" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://13.127.89.209"
$passedTests = 0
$failedTests = 0

# Test 1: Main Page Load
Write-Host "[TEST 1] Main Page Load..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $baseUrl -Method GET -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "  ✅ PASSED - Status: $($response.StatusCode), Size: $($response.RawContentLength) bytes" -ForegroundColor Green
        $passedTests++
    }
} catch {
    Write-Host "  ❌ FAILED - $_" -ForegroundColor Red
    $failedTests++
}

# Test 2: Static Assets (Logo)
Write-Host "`n[TEST 2] Static Assets (Logo)..." -ForegroundColor Yellow
try {
    $logo = Invoke-WebRequest -Uri "$baseUrl/optipath-logo.png" -Method GET -UseBasicParsing -TimeoutSec 10
    if ($logo.StatusCode -eq 200 -and $logo.RawContentLength -gt 0) {
        Write-Host "  ✅ PASSED - Logo loaded: $($logo.RawContentLength) bytes" -ForegroundColor Green
        $passedTests++
    }
} catch {
    Write-Host "  ❌ FAILED - $_" -ForegroundColor Red
    $failedTests++
}

# Test 3: JavaScript Bundle
Write-Host "`n[TEST 3] JavaScript Bundle..." -ForegroundColor Yellow
try {
    $index = Invoke-WebRequest -Uri $baseUrl -Method GET -UseBasicParsing -TimeoutSec 10
    if ($index.Content -match 'src="(/assets/[^"]+\.js)"') {
        $jsFile = $matches[1]
        $jsResponse = Invoke-WebRequest -Uri "$baseUrl$jsFile" -Method GET -UseBasicParsing -TimeoutSec 10
        if ($jsResponse.StatusCode -eq 200) {
            Write-Host "  ✅ PASSED - JS Bundle: $jsFile ($($jsResponse.RawContentLength) bytes)" -ForegroundColor Green
            $passedTests++
        }
    } else {
        throw "JS bundle not found in HTML"
    }
} catch {
    Write-Host "  ❌ FAILED - $_" -ForegroundColor Red
    $failedTests++
}

# Test 4: CSS Bundle
Write-Host "`n[TEST 4] CSS Bundle..." -ForegroundColor Yellow
try {
    if ($index.Content -match 'href="(/assets/[^"]+\.css)"') {
        $cssFile = $matches[1]
        $cssResponse = Invoke-WebRequest -Uri "$baseUrl$cssFile" -Method GET -UseBasicParsing -TimeoutSec 10
        if ($cssResponse.StatusCode -eq 200) {
            Write-Host "  ✅ PASSED - CSS Bundle: $cssFile ($($cssResponse.RawContentLength) bytes)" -ForegroundColor Green
            $passedTests++
        }
    } else {
        throw "CSS bundle not found in HTML"
    }
} catch {
    Write-Host "  ❌ FAILED - $_" -ForegroundColor Red
    $failedTests++
}

# Test 5: Dijkstra API
Write-Host "`n[TEST 5] Dijkstra Algorithm API..." -ForegroundColor Yellow
try {
    $testGraph = @{
        nodes = @(
            @{id='A'},
            @{id='B'},
            @{id='C'},
            @{id='D'}
        )
        edges = @(
            @{source='A'; target='B'; weight=4},
            @{source='A'; target='C'; weight=2},
            @{source='B'; target='C'; weight=1},
            @{source='B'; target='D'; weight=5},
            @{source='C'; target='D'; weight=3}
        )
        startNode = 'A'
    }
    $json = $testGraph | ConvertTo-Json -Depth 10
    $response = Invoke-WebRequest -Uri "$baseUrl/api/algo/dijkstra" -Method POST -ContentType "application/json" -Body $json -UseBasicParsing -TimeoutSec 10
    
    if ($response.StatusCode -eq 200) {
        $data = $response.Content | ConvertFrom-Json
        if ($data.distances -and $data.steps -and $data.previous) {
            Write-Host "  ✅ PASSED - Dijkstra executed successfully" -ForegroundColor Green
            Write-Host "     - Distances from A: $($data.distances | ConvertTo-Json -Compress)" -ForegroundColor Gray
            Write-Host "     - Total steps: $($data.steps.Count)" -ForegroundColor Gray
            $passedTests++
        } else {
            throw "Invalid response structure"
        }
    }
} catch {
    Write-Host "  ❌ FAILED - $_" -ForegroundColor Red
    $failedTests++
}

# Test 6: Floyd-Warshall API
Write-Host "`n[TEST 6] Floyd-Warshall Algorithm API..." -ForegroundColor Yellow
try {
    $testGraph = @{
        nodes = @(
            @{id='X'},
            @{id='Y'},
            @{id='Z'}
        )
        edges = @(
            @{source='X'; target='Y'; weight=5},
            @{source='Y'; target='Z'; weight=3},
            @{source='X'; target='Z'; weight=10}
        )
    }
    $json = $testGraph | ConvertTo-Json -Depth 10
    $response = Invoke-WebRequest -Uri "$baseUrl/api/algo/floyd-warshall" -Method POST -ContentType "application/json" -Body $json -UseBasicParsing -TimeoutSec 10
    
    if ($response.StatusCode -eq 200) {
        $data = $response.Content | ConvertFrom-Json
        if ($data.matrix -and $data.steps -and $data.nodeOrder) {
            Write-Host "  ✅ PASSED - Floyd-Warshall executed successfully" -ForegroundColor Green
            Write-Host "     - Node order: $($data.nodeOrder -join ', ')" -ForegroundColor Gray
            Write-Host "     - Total steps: $($data.steps.Count)" -ForegroundColor Gray
            $passedTests++
        } else {
            throw "Invalid response structure"
        }
    }
} catch {
    Write-Host "  ❌ FAILED - $_" -ForegroundColor Red
    $failedTests++
}

# Test 7: API Error Handling
Write-Host "`n[TEST 7] API Error Handling (Invalid Request)..." -ForegroundColor Yellow
try {
    $invalidData = @{nodes=@(); edges=@()} | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "$baseUrl/api/algo/dijkstra" -Method POST -ContentType "application/json" -Body $invalidData -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
    Write-Host "  ❌ FAILED - Should have returned error for invalid data" -ForegroundColor Red
    $failedTests++
} catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "  ✅ PASSED - Correctly returned 400 Bad Request for invalid data" -ForegroundColor Green
        $passedTests++
    } else {
        Write-Host "  ❌ FAILED - Unexpected error: $_" -ForegroundColor Red
        $failedTests++
    }
}

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Test Results Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total Tests: $($passedTests + $failedTests)" -ForegroundColor White
Write-Host "Passed: $passedTests" -ForegroundColor Green
Write-Host "Failed: $failedTests" -ForegroundColor Red

if ($failedTests -eq 0) {
    Write-Host "`n🎉 ALL TESTS PASSED! Deployment is working correctly." -ForegroundColor Green
    exit 0
} else {
    Write-Host "`n⚠️  Some tests failed. Please review the errors above." -ForegroundColor Yellow
    exit 1
}
