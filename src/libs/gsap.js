import gsap from "gsap";
import {useGSAP} from "@gsap/react";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {SplitText} from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);


export { ScrollTrigger, SplitText, useGSAP};

export default gsap;
