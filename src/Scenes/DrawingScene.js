import "../stylesheets/styles.css";
import "../stylesheets/button.css";

import { useEffect, useRef, useState } from "react";
import { prePathUrl } from "../components/CommonFunctions";
import Phaser from "phaser"
import BaseImage from "../components/BaseImage";
import { Player } from '@lottiefiles/react-lottie-player';
import { returnSoundPath } from "../utils/loadSound";

import {
    highlightPreList, basePreList, showingLayoutList, maskInfoList,
    animtionList, letterPosList, outLinePreList, lineLengthList,
    HeavyLengthList, firstPosList, movePath, brushColorList, notJudgeBackList, sparkPosLeft
} from "../components/CommonVariants"

import { setRepeatAudio, startRepeatAudio, stopRepeatAudio, isRepeating } from "../components/CommonFunctions";

const firstPos = { x: 380, y: 255 }
var repeatStep = 0;
//state variants
var movingImage
let stepCount = 0;
//gameObjects
var highlightGame
var drawingGame

// drawing variants

let isFirst = true;
var curves = [];
var curve = null;

var subCurves = [];
var subCurve = null;

// lemming varients
var graphics
var subGraphics

var nearestStepNum = 0;
var circleObj
var yOutLine, wOutLine
var highlightList = []
var highCurrentNum = 0;

var currentImgNumOriginal = 0;
var currentLingLength = 40


var isExlaining = false;
var timerList = []

var rememberX = 0;
var rememberIsLeft = false;

var geometryInfo

let scaleInterval, scaleTimer, repeatInterval
let isTracingStarted = false;

