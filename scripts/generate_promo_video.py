import os
import sys
import math
import asyncio
import subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg
import edge_tts

# Paths
ROOT_DIR = r"D:\AI\digital-store"
OUTPUT_DIR = os.path.join(ROOT_DIR, "public")
FINAL_VIDEO_PATH = os.path.join(OUTPUT_DIR, "nexus_promo_reel.mp4")
DESKTOP_PATH = r"D:\Abhisek personal\Desktop"
FFMPEG_EXE = imageio_ffmpeg.get_ffmpeg_exe()

VOICE_TEXT = (
    "Why are you paying monthly subscriptions just to track simple daily habits? "
    "High performers don't rely on bloated apps that lag. They use clean, offline systems. "
    "Meet the 16-in-1 Personal Growth System. "
    "Automated habit streaks, 20-goal master matrix, and finance tracking in one instant dashboard. "
    "No monthly fees. Just 10 rupees in India or one dollar globally for lifetime access. "
    "Comment GROWTH below or tap the link in bio to download yours instantly."
)

FONT_REGULAR = r"C:\Windows\Fonts\segoeui.ttf"
FONT_BOLD = r"C:\Windows\Fonts\segoeuib.ttf"

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

async def generate_voiceover(audio_path):
    print("[1/5] Generating neural voiceover via edge-tts...")
    communicate = edge_tts.Communicate(
        text=VOICE_TEXT,
        voice="en-US-ChristopherNeural",
        rate="+8%",
        pitch="-2Hz"
    )
    await communicate.save(audio_path)
    print("Voiceover generated successfully.")

def get_audio_duration(audio_path):
    cmd = [
        FFMPEG_EXE,
        "-i", audio_path,
        "-show_entries", "format=duration",
        "-v", "quiet",
        "-of", "csv=p=0"
    ]
    # Use ffmpeg inspect
    proc = subprocess.run([FFMPEG_EXE, "-i", audio_path], stderr=subprocess.PIPE, text=True)
    for line in proc.stderr.splitlines():
        if "Duration:" in line:
            # Duration: 00:00:23.45, start: 0.000000, bitrate: 48 kb/s
            parts = line.split("Duration:")[1].split(",")[0].strip()
            h, m, s = parts.split(":")
            return float(h) * 3600 + float(m) * 60 + float(s)
    return 24.0

def generate_bg_music(duration, output_path):
    print("[2/5] Synthesizing atmospheric ambient soundbed...")
    sample_rate = 44100
    total_samples = int(sample_rate * duration)
    t = np.linspace(0, duration, total_samples, False)

    # Ambient low synth chord progression (Cm: C2 - Eb2 - G2 - Bb1)
    frequencies = [65.41, 77.78, 98.00, 58.27]
    chord_len = duration / len(frequencies)
    
    ambient_wave = np.zeros(total_samples)
    for i, f in enumerate(frequencies):
        start = int(i * chord_len * sample_rate)
        end = int((i + 1) * chord_len * sample_rate) if i < len(frequencies) - 1 else total_samples
        seg_t = t[start:end]
        # Warm sub-bass + octave harmonic
        tone = 0.5 * np.sin(2 * np.pi * f * seg_t) + 0.25 * np.sin(2 * np.pi * (f * 2) * seg_t)
        # Slow tremolo
        tremolo = 0.8 + 0.2 * np.sin(2 * np.pi * 1.5 * seg_t)
        ambient_wave[start:end] = tone * tremolo

    # Add gentle rhythmic high-hat pulse (120 bpm = 2 bps)
    pulse_freq = 2.0
    pulse_envelope = np.maximum(0, np.sin(2 * np.pi * pulse_freq * t)) ** 8
    noise = np.random.normal(0, 0.04, total_samples) * pulse_envelope

    audio = (ambient_wave * 0.15) + (noise * 0.05)
    # Fade in / out
    fade_len = int(sample_rate * 1.5)
    fade_in = np.linspace(0, 1, fade_len)
    fade_out = np.linspace(1, 0, fade_len)
    audio[:fade_len] *= fade_in
    audio[-fade_len:] *= fade_out

    # Convert to 16-bit PCM
    audio_int16 = (np.clip(audio, -1.0, 1.0) * 32767).astype(np.int16)
    
    # Save as wav using scipy or raw
    import wave
    with wave.open(output_path, 'w') as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(audio_int16.tobytes())
    print("Soundbed synthesized.")

