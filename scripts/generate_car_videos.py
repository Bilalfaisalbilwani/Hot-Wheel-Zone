import os
import subprocess
import urllib.request

os.makedirs('public/videos', exist_ok=True)
os.makedirs('temp_car_images', exist_ok=True)

videos = [
    {
        'id': 'mercedes_vclass_tour',
        'url': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=90',
        'text': 'HOTWHEELS CAR RENTAL | Mercedes-Benz V-Class VIP'
    },
    {
        'id': 'mercedes_sclass_tour',
        'url': 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=90',
        'text': 'HOTWHEELS CAR RENTAL | Mercedes-Benz S-Class 500'
    },
    {
        'id': 'nissan_sentra_tour',
        'url': 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1600&q=90',
        'text': 'HOTWHEELS CAR RENTAL | Nissan Sentra 2.0L'
    },
    {
        'id': 'toyota_prado_tour',
        'url': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1600&q=90',
        'text': 'HOTWHEELS CAR RENTAL | Toyota Land Cruiser Prado'
    },
    {
        'id': 'chevrolet_malibu_tour',
        'url': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1600&q=90',
        'text': 'HOTWHEELS CAR RENTAL | Chevrolet Malibu Turbo'
    }
]

headers = {'User-Agent': 'Mozilla/5.0'}

for item in videos:
    img_path = f"temp_car_images/{item['id']}.jpg"
    out_mp4 = f"public/videos/{item['id']}.mp4"
    
    print(f"Downloading image for {item['id']}...")
    req = urllib.request.Request(item['url'], headers=headers)
    with urllib.request.urlopen(req) as response, open(img_path, 'wb') as out_file:
        out_file.write(response.read())
    
    print(f"Generating video for {item['id']}...")
    # Generate smooth 8-second 1080p Ken-Burns style car tour video with no audio track (totally silent)
    cmd = [
        'ffmpeg', '-y', '-loop', '1', '-i', img_path,
        '-vf', (
            "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,"
            "zoompan=z='min(zoom+0.0015,1.25)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=240:s=1280x720:fps=30,"
            "drawbox=y=ih-80:color=black@0.6:width=iw:height=80:t=fill,"
            f"drawtext=text='{item['text']}':fontcolor=white:fontsize=28:x=40:y=h-55"
        ),
        '-c:v', 'libx264', '-t', '8', '-pix_fmt', 'yuv420p',
        out_mp4
    ]
    subprocess.run(cmd, check=True)
    print(f"Saved: {out_mp4}")

print("All car walkaround videos generated successfully!")
