# Learn Images

Learn Images provides image compression and resizing for folders and individual files to help authors for learn.microsoft.com:

* [Learn Images](https://marketplace.visualstudio.com/items?itemName=docsmsft.docs-images), which compresses and resizes images.

## How to use the Learn Images extension

To access the Learn Images menu, right click on a folder or individual image file. Select "Compress all images in folder" or "Compress image" from the context menu.

![learn image context menu](https://raw.githubusercontent.com/microsoft/vscode-docs-authoring/main/media/image/right-click-image-compression.png)

Once the Learn Image extension is run you can view the output console in learn-images output tab to view the compression and resizing details.

![learn image output](https://raw.githubusercontent.com/microsoft/vscode-docs-authoring/main/media/image/image-compressed.png)

## Configuration

To configure the Learn Images, you can adjust the max height and max width of images. These are used when applying compression, if an image is larger than these values -- the image is resized whilst maintaining the aspect ratio, prior to compression.

![learn image config](https://raw.githubusercontent.com/microsoft/vscode-docs-authoring/main/media/image/docs-images-configuration.png)

> **Note:** A max height or width value of `0`, is interpreted as do not enforce resize.

## Supported image types

* .png
* .jpg
* .jpeg
* .gif
* .svg
* .webp (note that webp images are not currently supported on Learn as they would require platform support for fallback images)

## License

[MIT](https://ceapex@dev.azure.com/ceapex/Engineering/_git/learn-images/LICENSE)
