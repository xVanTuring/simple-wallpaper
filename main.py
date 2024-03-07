import argparse
import pathlib

import requests

def build_url(tags: str = "random", resolution: str = "1K") -> str:
    """
    Build Unsplash URL from tags and resolution.

    Args:
        tags (str): The tags to search for in the image. If set to "random", a random image will be returned. Default is "random".
        resolution (str): The desired resolution of the image. Valid options are "1K", "2K", and "4K". Default is "1K".

    Returns:
        str: The constructed URL for the image based on the provided tags and resolution.
    """
    RESO_MAP = {"1K": "1920x1080", "2K": "2560x1440", "4K": "3840x2160"}
    base_url = "https://source.unsplash.com"
    url_array = [base_url, "random" if tags == "random" else "featured"]
    if resolution != "":
        url_array.append(RESO_MAP.get(resolution, resolution))
    if tags != "random":
        url_array.append("?" + ",".join(map(str.strip, tags.split(","))))
    return "/".join(url_array)


def download_url(image_url: str) -> str:
    """
    download image from url and return absolute path str
    """
    response = requests.get(image_url)
    id = response.headers["x-imgix-id"]
    img_path = pathlib.Path(f"./{id}.jpeg")
    open(img_path, "wb").write(response.content)
    return str(img_path.absolute())


parser = argparse.ArgumentParser(
    prog="Simple Wallpaper",
    description="A Program changes wallaper",
    epilog="xVanTuring@2024",
)
parser.add_argument("-t", "--tags", required=False, default="random")
parser.add_argument("-r", "--resolution", default="1K")


def main():
    args = parser.parse_args()
    image_url = build_url(args.tags, args.resolution)
    image_path = download_url(image_url)
    change_wallpaper(image_path)


def change_wallpaper(abs_path: str):
    """
    change wallpaper to `path`
    """
    import platform

    system = platform.system()
    if system == "Windows":
        change_wallpaper_win(abs_path)
    elif system == "Darwin":
        change_wallpaper_macos(abs_path)
    else:
        print(f"{system} is not implemented")


def change_wallpaper_win(abs_path: str):
    """
    change windows wallpaper to `path`
    """
    import ctypes

    ctypes.windll.user32.SystemParametersInfoW(
        20,
        0,
        abs_path,
        0x0000,
    )


def change_wallpaper_macos(abs_path: str):
    """
    change macos wallpaper to `path`
    TODO: require test in macos
    """
    import subprocess

    subprocess.call(
        [
            "osascript",
            "-e",
            'tell application "System Events" to set desktop picture to POSIX file "{}"'.format(
                abs_path
            ),
        ]
    )


if __name__ == "__main__":
    main()
