import { prePathUrl } from "../components/CommonFunctions";

const loadSound = (name, isEffectSound = false) => {
    return new Audio(prePathUrl() + "sounds/" + (isEffectSound ? "effect/" : "") + name + ".mp3")
}

const returnSoundPath = (name, isEffectSound = false) => {
    return prePathUrl() + "sounds/" + (isEffectSound ? "effect/" : "") + name + ".mp3"
}

export default loadSound
export { returnSoundPath }