def mix_audio(voice_path, bgm_path, output_path):
    print("[3/5] Mixing voiceover and soundbed...")
    cmd = [
        FFMPEG_EXE, "-y",
        "-i", voice_path,
        "-i", bgm_path,
        "-filter_complex",
        "[0:a]volume=1.4[voice];[1:a]volume=0.35[bgm];[voice][bgm]amix=inputs=2:duration=first:dropout_transition=2[out]",
        "-map", "[out]",
        "-c:a", "libmp3lame",
        "-b:a", "192k",
        output_path
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    print("Audio mix complete.")

def render_frame(frame_idx, total_frames, fps, duration):
    width, height = 1080, 1920
    current_time = frame_idx / fps
    progress = frame_idx / total_frames

    # Determine Scene (5 scenes)
    scene_dur = duration / 5.0
    scene_idx = min(4, int(current_time / scene_dur))
    scene_prog = (current_time % scene_dur) / scene_dur

    # Create Base Canvas
    img = Image.new("RGB", (width, height), (9, 9, 11))
    draw = ImageDraw.Draw(img)

    # 1. Background Grid & Ambient Glow
    glow_y = int(960 + 200 * math.sin(current_time * 1.2))
    glow_color = (16, 185, 129) if scene_idx in [1, 2, 4] else (239, 68, 68) if scene_idx == 0 else (245, 158, 11)
    
    # Ambient radial glow simulation
    for r in range(400, 50, -50):
        alpha = int(12 * (1.0 - r / 400))
        c = (glow_color[0] // 10, glow_color[1] // 10, glow_color[2] // 10)
        draw.ellipse([540 - r, glow_y - r, 540 + r, glow_y + r], fill=c)

    # Subtle horizontal grid lines
    for gy in range(0, height, 120):
        draw.line([(0, gy), (width, gy)], fill=(24, 24, 27), width=1)
    for gx in range(0, width, 120):
        draw.line([(gx, 0), (gx, height)], fill=(24, 24, 27), width=1)

    # 2. Top Header Brand Pill
    f_badge = get_font(FONT_BOLD, 32)
    f_title = get_font(FONT_BOLD, 72)
    f_sub = get_font(FONT_REGULAR, 40)
    f_body = get_font(FONT_REGULAR, 36)
    f_bold = get_font(FONT_BOLD, 44)

    # Top Brand Bar
    draw.rounded_rectangle([320, 140, 760, 210], radius=35, fill=(18, 18, 22), outline=(39, 39, 42), width=2)
    # Green pulse dot
    pulse_rad = 7 + int(3 * math.sin(current_time * 6))
    draw.ellipse([360 - pulse_rad, 175 - pulse_rad, 360 + pulse_rad, 175 + pulse_rad], fill=(16, 185, 129))
    draw.text((385, 155), "NEXUS DIGITAL STORE", font=f_badge, fill=(228, 228, 231))

    # Center Glass Card (Width: 920, Height: 1100, Centered)
    cx1, cy1, cx2, cy2 = 80, 360, 1000, 1540
    draw.rounded_rectangle([cx1, cy1, cx2, cy2], radius=40, fill=(15, 15, 19), outline=(45, 45, 52), width=3)

    # SCENE CONTENT
    if scene_idx == 0:
        # Scene 1: Pattern Interrupt Hook
        # Badge
        draw.rounded_rectangle([140, 430, 480, 500], radius=25, fill=(45, 15, 15), outline=(239, 68, 68), width=2)
        draw.text((165, 445), "⚠️ THE SUBSCRIPTION TRAP", font=get_font(FONT_BOLD, 26), fill=(248, 113, 113))

        # Big Headline
        draw.text((140, 550), "STOP PAYING", font=f_title, fill=(255, 255, 255))
        draw.text((140, 640), "MONTHLY FEES", font=f_title, fill=(239, 68, 68))
        draw.text((140, 730), "FOR HABIT APPS", font=f_title, fill=(255, 255, 255))

        # Problem Box
        draw.rounded_rectangle([140, 880, 940, 1220], radius=30, fill=(24, 24, 27), outline=(39, 39, 42), width=2)
        draw.text((180, 930), "Notion / SaaS Habit Trackers:", font=f_sub, fill=(161, 161, 170))
        draw.text((180, 1000), "₹1,200 / Month ($14.99/mo)", font=f_bold, fill=(255, 255, 255))
        draw.text((180, 1070), "Slow Loading • Requires Internet", font=f_body, fill=(113, 113, 122))
        draw.text((180, 1130), "Ongoing Credit Card Drain", font=f_body, fill=(113, 113, 122))

        # Strikethrough Stamp
        stamp_rot = 1000 + int(30 * math.sin(current_time * 4))
        draw.rounded_rectangle([250, 1280, 830, 1390], radius=25, fill=(185, 28, 28))
        draw.text((310, 1305), "❌ SUBSCRIPTION CANCELLED", font=f_bold, fill=(255, 255, 255))

    elif scene_idx == 1:
        # Scene 2: High Performers
        draw.rounded_rectangle([140, 430, 520, 500], radius=25, fill=(16, 45, 30), outline=(16, 185, 129), width=2)
        draw.text((165, 445), "⚡ HIGH PERFORMER RULE", font=get_font(FONT_BOLD, 26), fill=(52, 211, 153))

        draw.text((140, 550), "DISCIPLINE", font=f_title, fill=(255, 255, 255))
        draw.text((140, 640), "NEEDS SYSTEMS", font=f_title, fill=(16, 185, 129))
        draw.text((140, 730), "NOT BLOATED APPS", font=f_title, fill=(255, 255, 255))

        # 3 Pillar Cards
        pillars = [
            ("⚡ 0.5s Instant Open", "No loading circles or sync delays"),
            ("🔒 100% Offline & Private", "Your data stays on your device forever"),
            ("📈 Automated Math Streaks", "Formulas calculate progress in real time")
        ]
        for p_idx, (p_title, p_desc) in enumerate(pillars):
            py = 880 + p_idx * 160
            draw.rounded_rectangle([140, py, 940, py + 130], radius=24, fill=(24, 24, 27), outline=(39, 39, 42), width=1)
            draw.text((180, py + 20), p_title, font=f_bold, fill=(255, 255, 255))
            draw.text((180, py + 75), p_desc, font=get_font(FONT_REGULAR, 28), fill=(161, 161, 170))

    elif scene_idx == 2:
        # Scene 3: Flagship Showcase
        draw.rounded_rectangle([140, 430, 580, 500], radius=25, fill=(10, 35, 45), outline=(6, 182, 212), width=2)
        draw.text((165, 445), "💎 16-IN-1 PERSONAL GROWTH", font=get_font(FONT_BOLD, 26), fill=(34, 211, 238))

        draw.text((140, 550), "ONE DASHBOARD.", font=f_title, fill=(255, 255, 255))
        draw.text((140, 640), "TOTAL FOCUS.", font=f_title, fill=(34, 211, 238))

        # Animated Progress Dashboard Simulation
        draw.rounded_rectangle([140, 760, 940, 1140], radius=28, fill=(20, 20, 24), outline=(39, 39, 42), width=2)
        draw.text((180, 800), "DAILY HABIT STREAK MATRIX", font=get_font(FONT_BOLD, 30), fill=(161, 161, 170))
        
        # Dynamic progress bar
        pct = min(94, int(40 + 54 * (scene_prog)))
        draw.text((180, 850), f"Overall Score: {pct}% Completed", font=f_bold, fill=(16, 185, 129))
        
        # Bar track
        draw.rounded_rectangle([180, 930, 900, 975], radius=20, fill=(39, 39, 42))
        bar_fill = 180 + int((900 - 180) * (pct / 100.0))
        draw.rounded_rectangle([180, 930, bar_fill, 975], radius=20, fill=(16, 185, 129))

        draw.text((180, 1010), "✓ 20-Goal Master Matrix  •  ✓ Wealth Tracker", font=get_font(FONT_REGULAR, 30), fill=(228, 228, 231))
        draw.text((180, 1065), "✓ Sunday Reset System    •  ✓ Reflection Prompts", font=get_font(FONT_REGULAR, 30), fill=(228, 228, 231))

        # Format compatibility pills
        draw.rounded_rectangle([140, 1200, 520, 1290], radius=25, fill=(22, 101, 52))
        draw.text((170, 1225), "📊 Microsoft Excel Ready", font=get_font(FONT_BOLD, 30), fill=(255, 255, 255))

        draw.rounded_rectangle([560, 1200, 940, 1290], radius=25, fill=(30, 58, 138))
        draw.text((590, 1225), "📑 Google Sheets Ready", font=get_font(FONT_BOLD, 30), fill=(255, 255, 255))

    elif scene_idx == 3:
        # Scene 4: The Offer
        draw.rounded_rectangle([140, 430, 540, 500], radius=25, fill=(45, 35, 10), outline=(245, 158, 11), width=2)
        draw.text((165, 445), "🔥 NO-BRAINER PRICING", font=get_font(FONT_BOLD, 26), fill=(251, 191, 36))

        draw.text((140, 550), "LIFETIME ACCESS", font=f_title, fill=(255, 255, 255))
        draw.text((140, 640), "ZERO SUBSCRIPTION", font=f_title, fill=(245, 158, 11))

        # Giant Price Card
        draw.rounded_rectangle([140, 760, 940, 1180], radius=30, fill=(20, 20, 26), outline=(245, 158, 11), width=2)
        draw.text((260, 810), "SPECIAL LAUNCH PRICE", font=f_badge, fill=(161, 161, 170))
        
        # Giant Price
        draw.text((250, 890), "₹10", font=get_font(FONT_BOLD, 120), fill=(52, 211, 153))
        draw.text((500, 940), "INR (India)", font=f_sub, fill=(161, 161, 170))

        draw.text((250, 1030), "$1.00", font=get_font(FONT_BOLD, 64), fill=(255, 255, 255))
        draw.text((440, 1045), "USD (International PPP)", font=f_sub, fill=(161, 161, 170))

        # Comparison
        draw.rounded_rectangle([140, 1240, 940, 1380], radius=25, fill=(24, 24, 27), outline=(39, 39, 42), width=1)
        draw.text((180, 1270), "SaaS Habit Apps: ₹6,000 to ₹14,000 / Year", font=f_sub, fill=(161, 161, 170))
        draw.text((180, 1320), "NEXUS Store: Just ₹10 Once • Keep Forever", font=f_bold, fill=(52, 211, 153))

    else:
        # Scene 5: Frictionless CTA
        draw.rounded_rectangle([140, 430, 480, 500], radius=25, fill=(16, 45, 30), outline=(16, 185, 129), width=2)
        draw.text((165, 445), "🚀 INSTANT DOWNLOAD", font=get_font(FONT_BOLD, 26), fill=(52, 211, 153))

        draw.text((140, 550), "CLAIM YOURS", font=f_title, fill=(255, 255, 255))
        draw.text((140, 640), "BEFORE LAUNCH ENDS", font=f_title, fill=(16, 185, 129))

        # CTA Callout Card
        draw.rounded_rectangle([140, 780, 940, 1200], radius=32, fill=(24, 24, 30), outline=(16, 185, 129), width=3)
        draw.text((200, 830), "Step 1: Comment Below 👇", font=f_sub, fill=(161, 161, 170))
        
        # Big Glowing "GROWTH" box
        draw.rounded_rectangle([200, 900, 880, 1010], radius=25, fill=(16, 185, 129))
        draw.text((340, 920), '"GROWTH"', font=get_font(FONT_BOLD, 64), fill=(0, 0, 0))

        draw.text((200, 1050), "Step 2: Or Tap Direct Link In Bio", font=f_sub, fill=(161, 161, 170))
        draw.text((200, 1110), "nexus-store-woad.vercel.app", font=f_bold, fill=(34, 211, 238))

        # Direct Button
        draw.rounded_rectangle([140, 1260, 940, 1380], radius=28, fill=(255, 255, 255))
        draw.text((280, 1295), "DOWNLOAD NOW (₹10 / $1)", font=f_bold, fill=(0, 0, 0))

    # Bottom Progress Bar
    draw.rectangle([0, height - 14, width, height], fill=(24, 24, 27))
    bar_w = int(width * progress)
    draw.rectangle([0, height - 14, bar_w, height], fill=(16, 185, 129))

    return img.tobytes("raw", "RGB")

async def main():
    print("=== NEXUS AI Video Generator Pipeline ===")
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    temp_voice = os.path.join(ROOT_DIR, "scripts", "temp_voice.mp3")
    temp_bgm = os.path.join(ROOT_DIR, "scripts", "temp_bgm.wav")
    temp_audio = os.path.join(ROOT_DIR, "scripts", "temp_audio.mp3")

    # 1. Voiceover
    await generate_voiceover(temp_voice)
    duration = get_audio_duration(temp_voice) + 1.2
    print(f"Total Video Target Duration: {duration:.2f} seconds")

    # 2. Soundbed
    generate_bg_music(duration, temp_bgm)

    # 3. Mix
    mix_audio(temp_voice, temp_bgm, temp_audio)

    # 4. Video Rendering with FFmpeg Pipe
    fps = 30
    total_frames = int(duration * fps)
    print(f"[4/5] Rendering {total_frames} frames at {fps} FPS (1080x1920 9:16)...")

    cmd = [
        FFMPEG_EXE, "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", "1080x1920",
        "-pix_fmt", "rgb24",
        "-r", str(fps),
        "-i", "-",
        "-i", temp_audio,
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", "18",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        FINAL_VIDEO_PATH
    ]

    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    for f_idx in range(total_frames):
        raw_frame = render_frame(f_idx, total_frames, fps, duration)
        proc.stdin.write(raw_frame)
        if f_idx % 90 == 0:
            pct = (f_idx / total_frames) * 100
            print(f"  Rendering progress: {pct:.1f}% ({f_idx}/{total_frames} frames)")

    proc.stdin.close()
    proc.wait()
    print("[5/5] Encoding complete!")
    print(f"Video saved to: {FINAL_VIDEO_PATH}")

    # Copy to Desktop for instant access
    if os.path.exists(DESKTOP_PATH):
        desktop_video = os.path.join(DESKTOP_PATH, "NEXUS Promo Reel.mp4")
        import shutil
        shutil.copy2(FINAL_VIDEO_PATH, desktop_video)
        print(f"Copied to Desktop: {desktop_video}")

    # Cleanup temp
    for p in [temp_voice, temp_bgm, temp_audio]:
        if os.path.exists(p):
            try:
                os.remove(p)
            except Exception:
                pass

if __name__ == "__main__":
    asyncio.run(main())
