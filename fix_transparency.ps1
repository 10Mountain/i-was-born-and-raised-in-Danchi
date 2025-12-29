Add-Type -AssemblyName System.Drawing

function Remove-Background {
    param (
        [string]$inputPath
    )

    $img = [System.Drawing.Bitmap]::FromFile($inputPath)
    $width = $img.Width
    $height = $img.Height
    
    # Get background color from top-left pixel
    $bgColor = $img.GetPixel(0, 0)
    $tolerance = 30

    # Create a new bitmap for output
    $newImg = New-Object System.Drawing.Bitmap($width, $height)
    
    # We need to lock bits for speed, but for simplicity in PS, we'll use Get/SetPixel or a simpler approach.
    # Actually, Get/SetPixel is slow in PS loop.
    # Let's try a simpler "MakeTransparent" if the background is uniform.
    # But user said "squares", implying it might be a specific color block.
    
    # Let's try the built-in MakeTransparent first, it's the easiest.
    # It makes a specific color transparent.
    $newImg = $img.Clone()
    $newImg.MakeTransparent($bgColor)
    
    # Save
    $img.Dispose()
    $newImg.Save($inputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $newImg.Dispose()
    Write-Host "Processed $inputPath"
}

Remove-Background -inputPath "c:\Users\81901\.gemini\antigravity\scratch\game\assets\enemy_car.png"
Remove-Background -inputPath "c:\Users\81901\.gemini\antigravity\scratch\game\assets\enemy_crow.png"
