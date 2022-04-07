
import React, { useState, useEffect, useRef } from 'react';

import TitleScene from "../Scenes/TitleScene";
import IntroScene from "../Scenes/IntroScene";
import ScaleScene from "../Scenes/ScaleScene";
import DrawingScene from "../Scenes/DrawingScene";
import ExcellentScene from "../Scenes/ExcellentScene";

import "../stylesheets/styles.css";
import "../stylesheets/button.css";

import { prePathUrl } from "./CommonFunctions";

const Switch = props => {
  const { test, children } = props
  // filter out only children with a matching prop
  return children.find(child => {
    return child.props.value === test
  })
}

var __geo;
var backgroundImageIndex = 0;
var backgroundImageList = [
  "SB_04_intro_BG_01", //1
  'SB_04_Text_A_to_ahaa_BG_01',
  "SB_40_BG",
  "SB_40_BG",
  'SB_04_shaabash_01'
];

const App = ({ geo, _setBackground, __controlBacksound, _startTransition,
  _hideIntroTitle, _showIntroTitle, baseGeo, _isBackloaded, _audioList,
  currentSceneNumber
}, ref) => {

  const [index, setIndex] = useState(0);
  const [_isBackSoundPlaying, _setBackgroundPlaying] = useState(true);
  const musicRef = useRef();
  __geo = geo;

  useEffect(
    () => {
      return () => {
      }
    }, []
  )

  function controlBacksound() {
    __controlBacksound();
    if (_isBackSoundPlaying) {
      _setBackgroundPlaying(false);
    }
    else {
      _setBackgroundPlaying(true);
    }
  }

  const transitionSceneList = [3, 8, 15]
  function changeBackgroundImage(judgeNum) {
    if (judgeNum == 1)
      _hideIntroTitle();
    let sendNum = -1;
    if (judgeNum == 0)
      sendNum = 0;
    if (transitionSceneList.includes(judgeNum))
      sendNum = 1;
    if (judgeNum != backgroundImageIndex) {
      backgroundImageIndex = judgeNum;
      _setBackground(backgroundImageList[judgeNum], sendNum);
    }
  }

  function setFomart(sceneNum) {
    if (sceneNum == 1) {
      musicRef.current.className = 'introText'
      setTimeout(() => {
        musicRef.current.className = 'commonButton'
      }, 1000);

    }
    setIndex(sceneNum);
    changeBackgroundImage(sceneNum);
  }

  React.useImperativeHandle(ref, () => ({
    nextFunc: () => {
      setFomart(1);
      _hideIntroTitle()

    },
    showMusicBtn: () => {

    }
  }))

  function nextFunc() {
    setFomart(index + 1);
  }

  function goHome() {
    backgroundImageIndex = 0;
    musicRef.current.className = 'hideObject'

    _audioList.backAudio.pause();
    _audioList.backAudio.currentTime = 0;

    setIndex(0);
    _showIntroTitle();
    _setBackground(backgroundImageList[0])
  }


  return (
    <div >
      <div className={_isBackloaded ? '' : 'hideObject'}>
        <Switch test={index}>
          <TitleScene key={0} nextFunc={nextFunc} _geo={__geo} value={0} />

          <IntroScene key={1} currentSceneNumber={currentSceneNumber} nextFunc={() => {
            if (currentSceneNumber != 12)
              nextFunc()
            else {
              setFomart(index + 2);
            }
          }} audioList={_audioList} _baseGeo={baseGeo} _geo={__geo} value={1} />
          <ScaleScene key={2} currentSceneNumber={currentSceneNumber} nextFunc={nextFunc} _baseGeo={baseGeo}
            audioList={_audioList} _geo={__geo} value={2} />
          <DrawingScene key={3}
            startTransition={_startTransition}
            currentSceneNumber={currentSceneNumber} nextFunc={nextFunc}
            _baseGeo={baseGeo} audioList={_audioList} _geo={__geo} value={3} />

          <ExcellentScene key={4} nextFunc={goHome} audioList={_audioList} _geo={__geo} value={4}
            _baseGeo={baseGeo}
          />

        </Switch>
      </div>

      <div
        ref={musicRef}
        className='hideObject'
        style={{
          position: "fixed", width: '5%',
          left: '2%',
          top: "47.5%",
          cursor: 'pointer',
        }}
        onClick={controlBacksound}
      >
        <img

          width={"100%"}
          draggable={false}
          src={prePathUrl() + "images/Buttons/" + (!_isBackSoundPlaying ? "Audio_mute" : "Audio_unmute") + ".svg"}
        />
      </div>
    </div >
  );
}

export default React.forwardRef(App);
