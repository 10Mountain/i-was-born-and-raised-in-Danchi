Add-Type -AssemblyName System.Drawing

function Remove-GreenBackground {
    param (
        [string]$inputPath,
        [string]$outputPath
    )

    $img = [System.Drawing.Bitmap]::FromFile($inputPath)
    $width = $img.Width
    $height = $img.Height
    
    # Green screen color to remove (approximate bright green)
    # We'll check for high Green and low Red/Blue
    
    $newImg = New-Object System.Drawing.Bitmap($width, $height)
    
    for ($x = 0; $x -lt $width; $x++) {
        for ($y = 0; $y -lt $height; $y++) {
            $pixel = $img.GetPixel($x, $y)
            
            # Check if it's green-ish
            # R < 100, G > 150, B < 100 is a safe bet for "bright green" background
            if ($pixel.G -gt 100 -and $pixel.R -lt 150 -and $pixel.B -lt 150) {
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
    $newImg.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $newImg.Dispose()
    Write-Host "Processed $inputPath to $outputPath"
}

Remove-GreenBackground -inputPath "C:\Users\81901\.gemini\antigravity\brain\a8d2511c-eed0-444f-b227-9b8b8908d258\enemy_car_green_1764809774369.png" -outputPath "c:\Users\81901\.gemini\antigravity\scratch\game\assets\enemy_car.png"
Remove-GreenBackground -inputPath "C:\Users\81901\.gemini\antigravity\brain\a8d2511c-eed0-444f-b227-9b8b8908d258\enemy_crow_green_1764809759508.png" -outputPath "c:\Users\81901\.gemini\antigravity\scratch\game\assets\enemy_crow.png"
