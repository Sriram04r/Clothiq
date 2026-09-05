while ($true) {
    Get-ChildItem -Path "android", "node_modules" -Filter "libc++_shared.so" -Recurse -ErrorAction SilentlyContinue | ForEach-Object {
        $item = Get-Item $_.FullName -Force
        if ($item.Target) {
            $target = $item.Target
            Remove-Item $_.FullName -Force
            Copy-Item $target -Destination $_.FullName
            Write-Host "Replaced: $($_.FullName)"
        }
    }
    Start-Sleep -Milliseconds 100
}
