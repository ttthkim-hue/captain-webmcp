[CmdletBinding()]
param(
    [string]$VoiceName = "Microsoft Mark",
    [int]$VoiceRate = 0
)

$ErrorActionPreference = "Stop"
$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptRoot
$artifactRoot = Join-Path $projectRoot "artifacts\video"
$framesRoot = Join-Path $artifactRoot "frames"
$audioRoot = Join-Path $artifactRoot "audio"
$clipsRoot = Join-Path $artifactRoot "clips"
$sceneSpecPath = Join-Path $scriptRoot "video-scenes.json"
$socialCardPath = Join-Path $projectRoot "public\og.png"
$outputPath = Join-Path $artifactRoot "captain-webmcp-demo-v2.mp4"

New-Item -ItemType Directory -Force -Path $audioRoot, $clipsRoot | Out-Null

$ffmpeg = (Get-Command ffmpeg -ErrorAction Stop).Source
$ffprobe = (Get-Command ffprobe -ErrorAction Stop).Source
$scenes = Get-Content -Raw -LiteralPath $sceneSpecPath | ConvertFrom-Json

Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$availableVoices = @($synth.GetInstalledVoices() | ForEach-Object { $_.VoiceInfo.Name })
if ($VoiceName -notin $availableVoices) {
    throw "Requested voice is not installed: $VoiceName"
}
$synth.SelectVoice($VoiceName)
$synth.Rate = $VoiceRate
$synth.Volume = 100

function Invoke-Checked {
    param(
        [Parameter(Mandatory = $true)][string]$Executable,
        [Parameter(Mandatory = $true)][string[]]$Arguments
    )

    $effectiveArguments = $Arguments
    if ((Split-Path -Leaf $Executable) -like "ffmpeg*") {
        $effectiveArguments = @("-hide_banner", "-loglevel", "error", "-xerror") + $Arguments
    }

    & $Executable @effectiveArguments
    if ($LASTEXITCODE -ne 0) {
        throw "Command failed with exit code ${LASTEXITCODE}: $Executable"
    }
}

function Get-MediaDuration {
    param([Parameter(Mandatory = $true)][string]$Path)

    $raw = & $ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 $Path
    if ($LASTEXITCODE -ne 0) {
        throw "Could not read media duration: $Path"
    }
    return [double]::Parse($raw.Trim(), [System.Globalization.CultureInfo]::InvariantCulture)
}

function New-SilentCardClip {
    param(
        [Parameter(Mandatory = $true)][string]$ImagePath,
        [Parameter(Mandatory = $true)][double]$Duration,
        [Parameter(Mandatory = $true)][string]$OutputPath
    )

    $fadeOut = [Math]::Max(0.5, $Duration - 0.55)
    $videoFilter = "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fade=t=in:st=0:d=0.45,fade=t=out:st=$($fadeOut.ToString('0.000',[System.Globalization.CultureInfo]::InvariantCulture)):d=0.5,format=yuv420p"
    $durationText = $Duration.ToString("0.000", [System.Globalization.CultureInfo]::InvariantCulture)

    Invoke-Checked -Executable $ffmpeg -Arguments @(
        "-y", "-loop", "1", "-framerate", "30", "-i", $ImagePath,
        "-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo",
        "-vf", $videoFilter,
        "-t", $durationText,
        "-r", "30", "-c:v", "libx264", "-preset", "medium", "-crf", "18",
        "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", $OutputPath
    )
}

$clipPaths = New-Object System.Collections.Generic.List[string]
$sceneManifest = New-Object System.Collections.Generic.List[object]

$introPath = Join-Path $clipsRoot "00-intro.mp4"
New-SilentCardClip -ImagePath $socialCardPath -Duration 3.0 -OutputPath $introPath
$clipPaths.Add($introPath)

