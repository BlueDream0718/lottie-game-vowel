import React, { useState, useEffect } from 'react';
import { returnSoundPath } from '../utils/loadSound';
import "../stylesheets/styles.css";
import BaseImage from '../components/BaseImage';
import { letterList, audioPath } from "../components/CommonVariants"

export default function Scene2({ nextFunc, _geo, audioList, _baseGeo, currentSceneNumber }) {
    useEffect(
        () => {
            audioList.bodyAudio1.src = returnSoundPath("SB_04_Audio_" + audioPath[currentSceneNumber])
            setTimeout(() => {
                audioList.primaryAudio.play()
                setTimeout(() => {
                    // audioList.titleAudio.play();

                    // setTimeout(() => {
                    audioList.bodyAudio1.play();
                    setTimeout(() => {
                        nextFunc()
                    }, audioList.bodyAudio1.duration * 1000 + 1000);
                    // }, 2500);
                }, 1500);
            }, 1500);
            return () => {
            }
        }, []
    )

    return (
        <div className="aniObject"
        >
            <div style={{
                position: "fixed", width: _baseGeo.width + "px",
                height: _baseGeo.height + "px",
                left: _baseGeo.left + "px"
                , bottom: _baseGeo.bottom + 'px',
                pointerEvents: 'none'
            }}>
                <BaseImage
                    scale={0.6}
                    posInfo={{ l: 0.4, t: 0.4 }}
                    url={"SB_04_BG/SB_04_Text_A_to_ahaa_BG/SB_04_Text_A_to_ahaa_BG_02.svg"}
                />
                <BaseImage
                    scale={0.2}
                    posInfo={{ l: 0.52, t: 0.23 }}
                    url={"SB_04_BG/SB_04_Text_A_to_ahaa_BG/SB_04_Text_A_to_ahaa_BG_03.svg"}
                />

                <BaseImage
                    scale={0.1}
                    posInfo={{ l: 0.46, t: 0.05 }}
                    url={"SB_04_BG/SB_04_Text_A_to_ahaa_BG/SB_04_Text_A_to_ahaa_BG_04.svg"}
                />

                <BaseImage
                    scale={0.25}
                    posInfo={{ l: 0.12, t: 0.25 }}
                    url={"SB_04_BG/SB_04_Text_A_to_ahaa_BG/SB_04_Text_A_to_ahaa_BG_05.svg"}
                />



                <BaseImage
                    scale={letterList[currentSceneNumber].s}
                    posInfo={{ l: letterList[currentSceneNumber].l, t: letterList[currentSceneNumber].t }}
                    url={"SB_04_BG/SB_04_Text_A_to_ahaa_BG/SB_04_Text_" + letterList[currentSceneNumber].text + ".svg"}
                />


                {/* <Lottie autoplay loop options={returnOption(0)}
                    mouseDown={false}
                    isClickToPauseDisabled={true}
                    isStopped={isStop}
                    speed={0.96}
                /> */}
            </div>

            {/* <div
                className='commonButton'
                onClick={() => { setTimeout(gotoNext, 200); audioList.audioClick.play().catch(error=>{}); }}
                style={{
                    position: "fixed", width: _geo.width * 0.06 + "px",
                    height: _geo.width * 0.06 + "px",
                    right: '3%'
                    , bottom: '3%'
                    , cursor: "pointer",
                    overflow: 'hidden',
                }}>
                <img
                    width={"100%"}
                    draggable={false}
                    src={prePathUrl() + 'images/Buttons/Skip_blue.svg'}
                />
            </div> */}
        </div>
    );
}
