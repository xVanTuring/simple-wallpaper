import argparse
import pathlib

import requests

RESO_MAP = {"1K": "1920x1080", "2K": "2560x1440", "4K": "3840x2160"}


def build_url(tags: str, resolution: str):
    base_url = "https://source.unsplash.com"
    url_array = [base_url]
    if tags == "random":
        url_array.append("random")
    else:
        url_array.append("featured")
    if resolution != "":
        if resolution in RESO_MAP:
            url_array.append(RESO_MAP[resolution])
        else:
            url_array.append(resolution)
    if tags != "random":
        url_array.append("?" + ",".join(map(lambda x: x.strip(), tags.split(","))))
    return "/".join(url_array)


def download_url(image_url: str):
    response = requests.get(image_url)
    id = response.headers["x-imgix-id"]
    img_path = pathlib.Path(f"./{id}.jpeg")
    open(img_path, "wb").write(response.content)
    return img_path


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


if __name__ == "__main__":
    main()
