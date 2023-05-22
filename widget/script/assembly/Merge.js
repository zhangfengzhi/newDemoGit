/**
 * Created by DuYaLong on 2016/4/27.
 */

function MergePic(BackPicUrl,FrontPicUrl,callback) {
    var firstCanvas = document.createElement("canvas");
    var firstContent = firstCanvas.getContext("2d");
    var secondCanvas = document.createElement("canvas");
    var secondContent = secondCanvas.getContext("2d");
    var firstImage = new Image();
    firstImage.src = BackPicUrl;
    firstImage.onload = function () {
        var secondImage = new Image();
        secondImage.src = FrontPicUrl;
        secondImage.onload = function () {
            secondCanvas.width = secondImage.width;
            secondCanvas.height = secondImage.height;
            var firstRadio = firstImage.width / firstImage.height;
            var secondRadio = secondCanvas.width / secondCanvas.height;
            if (firstRadio > secondRadio) {
                firstCanvas.width = secondCanvas.width;
                firstCanvas.height = secondCanvas.width / firstRadio;
            } else {
                firstCanvas.height = secondCanvas.height;
                firstCanvas.width = Math.round(secondCanvas.height * firstRadio);
            }
            firstContent.drawImage(firstImage, 0, 0, firstCanvas.width, firstCanvas.height);
            secondContent.drawImage(firstCanvas, (secondCanvas.width - firstCanvas.width) / 2.0, (secondCanvas.height - firstCanvas.height) / 2.0);
            secondContent.drawImage(secondImage, 0, 0);
            callback(secondCanvas.toDataURL("image/png"));
        }
    }
}
