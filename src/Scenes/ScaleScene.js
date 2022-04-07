import "../stylesheets/styles.css";
import "../stylesheets/button.css";
import { useEffect, useRef } from "react";
import { prePathUrl } from "../components/CommonFunctions";
import { returnSoundPath } from "../utils/loadSound";
import { transformlist, scaleImageList, audioInfoList } from "../components/CommonVariants"

export default function Scene({ nextFunc, _baseGeo,
    currentSceneNumber, audioList
}) {
    const parentObject = useRef()

    useEffect(() => {

        audioList.bodyAudio1.src = returnSoundPath('SB_04_Audio_' + audioInfoList[currentSceneNumber].origin)

        if (audioInfoList[currentSceneNumber].scale != null)
            audioList.bodyAudio2.src = returnSoundPath('SB_04_Audio_' + audioInfoList[currentSceneNumber].scale)

        setTimeout(() => {
            parentObject.current.style.transform = 'translate(0%,0%) scale(1)'
            parentObject.current.style.transition = '4s'
            audioList.bodyAudio1.play();
            setTimeout(() => {
                parentObject.current.style.transform =
                    'translate(' + transformlist[currentSceneNumber].x +
                    '%,' + transformlist[currentSceneNumber].y +
                    '%) scale(' + transformlist[currentSceneNumber].s + ')'

                setTimeout(() => {

                    let waitingTime = 2000
                    if (audioInfoList[currentSceneNumber].scale != null) {
                        waitingTime = audioList.bodyAudio2.duration * 1000 + 500
                        audioList.bodyAudio2.play();
                    }

                    setTimeout(() => {
                        parentObject.current.style.transition = '0.8s'
                        parentObject.current.className = 'hide'
                        setTimeout(() => {
                            nextFunc()
                        }, 800);
                    }, waitingTime);

                }, 5000);

            }, audioList.bodyAudio1.duration * 1000 + 1000);
        }, 1500);

        return () => {
        }

    }, [])



    return (
        <div
            className="aniObject"
            ref={parentObject}
            style={{
                position: "fixed", width: _baseGeo.width + "px"
                , height: _baseGeo.height + "px",
                left: _baseGeo.left + 'px',
                bottom: currentSceneNumber != 7 ? _baseGeo.bottom : 0 + 'px',
            }}
        >
            <div
                style={{
                    position: "absolute", width: '100%'
                    , height: '100%',
                    left: '0%',
                    top: '0%'
                }} >
                <img
                    width={'100%'}
                    style={{
                        position: 'absolute',
                        left: '0%',
                        bottom: '0%',

                    }}
                    src={prePathUrl() + "images/SB_04_BG/" + scaleImageList[currentSceneNumber] + ".svg"}
                />
            </div>
        </div>
    );
}

