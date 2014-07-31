var cornerstoneTools = (function ($, cornerstone, cornerstoneTools) {

    "use strict";

    if(cornerstoneTools === undefined) {
        cornerstoneTools = {};
    }

    var toolType = "stackScroll";

    function scroll(element, images)
    {
        var toolData = cornerstoneTools.getToolState(element, 'stack');
        if(toolData === undefined || toolData.data === undefined || toolData.data.length === 0) {
            return;
        }

        var stackData = toolData.data[0];

        var newImageIdIndex = stackData.currentImageIdIndex + images;
        newImageIdIndex = Math.min(stackData.imageIds.length - 1, newImageIdIndex);
        newImageIdIndex = Math.max(0, newImageIdIndex);

        if(newImageIdIndex !== stackData.currentImageIdIndex)
        {
            var viewport = cornerstone.getViewport(element);
            cornerstone.loadAndCacheImage(stackData.imageIds[newImageIdIndex]).then(function(image) {
                stackData.currentImageIdIndex = newImageIdIndex;
                cornerstone.displayImage(element, image, viewport);
            });
        }
    }

    function mouseUpCallback(e)
    {
        var mouseData = e.originalEvent.detail;
        $(mouseData.element).off("CornerstoneToolsMouseDrag", mouseDragCallback);
        $(mouseData.element).off("CornerstoneToolsMouseUp", mouseUpCallback);
    }

    function mouseDownCallback(e)
    {
        var mouseData = e.originalEvent.detail;
        if(cornerstoneTools.isMouseButtonEnabled(mouseData.which, e.data.mouseButtonMask)) {

            var eventData = {
                deltaY : 0
            };
            $(mouseData.element).on("CornerstoneToolsMouseDrag", eventData, mouseDragCallback);
            $(mouseData.element).on("CornerstoneToolsMouseUp", mouseUpCallback);
            return false; // false = cases jquery to preventDefault() and stopPropagation() this event
        }
    }

    function mouseDragCallback(e)
    {
        var mouseMoveData = e.originalEvent.detail;
        var eventData = e.data;
        eventData.deltaY += mouseMoveData.deltaPoints.page.y;

        var toolData = cornerstoneTools.getToolState(mouseMoveData.element, 'stack');
        if(toolData === undefined || toolData.data === undefined || toolData.data.length === 0) {
            return;
        }

        var stackData = toolData.data[0];
        if(eventData.deltaY >=3 || eventData.deltaY <= -3)
        {
            var imageDelta = eventData.deltaY / 3;
            var imageDeltaMod = eventData.deltaY % 3;
            var imageIdIndexOffset = Math.round(imageDelta);
            eventData.deltaY = imageDeltaMod;

            var imageIdIndex = stackData.currentImageIdIndex + imageIdIndexOffset;
            imageIdIndex = Math.min(stackData.imageIds.length - 1, imageIdIndex);
            imageIdIndex = Math.max(0, imageIdIndex);
            if(imageIdIndex !== stackData.currentImageIdIndex)
            {
                stackData.currentImageIdIndex = imageIdIndex;
                var viewport = cornerstone.getViewport(mouseMoveData.element);
                cornerstone.loadAndCacheImage(stackData.imageIds[imageIdIndex]).then(function(image) {
                    cornerstone.displayImage(mouseMoveData.element, image, viewport);
                });
            }

        }

        return false; // false = cases jquery to preventDefault() and stopPropagation() this event
    }

    function mouseWheelCallback(e)
    {
        var mouseWheelData = e.originalEvent.detail;
        var images = -mouseWheelData.direction;
        scroll(mouseWheelData.element, images);
    }

    function onDrag(e) {
        var mouseMoveData = e.originalEvent.detail;
        var eventData = {
            deltaY : 0
        };
        eventData.deltaY += mouseMoveData.deltaPoints.page.y;

        var toolData = cornerstoneTools.getToolState(mouseMoveData.element, 'stack');
        if(toolData === undefined || toolData.data === undefined || toolData.data.length === 0) {
            return;
        }

        var stackData = toolData.data[0];
        if(eventData.deltaY >=3 || eventData.deltaY <= -3)
        {
            var imageDelta = eventData.deltaY / 3;
            var imageDeltaMod = eventData.deltaY % 3;
            var imageIdIndexOffset = Math.round(imageDelta);
            eventData.deltaY = imageDeltaMod;

            var imageIdIndex = stackData.currentImageIdIndex + imageIdIndexOffset;
            imageIdIndex = Math.min(stackData.imageIds.length - 1, imageIdIndex);
            imageIdIndex = Math.max(0, imageIdIndex);
            if(imageIdIndex !== stackData.currentImageIdIndex)
            {
                stackData.currentImageIdIndex = imageIdIndex;
                var viewport = cornerstone.getViewport(mouseMoveData.element);
                cornerstone.loadAndCacheImage(stackData.imageIds[imageIdIndex]).then(function(image) {
                    cornerstone.displayImage(mouseMoveData.element, image, viewport);
                });
            }

        }

        return false; // false = cases jquery to preventDefault() and stopPropagation() this event
    }


    // module/private exports
    cornerstoneTools.stackScroll = cornerstoneTools.simpleMouseButtonTool(mouseDownCallback);
    cornerstoneTools.stackScrollWheel = cornerstoneTools.mouseWheelTool(mouseWheelCallback);
    cornerstoneTools.stackScrollTouchDrag = cornerstoneTools.touchDragTool(onDrag);

    return cornerstoneTools;
}($, cornerstone, cornerstoneTools));