try {
    foreach ($scene in $scenes) {
        $audioPath = Join-Path $audioRoot ("{0}.wav" -f $scene.id)
        $framePath = Join-Path $framesRoot $scene.frame
        $clipPath = Join-Path $clipsRoot ("{0}.mp4" -f $scene.id)

        if (-not (Test-Path -LiteralPath $framePath)) {
            throw "Missing video frame: $framePath"
        }

        $synth.SetOutputToWaveFile($audioPath)
        $synth.Speak([string]$scene.narration)
        $synth.SetOutputToNull()

        $audioDuration = Get-MediaDuration -Path $audioPath
        $clipDuration = $audioDuration + 1.1
        $fadeOut = [Math]::Max(0.8, $clipDuration - 0.5)
        $audioFadeOut = [Math]::Max(0.5, $clipDuration - 0.45)
        $durationText = $clipDuration.ToString("0.000", [System.Globalization.CultureInfo]::InvariantCulture)
        $fadeOutText = $fadeOut.ToString("0.000", [System.Globalization.CultureInfo]::InvariantCulture)
        $audioFadeText = $audioFadeOut.ToString("0.000", [System.Globalization.CultureInfo]::InvariantCulture)
        $escapedTitle = ([string]$scene.title).Replace("'", "\'").Replace(":", "\:")
        $fitMode = if ($scene.PSObject.Properties.Name -contains "fit") { [string]$scene.fit } else { "cover" }
        $frameFilter = if ($fitMode -eq "contain") {
            "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=0x080b12"
        } else {
            "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080"
        }
        $filter = "[0:v]${frameFilter},drawbox=x=45:y=42:w=760:h=88:color=black@0.64:t=fill,drawtext=fontfile='C\:/Windows/Fonts/seguisb.ttf':text='$escapedTitle':fontcolor=white:fontsize=34:x=76:y=67,fade=t=in:st=0:d=0.35,fade=t=out:st=${fadeOutText}:d=0.5,format=yuv420p[v];[1:a]adelay=500|500,aformat=channel_layouts=stereo,loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000,apad=pad_dur=0.7,afade=t=out:st=${audioFadeText}:d=0.4[a]"

        Invoke-Checked -Executable $ffmpeg -Arguments @(
            "-y", "-loop", "1", "-framerate", "30", "-i", $framePath,
            "-i", $audioPath,
            "-filter_complex", $filter,
            "-map", "[v]", "-map", "[a]", "-t", $durationText,
            "-r", "30", "-c:v", "libx264", "-preset", "medium", "-crf", "18",
            "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", $clipPath
        )

        $clipPaths.Add($clipPath)
        $sceneManifest.Add([pscustomobject]@{
            id = [string]$scene.id
            title = [string]$scene.title
            frame = [string]$scene.frame
            fit = $fitMode
            audio_duration_seconds = [Math]::Round($audioDuration, 3)
            clip_duration_seconds = [Math]::Round($clipDuration, 3)
        })
    }
}
finally {
    $synth.Dispose()
}

$outroPath = Join-Path $clipsRoot "99-outro.mp4"
New-SilentCardClip -ImagePath $socialCardPath -Duration 4.0 -OutputPath $outroPath
$clipPaths.Add($outroPath)

$concatPath = Join-Path $artifactRoot "concat.txt"
$concatLines = @($clipPaths | ForEach-Object {
    "file '$($_.Replace('\','/'))'"
})
[System.IO.File]::WriteAllLines($concatPath, $concatLines, [System.Text.UTF8Encoding]::new($false))

Invoke-Checked -Executable $ffmpeg -Arguments @(
    "-y", "-f", "concat", "-safe", "0", "-i", $concatPath,
    "-c:v", "libx264", "-preset", "medium", "-crf", "18",
    "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", $outputPath
)

$finalDuration = Get-MediaDuration -Path $outputPath
$finalHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $outputPath).Hash.ToLowerInvariant()
$manifest = [ordered]@{
    status = "complete"
    output = "captain-webmcp-demo-v2.mp4"
    voice = $VoiceName
    voice_rate = $VoiceRate
    width = 1920
    height = 1080
    frame_rate = 30
    duration_seconds = [Math]::Round($finalDuration, 3)
    sha256 = $finalHash
    scenes = $sceneManifest
}
$manifestPath = Join-Path $artifactRoot "build-manifest-v2.json"
[System.IO.File]::WriteAllText(
    $manifestPath,
    ($manifest | ConvertTo-Json -Depth 6),
    [System.Text.UTF8Encoding]::new($false)
)

$manifest | ConvertTo-Json -Depth 6
