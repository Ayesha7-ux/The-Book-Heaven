if (Test-Path ./build.log) {
  $b = Get-Content ./build.log -Raw
  $txt = $b
  # try to detect utf16 and convert
  try {
    [System.IO.File]::WriteAllText('./build.txt',[System.Text.Encoding]::Unicode.GetString([System.IO.File]::ReadAllBytes('./build.log')))
    Write-Output 'wrote build.txt'
  } catch {
    Write-Output 'could not decode as unicode, writing as utf8'
    [System.IO.File]::WriteAllText('./build.txt',[System.IO.File]::ReadAllText('./build.log'))
  }
  Get-Content build.txt | Select-String -Pattern 'Error|Failed|Exported' -Context 0,2
} else { Write-Output 'no build.log' }
