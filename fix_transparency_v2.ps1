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
    $bgR = $bgColor.R
    $bgG = $bgColor.G
    $bgB = $bgColor.B
    
    $tolerance = 40 # Tolerance for compression artifacts

    # Create a new bitmap for output
    $newImg = New-Object System.Drawing.Bitmap($width, $height)
    
    for ($x = 0; $x -lt $width; $x++) {
        for ($y = 0; $y -lt $height; $y++) {
            $pixel = $img.GetPixel($x, $y)
            
            $diffR = [Math]::Abs($pixel.R - $bgR)
            $diffG = [Math]::Abs($pixel.G - $bgG)
            $diffB = [Math]::Abs($pixel.B - $bgB)
            
            if ($diffR -lt $tolerance -and $diffG -lt $tolerance -and $diffB -lt $tolerance) {
                # Make transparent
                $newImg.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
            }
            else {
                # Keep original pixel
                $newImg.SetPixel($x, $y, $pixel)
            }
        }
    }
    
    $img.Dispose()
    
    # Save
    $newImg.Save($inputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $newImg.Dispose()
    Write-Host "Processed $inputPath"
}

Remove-Background -inputPath "c:\Users\81901\.gemini\antigravity\scratch\game\assets\enemy_car.png"
Remove-Background -inputPath "c:\Users\81901\.gemini\antigravity\scratch\game\assets\enemy_crow.png"
