# Colorful Words

Type in a word. Get its associated color palette.

***<pic here>***

Try it ***[here](link)***

### How it works

1. Scrapes top 20 google images search of the word.
2. For each image, uses color quantification algorithm([MMCQ (modified median cut quantization)](https://en.wikipedia.org/wiki/Median_cut)) to extract color palette
3. Uses MMCQ again to get most used colors of all images into a final color palette.
4. Obviously going to be [very very slow](https://giphy.com/gifs/disneyzootopia-l2JHVUriDGEtWOx0c). Don't worry, optimizations are coming.