export default function Scene({ nextFunc, _geo,
    currentSceneNumber, startTransition, audioList
}) {

    const letterNum = currentSceneNumber;

    const wordVoiceList = [audioList.wordAudio1, audioList.wordAudio2, audioList.wordAudio3]

    const parentObject = useRef()
    const drawingPanel = useRef();
    const showingImg = useRef();
    const animationRef = useRef();
    const playerRef = useRef();
    const markParentRef = useRef();

    const sparkBaseRef = useRef();
    const sparkRefList = [useRef(), useRef(), useRef()]

    const markRefList = [useRef(), useRef(), useRef()]
    const reviewImgList = [useRef(), useRef(), useRef()]
    const markBaseList = [useRef(), useRef(), useRef()]
    const showingHighImgList = [useRef(), useRef(), useRef()]
    const showingOriginImgList = [useRef(), useRef(), useRef()]

    const [rendering, setRendering] = useState(0)

    const drawingGaameconfig = {
        type: Phaser.FOREVER,
        width: 1280,
        height: 720,
        parent: 'DrawingDiv',
        transparent: true,
        physics: {
            default: 'matter',
            matter: {
                gravity: {
                    y: 0.8
                },
                enableSleep: true,
                debug: false
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update

        }
    };

    const highlightGameConfig = {
        type: Phaser.AUTO,
        width: 1280,
        height: 720,
        transparent: true,
        parent: 'highlightDiv',
        scene: {
            preload: highlight_preload,
            create: highlight_create,
        }
    };

    const explainVoices = [
        '06', '20', '23', '23', '27'
    ]


    const clapVoices = [
        '21', '21', '26'
    ]


    let currentPath = movePath[letterNum][stepCount]

    geometryInfo = _geo

    useEffect(() => {

        drawingPanel.current.className = 'hideObject'
        markParentRef.current.className = 'hideObject'
        // animationRef.current.className = 'hideObject'

        //1-explain
        //2-clap
        //3-word

        audioList.bodyAudio1.src = returnSoundPath('SB_04_Audio_' + explainVoices[0])
        audioList.bodyAudio2.src = returnSoundPath('SB_04_Audio_' + clapVoices[0])

        highlightGame = new Phaser.Game(highlightGameConfig)

        setTimeout(() => {
            drawingGame = new Phaser.Game(drawingGaameconfig);
        }, 500);

        setTimeout(() => {
            audioList.bodyAudio1.play().catch(error => { });
            setTimeout(() => {
                playerRef.current.play();
                audioList.bodyAudio1.src = returnSoundPath('SB_04_Audio_' + explainVoices[1])
            }, audioList.bodyAudio1.duration * 1000 + 300);
        }, 2000);

        parentObject.current.className = 'aniObject'
        currentLingLength = lineLengthList[letterNum]

        setRepeatAudio(audioList.bodyAudio1)

        ///////
        // showingDrawingPanel();
        // reviewFunc()




        return () => {
            currentImgNumOriginal = 0;
            repeatStep = 0;
            stepCount = 0;
            nearestStepNum = 0;
            highCurrentNum = 0;
            currentImgNumOriginal = 0;

            isFirst = true;

            highlightGame.destroy(true)
            drawingGame.destroy(true)

            highlightGame = null
            drawingGame = null

            curve = null;
            curves = [];

            subCurves = [];
            subCurve = null;


            highlightList = []
            isExlaining = false;

            graphics = null
            subGraphics = null

            stopRepeatAudio();
        }
    }, [])


    const showingDrawingPanel = () => {

        setTimeout(() => {

            setTimeout(() => {
                drawingPanel.current.className = 'showObject'
                markParentRef.current.className = 'showObject'
                animationRef.current.className = 'hideObject'
            }, 300);

            isTracingStarted = true;
            timerList[7] = setTimeout(() => {

                audioList.letterAudio.play();
                isExlaining = true;
                timerList[8] = setTimeout(() => {
                    audioList.bodyAudio1.play();

                    playScaleFunc()

                    startRepeatAudio();
                    startRepeatScaleFunc()
                    isExlaining = false;

                }, 1000);
            }, 1000);

            startTransition(1)
        }, 500);

    }

    function reviewFunc() {
        stopRepeatAudio()
        audioList.bodyAudio1.src = returnSoundPath("SB_04_Audio_" + explainVoices[4])

        if (letterNum < 12) {
            let param = 0

            startTransition(2)
            setTimeout(() => {
                drawingPanel.current.className = 'hideObject'
            }, 300);

            setTimeout(() => {
                markBaseList.map((markBase, value) => {
                    if (markBase.current != null)
                        setTimeout(() => {
                            markBase.current.style.transition = '1s'
                            markBase.current.style.transform = 'translate(' +
                                (geometryInfo.width * (-0.115 - 0.225 * (2 - value) + param) - geometryInfo.left) + 'px,' +
                                (geometryInfo.height * (0.35) + geometryInfo.top)
                                + 'px) rotateZ(-360deg) scale(2)'


                            sparkBaseRef.current.style.left =
                                (geometryInfo.left + geometryInfo.width * (0.15 + sparkPosLeft[letterNum][value])) + 'px'

                            setTimeout(() => {
                                wordVoiceList[value].play()
                                if (value == 2) {
                                    setTimeout(() => {
                                        subReviewFunc()
                                    }, wordVoiceList[value].duration * 1000 + 500);
                                }
                            }, 1500);

                            reviewImgList[value].current.style.transform = 'scale(1.15)'
                            reviewImgList[value].current.style.transition = '0.5s'
                            setTimeout(() => {
                                markBase.current.className = 'disapear'
                                reviewImgList[value].current.className = 'appear'
                                let showIndex = 0;

                                audioList.audioSuccess.currentTime = 0;
                                audioList.audioSuccess.play();

                                sparkRefList[showIndex].current.setClass('showObject')
                                let showInterval = setInterval(() => {
                                    sparkRefList[showIndex].current.setClass('hideObject')
                                    if (showIndex < 2) {
                                        showIndex++
                                        sparkRefList[showIndex].current.setClass('showObject')
                                    }
                                    else {
                                        clearInterval(showInterval)
                                    }
                                }, 200);

                                setTimeout(() => {
                                    reviewImgList[value].current.style.transform = 'scale(1)'

                                    setTimeout(() => {
                                        // showingHighImgList[value].current.setClass('disappear')
                                        // showingOriginImgList[value].current.setClass('appear')
                                    }, 400);

                                }, 4000);
                            }, 600);

                        }, 6000 * value);
                })
            }, 1500);
        }
        else {
            drawingPanel.current.className = 'disapear'
            setTimeout(() => {
                nextFunc()
            }, 500);
        }
    }

    function subReviewFunc() {
        audioList.bodyAudio1.play();
        setTimeout(() => {
            reviewImgList.map((value, index) => {
                if (value.current != null)
                    setTimeout(() => {
                        // showingOriginImgList[index].current.setClass('appear')
                        // showingHighImgList[index].current.setClass('appear')

                        value.current.style.transition = '1.2s'
                        setTimeout(() => {
                            audioList.selfLetterAudio.play();
                        }, 1000);
                        setTimeout(() => {
                            // wordVoiceList[index].play();
                            value.current.style.transform = 'scale(1.15)'
                            setTimeout(() => {
                                value.current.style.transform = 'scale(1)'

                                setTimeout(() => {
                                    // showingOriginImgList[index].current.setClass('appear')
                                    // showingHighImgList[index].current.setClass('disappear')
                                    if (index == 2) {
                                        setTimeout(() => {
                                            parentObject.current.style.transition = '0.5s'
                                            parentObject.current.style.opacity = '0.0'
                                            setTimeout(() => {
                                                nextFunc()
                                            }, 500);
                                        }, 1000);

                                    }

                                }, 1000);
                            }, 4000);
                        }, 2000);
                    }, 7000 * index);
            })
        }, audioList.bodyAudio1.duration * 1000 + 500);
    }

    function preload() {
        this.load.image('letterBase', prePathUrl() + 'images/' + basePreList[letterNum] + '.svg');
        letterPosList[letterNum].highlight.map((item, index) => {
            this.load.image('letterHighlight' + (index + 1), prePathUrl() + 'images/SB_04_Text_interactive_02/' + highlightPreList[letterNum]
                + (index + 1) + '.svg');
        })
    }

    function repeatScaleFunc() {
        repeatInterval = setInterval(() => {
            playScaleFunc()
        }, 10000);
    }

    function playScaleFunc() {
        clearInterval(scaleInterval)

        let value = 1
        let isIncrease = true
        scaleInterval = setInterval(() => {

            if (isIncrease)
                value += 0.01
            else
                value -= 0.01

            if (value >= 1.1)
                isIncrease = false;
            if (value <= 1)
                isIncrease = true

            movingImage.setScale(value)
        }, 50);
    }

    function startRepeatScaleFunc(delay = 5000) {
        scaleTimer = setTimeout(() => {
            repeatScaleFunc()
        }, delay);
    }

    function stopScaleFunc() {
        clearTimeout(scaleTimer)
        clearInterval(scaleInterval)
        clearInterval(repeatInterval)

        movingImage.setScale(1)
    }


    let posList = []
    var path
    function create() {
        this.add.image(letterPosList[letterNum].base.x, letterPosList[letterNum].base.y, 'letterBase')

        graphics = this.add.graphics();
        subGraphics = this.add.graphics();

        letterPosList[letterNum].highlight.map((item, index) => {
            highlightList[index] = this.add.image(item.x, item.y, 'letterHighlight' + (index + 1))
        })
        highlightList.map((highlight, index) => {
            if (index > 0)
                highlight.visible = false
        })

        curve = new Phaser.Curves.Spline([firstPosList[letterNum][0].x, firstPosList[letterNum][0].y]);
        subCurve = new Phaser.Curves.Spline([currentPath[0].x, currentPath[0].y]);

        circleObj = this.add.circle(movePath[letterNum][0][0].x, movePath[letterNum][0][0].y, 55, 0xffffdd, 0.0)

        rememberX = movePath[letterNum][0][0].x;

        circleObj.setInteractive({ cursor: 'grab' })

        let isMoving = false;

        circleObj.on('pointerover', function () {

            setTimeout(() => {
                if (isTracingStarted && isRepeating()) {
                    stopRepeatAudio()
                    stopScaleFunc()
                }
            }, 10);

        });

        circleObj.on('pointerout', function () {

            setTimeout(() => {
                if (isTracingStarted && !isRepeating()) {
                    startRepeatAudio()
                    startRepeatScaleFunc()
                }
            }, 10);


        });

        circleObj.on('pointerup', function () {

            setTimeout(() => {
                if (isTracingStarted) {
                    startRepeatAudio();
                    startRepeatScaleFunc();
                }
            }, 10);


        });

        circleObj.on('pointerdown', function (pointer) {
            if (isExlaining) {

                clearTimeout(timerList[7])
                clearTimeout(timerList[8])

                audioList.bodyAudio1.pause();
                audioList.bodyAudio1.currentTime = 0;

                audioList.letterAudio.pause();
                audioList.letterAudio.currentTime = 0;

                timerList.map(timer => {
                    clearTimeout(timer)
                })

                isExlaining = false;
            }

            if (isTracingStarted && isRepeating()) {
                stopScaleFunc()
                stopRepeatAudio()
            }

            if (!isMoving && isTracingStarted) {
                circleObj.on('pointermove', moveFunc, this);
                // if (!isFirst) {
                //     curve = new Phaser.Curves.Spline([pointer.x, pointer.y]);
                //     isFirst = !isFirst
                // }
                curves.push(curve);
                subCurves.push(subCurve);

                isMoving = true;
            }

            if (firstPosList[letterNum][stepCount].p != null && firstPosList[letterNum][stepCount].p == true) {

                isMoving = false;
                isTracingStarted = false;

                nearestStepNum = 0;
                curve.addPoint(firstPosList[letterNum][stepCount].x, firstPosList[letterNum][stepCount].y);
                currentPath.map(path => {
                    curve.addPoint(path.x, path.y);
                })
                graphics.lineStyle(100, brushColorList[repeatStep]);

                if (stepCount == movePath[letterNum].length - 1) {

                    yOutLine.visible = true
                    graphics.lineStyle(100, brushColorList[repeatStep]);

                    highlightList[highlightList.length - 1].visible = false
                    let showingTime = 2000

                    if (letterNum < 12) {
                        showingImg.current.className = 'appear'

                        setTimeout(() => {
                            showingImg.current.style.transform = 'scale(1.1)'
                            setTimeout(() => {
                                showingImg.current.className = 'disapear'
                                showingImg.current.style.transform = 'scale(1)'
                            }, 4000);
                            wordVoiceList[repeatStep].play()
                        }, 3000);
                        showingTime = 6000
                    }

                    // alert('finished')
                    circleObj.y = 10000;
                    movingImage.y = 10000

                    curves.forEach(function (c) {
                        c.draw(graphics, 100);
                    });

                    markRefList[repeatStep].current.setUrl('SB_04_Progress bar/SB_04_progress bar_03.svg')


                    audioList.audioSuccess.play();
                    setTimeout(() => {
                        if (repeatStep == 2)
                            audioList.bodyAudio2.play();
                    }, 1000);
                    audioList.bodyAudio1.src = returnSoundPath("SB_04_Audio_" + explainVoices[repeatStep + 2])

                    setTimeout(() => {
                        audioList.bodyAudio2.src = returnSoundPath("SB_04_Audio_" + clapVoices[repeatStep + 1])

                        setTimeout(() => {
                            isExlaining = false;
                            if (repeatStep < 2) {

                                timerList[0] = setTimeout(() => {
                                    isExlaining = true;
                                    audioList.letterAudio.play();
                                    timerList[1] = setTimeout(() => {

                                        playScaleFunc()

                                        startRepeatAudio()
                                        startRepeatScaleFunc()

                                        timerList[2] = setTimeout(() => {
                                            isExlaining = false;
                                        }, audioList.bodyAudio1.duration * 1000);
                                    }, 1000);
                                }, 1000);

                                currentImgNumOriginal++
                                setRendering(currentImgNumOriginal);

                                yOutLine.visible = false

                                highlightList.map((highlight, index) => {
                                    if (index > 0)
                                        highlight.visible = false
                                    else
                                        highlight.visible = true
                                })

                                // fomart values....

                                highCurrentNum = 0
                                currentLingLength = lineLengthList[letterNum]
                                stepCount = 0;
                                currentPath = movePath[letterNum][stepCount]

                                repeatStep++;
                                isFirst = true;
                                nearestStepNum = 0;
                                let optimizedPosition = movePath[letterNum][0][0]
                                //.............

                                circleObj.x = optimizedPosition.x;
                                circleObj.y = optimizedPosition.y;

                                movingImage.x = optimizedPosition.x;
                                movingImage.y = optimizedPosition.y


                                graphics.clear();
                                subGraphics.clear();

                                curve = new Phaser.Curves.Spline([firstPosList[letterNum][0].x, firstPosList[letterNum][0].y]);
                                curves = []


                                subCurve = new Phaser.Curves.Spline([currentPath[0].x, currentPath[0].y]);
                                subCurves = []

                                isTracingStarted = true;

                            }
                            else {
                                reviewFunc();
                            }
                        }, showingTime);

                    }, 3000);

                }
                else {

                    curves.forEach(function (c) {
                        c.draw(graphics, 100);
                    });


                    circleObj.off('pointermove', moveFunc, this);

                    stepCount++
                    currentPath = movePath[letterNum][stepCount]

                    isTracingStarted = false;
                    if (firstPosList[letterNum][stepCount].letter_start) {
                        audioList.audioTing.currentTime = 0
                        audioList.audioTing.play()
                    }

                    setTimeout(() => {

                        circleObj.x = movePath[letterNum][stepCount][0].x;
                        circleObj.y = movePath[letterNum][stepCount][0].y;

                        movingImage.x = movePath[letterNum][stepCount][0].x;
                        movingImage.y = movePath[letterNum][stepCount][0].y;

                        if (firstPosList[letterNum][stepCount].letter_start) {
                            highlightList[highCurrentNum].visible = false

                            highCurrentNum++

                            highlightList[highCurrentNum].visible = true
                        }

                        curve = new Phaser.Curves.Spline([firstPosList[letterNum][stepCount].x, firstPosList[letterNum][stepCount].y]);
                        curves = []

                        HeavyLengthList.map(value => {
                            if (value[0] == letterNum && value[1] == stepCount) {
                                currentLingLength = 90
                            }
                        })
                        curve.addPoint(circleObj.x, circleObj.y);

                        isTracingStarted = true;

                        startRepeatAudio()
                        startRepeatScaleFunc()

                    }, 750);
                }
            }
        }, this);


        circleObj.on('pointermove', moveFunc, this);

        function moveFunc(pointer) {
            if (pointer.isDown && isMoving && isTracingStarted) {
                if (isExlaining) {

                    clearTimeout(timerList[7])
                    clearTimeout(timerList[8])

                    audioList.bodyAudio1.pause();
                    audioList.bodyAudio1.currentTime = 0;

                    audioList.letterAudio.pause();
                    audioList.letterAudio.currentTime = 0;

                    timerList.map(timer => {
                        clearTimeout(timer)
                    })

                    isExlaining = false;
                }

                var x = (pointer.x.toFixed(2));
                var y = (pointer.y.toFixed(2));

                let minDistance = 1000;
                let currentMinDisIndex = nearestStepNum;
                let lastIndex = nearestStepNum + 2;
                if (lastIndex > currentPath.length)
                    lastIndex = currentPath.length

                for (let i = nearestStepNum; i < lastIndex; i++) {
                    if (minDistance > Phaser.Math.Distance.Between(x, y, currentPath[i].x, currentPath[i].y)) {
                        minDistance = Phaser.Math.Distance.Between(x, y, currentPath[i].x, currentPath[i].y)
                        currentMinDisIndex = i;
                    }
                }

                let nextIndex;
                if (currentMinDisIndex == 0)
                    nextIndex = 1;

                else if (currentMinDisIndex == currentPath.length - 1)
                    nextIndex = currentMinDisIndex - 1;

                else {
                    if (Phaser.Math.Distance.Between(x, y, currentPath[currentMinDisIndex + 1].x, currentPath[currentMinDisIndex + 1].y) >
                        Phaser.Math.Distance.Between(x, y, currentPath[currentMinDisIndex - 1].x, currentPath[currentMinDisIndex - 1].y))
                        nextIndex = currentMinDisIndex - 1;
                    else
                        nextIndex = currentMinDisIndex + 1;
                }

                if (currentMinDisIndex >= nearestStepNum && currentMinDisIndex - nearestStepNum <= 1) {

                    let fromIndex = currentPath[currentMinDisIndex].x > currentPath[nextIndex].x ? nextIndex : currentMinDisIndex
                    let toIndex = currentPath[currentMinDisIndex].x > currentPath[nextIndex].x ? currentMinDisIndex : nextIndex

                    let x1 = currentPath[fromIndex].x
                    let x2 = currentPath[toIndex].x
                    let y1 = currentPath[fromIndex].y
                    let y2 = currentPath[toIndex].y

                    let optimizedPosition = currentPath[currentMinDisIndex]
                    minDistance = 1000

                    let isDrawable1 = false;
                    let isDrawable2 = false;


                    if (x1 != x2)
                        for (let i = 0; i < Math.abs(currentPath[fromIndex].x
                            - currentPath[toIndex].x) / 0.1; i += 0.1) {
                            let currentXPos = x1 + i;
                            let currentYPos = y1 + (y2 - y1) / (x2 - x1) * (currentXPos - x1)

                            if (minDistance > Phaser.Math.Distance.Between(x, y, currentXPos, currentYPos)) {
                                minDistance = Phaser.Math.Distance.Between(x, y, currentXPos, currentYPos)
                                optimizedPosition = { x: currentXPos, y: currentYPos }
                            }
                        }

                    else {
                        let addY = y2 > y1 ? y1 : y2;
                        for (let i = 0; i < Math.abs(y1 - y2) / 0.1; i += 0.1) {
                            let currentXPos = x1;
                            let currentYPos = addY + i

                            if (minDistance > Phaser.Math.Distance.Between(x, y, currentXPos, currentYPos)) {
                                minDistance = Phaser.Math.Distance.Between(x, y, currentXPos, currentYPos)
                                optimizedPosition = { x: currentXPos, y: currentYPos }
                            }
                        }

                    }

                    if (x1 > x2 && optimizedPosition.x >= x2
                        && optimizedPosition.x <= x1)
                        isDrawable1 = true;

                    if (x1 <= x2 && optimizedPosition.x <= x2 && optimizedPosition.x >= x1)
                        isDrawable1 = true;

                    if (y1 > y2 && optimizedPosition.y >= y2
                        && optimizedPosition.y <= y1)
                        isDrawable2 = true;

                    if (y1 <= y2 && optimizedPosition.y <= y2 && optimizedPosition.y >= y1)
                        isDrawable2 = true;

                    if (isDrawable1 && isDrawable2) {
                        if (currentMinDisIndex >= nearestStepNum) {

                            if (minDistance < 50) {

                                if (nearestStepNum != currentMinDisIndex && currentMinDisIndex > 0) {
                                    subGraphics.lineStyle(currentLingLength, brushColorList[repeatStep]);

                                    subCurve.addPoint(
                                        currentPath[currentMinDisIndex - 1].x,
                                        currentPath[currentMinDisIndex - 1].y
                                    )

                                    subCurves.forEach(function (c) {
                                        c.draw(subGraphics, currentLingLength);
                                    });
                                }


                                x = optimizedPosition.x
                                y = optimizedPosition.y

                                let isPassable = false;

                                // for (let i = 0; i < notJudgeBackList.length; i++) {
                                //     let item = notJudgeBackList[i]
                                //     if (item[0] == letterNum && item[1] == stepCount) {
                                //         isPassable = true;
                                //         break;
                                //     }
                                // }
                                if (currentPath.length == 2)
                                    isPassable = true;

                                let fIndex = nearestStepNum > nextIndex ? nextIndex : nearestStepNum
                                let tIndex = nearestStepNum > nextIndex ? nearestStepNum : nextIndex

                                if (currentPath.length > 2 &&
                                    !notJudgeBackList.includes([letterNum, stepCount]) &&
                                    currentPath[fIndex] != null && !isPassable
                                    && currentPath[tIndex] != null) {

                                    if (currentPath[fIndex].x < currentPath[tIndex].x)
                                        rememberIsLeft = false
                                    else if (currentPath[fIndex].x > currentPath[tIndex].x)
                                        rememberIsLeft = true

                                    if ((x > rememberX && !rememberIsLeft) ||
                                        currentPath[fIndex].x == currentPath[tIndex].x
                                        || (x < rememberX && rememberIsLeft))
                                        isPassable = true;
                                }

                                if (isPassable) {
                                    rememberX = x;

                                    nearestStepNum = currentMinDisIndex

                                    let compDistance = Phaser.Math.Distance.Between(x, y, currentPath[currentPath.length - 1].x,
                                        currentPath[currentPath.length - 1].y)

                                    if (compDistance < 40 && currentMinDisIndex == currentPath.length - 1) {
                                        isMoving = false;
                                        isTracingStarted = false;
                                        x = currentPath[currentPath.length - 1].x
                                        y = currentPath[currentPath.length - 1].y

                                        nearestStepNum = 0;
                                        curve.addPoint(x, y);

                                        stopScaleFunc()
                                        stopRepeatAudio()

                                        if (stepCount == movePath[letterNum].length - 1) {

                                            yOutLine.visible = true
                                            graphics.lineStyle(100, brushColorList[repeatStep]);

                                            highlightList[highlightList.length - 1].visible = false


                                            let showingTime = 2000

                                            if (letterNum < 12) {
                                                showingImg.current.className = 'appear'

                                                setTimeout(() => {
                                                    showingImg.current.style.transform = 'scale(1.1)'
                                                    setTimeout(() => {
                                                        showingImg.current.className = 'disapear'
                                                        showingImg.current.style.transform = 'scale(1)'
                                                    }, 4000);
                                                    wordVoiceList[repeatStep].play();
                                                }, 3000);
                                                showingTime = 6000
                                            }

                                            // alert('finished')
                                            circleObj.y = 10000;
                                            movingImage.y = 10000

                                            curves.forEach(function (c) {
                                                c.draw(graphics, 100);
                                            });
                                            subCurves.forEach(function (c) {
                                                c.draw(subGraphics, 100);
                                            });

                                            markRefList[repeatStep].current.setUrl('SB_04_Progress bar/SB_04_progress bar_03.svg')


                                            audioList.audioSuccess.play();
                                            setTimeout(() => {
                                                if (repeatStep == 2)
                                                    audioList.bodyAudio2.play();
                                            }, 1000);

                                            audioList.bodyAudio1.src = returnSoundPath("SB_04_Audio_" + explainVoices[repeatStep + 2])

                                            setTimeout(() => {
                                                audioList.bodyAudio2.src = returnSoundPath("SB_04_Audio_" + clapVoices[repeatStep + 1])
                                                setTimeout(() => {
                                                    isExlaining = false;
                                                    if (repeatStep < 2) {
                                                        timerList[0] = setTimeout(() => {
                                                            isExlaining = true;
                                                            audioList.letterAudio.play();
                                                            timerList[1] = setTimeout(() => {
                                                                audioList.bodyAudio1.play();
                                                                playScaleFunc()

                                                                timerList[2] = setTimeout(() => {
                                                                    isExlaining = false;
                                                                }, audioList.bodyAudio1.duration * 1000);
                                                            }, 1000);
                                                        }, 1000);

                                                        startRepeatAudio()
                                                        startRepeatScaleFunc()

                                                        currentImgNumOriginal++
                                                        setRendering(currentImgNumOriginal);

                                                        yOutLine.visible = false

                                                        highlightList.map((highlight, index) => {
                                                            if (index > 0)
                                                                highlight.visible = false
                                                            else
                                                                highlight.visible = true
                                                        })

                                                        // fomart values....

                                                        highCurrentNum = 0
                                                        currentLingLength = lineLengthList[letterNum]
                                                        stepCount = 0;
                                                        repeatStep++;
                                                        isFirst = true;
                                                        nearestStepNum = 0;
                                                        optimizedPosition = movePath[letterNum][0][0]
                                                        //.............

                                                        currentPath = movePath[letterNum][0]

                                                        circleObj.x = optimizedPosition.x;
                                                        circleObj.y = optimizedPosition.y;

                                                        movingImage.x = optimizedPosition.x;
                                                        movingImage.y = optimizedPosition.y

                                                        rememberX = currentPath[0].x

                                                        graphics.clear();
                                                        subGraphics.clear();

                                                        curve = new Phaser.Curves.Spline([firstPosList[letterNum][0].x, firstPosList[letterNum][0].y]);
                                                        curves = []


                                                        subCurve = new Phaser.Curves.Spline([currentPath[0].x, currentPath[0].y]);
                                                        subCurves = []

                                                        isTracingStarted = true;
                                                    }
                                                    else {
                                                        reviewFunc();
                                                    }

                                                }, showingTime);
                                            }, 3000);
                                        }
                                        else {

                                            curves.forEach(function (c) {
                                                c.draw(graphics, 100);
                                            });


                                            subCurves.forEach(function (c) {
                                                c.draw(subGraphics, 100);
                                            });

                                            circleObj.off('pointermove', moveFunc, this);
                                            parentObject.current.style.pointerEvents = 'none'

                                            circleObj.x = x;
                                            circleObj.y = y;

                                            movingImage.x = x;
                                            movingImage.y = y;


                                            stepCount++
                                            let timeDuration = 0
                                            if (firstPosList[letterNum][stepCount].letter_start) {
                                                timeDuration = 750
                                                audioList.audioTing.currentTime = 0
                                                audioList.audioTing.play();
                                            }

                                            setTimeout(() => {

                                                currentPath = movePath[letterNum][stepCount]

                                                setTimeout(() => {
                                                    rememberX = currentPath[0].x

                                                    if (firstPosList[letterNum][stepCount].letter_start) {
                                                        highlightList[highCurrentNum].visible = false

                                                        highCurrentNum++

                                                        highlightList[highCurrentNum].visible = true
                                                    }

                                                    circleObj.x = movePath[letterNum][stepCount][0].x;
                                                    circleObj.y = movePath[letterNum][stepCount][0].y;

                                                    movingImage.x = movePath[letterNum][stepCount][0].x;
                                                    movingImage.y = movePath[letterNum][stepCount][0].y;

                                                    curve = new Phaser.Curves.Spline([firstPosList[letterNum][stepCount].x, firstPosList[letterNum][stepCount].y]);
                                                    curves = []

                                                    subCurve = new Phaser.Curves.Spline([currentPath[0].x, currentPath[0].y]);
                                                    subCurves = []

                                                    curve.addPoint(circleObj.x, circleObj.y);

                                                    HeavyLengthList.map(value => {
                                                        if (value[0] == letterNum && value[1] == stepCount) {
                                                            currentLingLength = 90
                                                        }
                                                    })
                                                    parentObject.current.style.pointerEvents = ''
                                                    circleObj.on('pointermove', moveFunc, this);

                                                    isTracingStarted = true;

                                                    startRepeatAudio()
                                                    startRepeatScaleFunc()

                                                }, 200);
                                            }, timeDuration);
                                        }
                                    }

                                    else {

                                        if (currentPath[currentMinDisIndex].w != null)
                                            currentLingLength = currentPath[currentMinDisIndex].w

                                        graphics.lineStyle(currentLingLength, brushColorList[repeatStep]);
                                        curve.addPoint(x, y);

                                        curves.forEach(function (c) {
                                            c.draw(graphics, 100);
                                        });

                                        circleObj.x = optimizedPosition.x;
                                        circleObj.y = optimizedPosition.y;

                                        movingImage.x = optimizedPosition.x;
                                        movingImage.y = optimizedPosition.y

                                    }
                                }

                            }
                        }


                    }
                }
            }
        }


        // var fs = this.add.circle(firstPos.x, firstPos.y, 3, 0x000000, 0.5)
        path = new Phaser.Curves.Path(firstPos.x, firstPos.y);

        this.input.on('pointerdown1', function (pointer) {

            posList.push({ x: pointer.x, y: pointer.y })

            posList.map(pos => {
                path.lineTo(pos.x, pos.y);
            })

            console.log('{x:' + pointer.x.toFixed(0) + ', y:' + pointer.y.toFixed(0) + '},')
            // graphics.clear()

            posList = []



            graphics.lineStyle(2, 0x000000, 1);
            path.draw(graphics);
            graphics.fillStyle(0x000000, 1);

            path = new Phaser.Curves.Path(pointer.x, pointer.y);

        }, this);
    }


    function update() {

    }

    // highlight game

    function highlight_preload() {
        this.load.image('foot', prePathUrl() + 'images/SB_04_Icon/SB_04_icon.svg');
        this.load.image('yOutLine', prePathUrl() + 'images/SB_04_Text_interactive_02/' + outLinePreList[letterNum].yellow + '.svg');
        this.load.image('wOutLine', prePathUrl() + 'images/SB_04_Text_interactive_02/' + outLinePreList[letterNum].white + '.svg');
    }

    function highlight_create() {
        wOutLine = this.add.image(letterPosList[letterNum].base.x, letterPosList[letterNum].base.y, 'wOutLine')
        yOutLine = this.add.image(letterPosList[letterNum].base.x, letterPosList[letterNum].base.y, 'yOutLine')

        yOutLine.visible = false

        movingImage = this.add.image(movePath[letterNum][0][0].x, movePath[letterNum][0][0].y, 'foot');
        movingImage.setScale(0.9)

        if (letterNum == 3) {
            wOutLine.setScale(0.997)
            yOutLine.setScale(0.997)
        }

        // movingImage.visible = false;
    }

    return (
        <div
            className="hideObject"
            ref={parentObject}
        >
            {/* <BaseImage
                    scale={0.05}
                    posInfo={{ r: 0.03 + 0.075, t: 0.05 }}
                    url="SB_04_hand_tool/hand.svg"
                /> */}

            <div
                ref={showingImg}
                className='hideObject'
                style={{
                    position: 'fixed', width: _geo.width * 0.18 + 'px',
                    height: _geo.height * 0.18 + 'px',
                    right: _geo.left + _geo.width * 0.08 + 'px',
                    bottom: _geo.top + _geo.height * 0.15 + 'px',
                    pointerEvents: 'none',
                    transform: 'scale(1)'
                }}>
                <BaseImage
                    scale={showingLayoutList[letterNum][currentImgNumOriginal].s}
                    posInfo={{ b: 1, r: showingLayoutList[letterNum][currentImgNumOriginal].r }}
                    url={"SB_04_BG_PI/" + showingLayoutList[letterNum][currentImgNumOriginal].wPath + ".svg"}
                />
                <BaseImage
                    posInfo={{ r: 0.02, b: 0.3 }}
                    url={"SB_04_Text_interactive_01/" + showingLayoutList[letterNum][currentImgNumOriginal].tPath + ".svg"}
                />
            </div>
            <div
                ref={animationRef}
            >
                <Player
                    ref={playerRef}
                    onEvent={(e) => {
                        if (e == 'complete')
                            showingDrawingPanel();
                    }}
                    keepLastFrame={true}
                    speed={0.8}

                    src={prePathUrl() + 'lottieFiles/main/' + animtionList[letterNum].path + '.json'}
                    style={{
                        position: 'fixed',
                        width: _geo.width * animtionList[letterNum].scale,
                        left: _geo.left + _geo.width * animtionList[letterNum].left,
                        top: _geo.top + _geo.height * animtionList[letterNum].top,
                        pointerEvents: 'none',
                        overflow: 'visible'
                    }}
                >
                    {/* <Controls visible={false} buttons={['play', 'frame', 'debug']} /> */}
                </Player>
            </div>


            {

                [0, 1, 2].map(value =>
                    <div
                        key={value}
                        ref={reviewImgList[value]}
                        className='hideObject'
                        style={{
                            position: 'fixed', width: _geo.width * 0.2 + 'px',
                            height: _geo.height * 0.18 + 'px',
                            left: _geo.left + _geo.width * (0.1 + 0.3 * value) + 'px',
                            bottom: _geo.top + _geo.height * 0.2 + 'px',
                            pointerEvents: 'none',
                            transform: 'scale(1)',
                        }}>
                        <BaseImage
                            // className='hideObject'
                            ref={showingOriginImgList[value]}
                            scale={showingLayoutList[letterNum][value].s}
                            posInfo={{ b: 1.1 + showingLayoutList[letterNum][value].b, r: showingLayoutList[letterNum][value].r }}
                            url={"SB_04_BG_PI/" + showingLayoutList[letterNum][value].wPath + ".svg"}
                        />

                        {/* <BaseImage
                                ref={showingHighImgList[value]}
                                scale={showingLayoutList[letterNum][value].s}
                                posInfo={{ b: 1.1, r: showingLayoutList[letterNum][value].r }}
                                url={"SB_04_BG_PI/" + showingLayoutList[letterNum][value].hPath + ".svg"}
                            /> */}
                        <BaseImage
                            posInfo={{ r: 0.02, b: showingLayoutList[letterNum][value].tb }}
                            url={"SB_04_Text_interactive_01/" + showingLayoutList[letterNum][value].tPath + ".svg"}
                        />
                    </div>
                )
            }

            {
                <div
                    ref={sparkBaseRef}
                    style={{
                        position: 'fixed', width: _geo.width * 0.15 + 'px',
                        height: _geo.height * 0.15 + 'px',
                        left: _geo.left + _geo.width * (0.1) + 'px',
                        bottom: _geo.top + _geo.height * 0.2 + 'px',
                        pointerEvents: 'none',
                    }}>
                    {[0, 1, 2].map(value =>
                        <BaseImage
                            ref={sparkRefList[value]}
                            className='hideObject'
                            posInfo={{
                                b: 1,
                                l: 0.0
                            }}
                            style={{ transform: 'scale(' + [0.3, 1.7, 2.4][value] + ')' }}
                            url={"Magic/sb_52_magic_wand_sparkels_" + (value + 1) + ".svg"}
                        />
                    )}
                </div>
            }

            <div ref={markParentRef}>
                {
                    [0, 1, 2].map(value =>
                        <div
                            key={value}
                            ref={markBaseList[2 - value]}
                            style={{
                                position: 'fixed',
                                width: _geo.width * 0.06 + 'px',
                                height: _geo.width * 0.06 + 'px',
                                right: _geo.width * (0.03 + 0.075 * value) + 'px',
                                top: 0.05 * _geo.height + 'px',
                                pointerEvents: 'none'
                            }}>
                            <BaseImage
                                ref={markRefList[2 - value]}
                                url="SB_04_Progress bar/SB_04_progress bar_04.svg"
                            />
                        </div>
                    )
                }
            </div>

            <div ref={drawingPanel}>
                <div id='DrawingDiv'
                    style={{
                        position: 'fixed', width: _geo.width, height: _geo.height, left: _geo.left, top: _geo.top,
                        WebkitMaskImage: 'url("' + prePathUrl() + 'images/SB_04_Text_interactive_02/' +
                            maskInfoList[letterNum].url + '.svg")',
                        WebkitMaskPosition: maskInfoList[letterNum].position,
                        WebkitMaskSize: maskInfoList[letterNum].size,
                        WebkitMaskRepeat: "no-repeat",
                        overflow: 'hidden',
                    }}
                >
                </div>
                <div id='highlightDiv'
                    style={{
                        position: 'fixed', width: _geo.width, height: _geo.height, left: _geo.left, top: _geo.top,
                        pointerEvents: 'none',
                        // opacity: 0
                    }}
                >
                </div>

            </div>

        </div >
    );
}

